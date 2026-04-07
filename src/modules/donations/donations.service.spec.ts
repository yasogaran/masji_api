import { Test, TestingModule } from '@nestjs/testing';
import { DonationsService } from './donations.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { DonationType } from './dto/donation.dto';
import { Decimal } from '@prisma/client/runtime/library';

describe('DonationsService', () => {
  let service: DonationsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    donationCategory: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    donation: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    donationDistribution: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DonationsService>(DonationsService);
    prisma = module.get<PrismaService>(PrismaService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCategories', () => {
    it('should return active categories', async () => {
      const mockCategories = [
        { id: '1', name: 'Cash Donation', type: 'money', isActive: true },
        { id: '2', name: 'Food Items', type: 'goods', isActive: true },
      ];

      mockPrismaService.donationCategory.findMany.mockResolvedValue(mockCategories);

      const result = await service.getCategories();

      expect(result).toEqual(mockCategories);
      expect(mockPrismaService.donationCategory.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
    });

    it('should return all categories when includeInactive is true', async () => {
      const mockCategories = [
        { id: '1', name: 'Cash Donation', type: 'money', isActive: true },
        { id: '2', name: 'Inactive Category', type: 'money', isActive: false },
      ];

      mockPrismaService.donationCategory.findMany.mockResolvedValue(mockCategories);

      const result = await service.getCategories(true);

      expect(result).toEqual(mockCategories);
      expect(mockPrismaService.donationCategory.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by id', async () => {
      const mockCategory = { id: '1', name: 'Cash Donation', type: 'money', isActive: true };

      mockPrismaService.donationCategory.findUnique.mockResolvedValue(mockCategory);

      const result = await service.getCategoryById('1');

      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException if category not found', async () => {
      mockPrismaService.donationCategory.findUnique.mockResolvedValue(null);

      await expect(service.getCategoryById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const createDto = { name: 'New Category', type: 'money' };
      const mockCategory = { id: '1', ...createDto, isActive: true };

      mockPrismaService.donationCategory.create.mockResolvedValue(mockCategory);

      const result = await service.createCategory(createDto);

      expect(result).toEqual(mockCategory);
      expect(mockPrismaService.donationCategory.create).toHaveBeenCalledWith({
        data: {
          name: 'New Category',
          type: 'money',
          isActive: true,
        },
      });
    });
  });

  describe('getDonations', () => {
    it('should return paginated donations', async () => {
      const mockDonations = [
        {
          id: '1',
          donationType: 'money',
          amount: 5000,
          donationDate: new Date(),
          category: { id: '1', name: 'Cash Donation' },
          donor: { id: '1', fullName: 'Test Person', phone: '0771234567' },
        },
      ];

      mockPrismaService.donation.findMany.mockResolvedValue(mockDonations);
      mockPrismaService.donation.count.mockResolvedValue(1);

      const result = await service.getDonations({ page: 1, limit: 20 });

      expect(result.data).toEqual(mockDonations);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
    });

    it('should filter by year', async () => {
      mockPrismaService.donation.findMany.mockResolvedValue([]);
      mockPrismaService.donation.count.mockResolvedValue(0);

      await service.getDonations({ year: 2025, page: 1, limit: 20 });

      expect(mockPrismaService.donation.findMany).toHaveBeenCalled();
      const callArgs = mockPrismaService.donation.findMany.mock.calls[0][0];
      expect(callArgs.where.donationDate).toBeDefined();
    });

    it('should filter by type', async () => {
      mockPrismaService.donation.findMany.mockResolvedValue([]);
      mockPrismaService.donation.count.mockResolvedValue(0);

      await service.getDonations({ type: 'money', page: 1, limit: 20 });

      expect(mockPrismaService.donation.findMany).toHaveBeenCalled();
      const callArgs = mockPrismaService.donation.findMany.mock.calls[0][0];
      expect(callArgs.where.donationType).toBe('money');
    });
  });

  describe('getDonationById', () => {
    it('should return a donation by id', async () => {
      const mockDonation = {
        id: '1',
        donationType: 'money',
        amount: 5000,
        donor: { id: '1', fullName: 'Test Person' },
        category: { id: '1', name: 'Cash Donation' },
      };

      mockPrismaService.donation.findUnique.mockResolvedValue(mockDonation);

      const result = await service.getDonationById('1');

      expect(result).toEqual(mockDonation);
    });

    it('should throw NotFoundException if donation not found', async () => {
      mockPrismaService.donation.findUnique.mockResolvedValue(null);

      await expect(service.getDonationById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createDonation', () => {
    it('should create a money donation', async () => {
      const createDto = {
        categoryId: '1',
        donationType: DonationType.MONEY,
        amount: 5000,
        donationDate: '2025-01-01',
      };

      const mockDonation = {
        id: '1',
        ...createDto,
        donationDate: new Date('2025-01-01'),
        donor: null,
        category: { id: '1', name: 'Cash Donation' },
      };

      mockPrismaService.donation.create.mockResolvedValue(mockDonation);

      const result = await service.createDonation(createDto);

      expect(result).toEqual(mockDonation);
      expect(mockPrismaService.donation.create).toHaveBeenCalled();
    });

    it('should create a goods donation', async () => {
      const createDto = {
        categoryId: '1',
        donationType: DonationType.GOODS,
        itemDescription: 'Rice bags',
        quantity: 10,
        unit: 'bags',
        estimatedValue: 15000,
        donationDate: '2025-01-01',
      };

      const mockDonation = {
        id: '1',
        ...createDto,
        donationDate: new Date('2025-01-01'),
        donor: null,
        category: { id: '1', name: 'Food Items' },
      };

      mockPrismaService.donation.create.mockResolvedValue(mockDonation);

      const result = await service.createDonation(createDto);

      expect(result).toEqual(mockDonation);
    });
  });

  describe('deleteDonation', () => {
    it('should delete a donation', async () => {
      const mockDonation = { id: '1', donationType: 'money', amount: 5000 };

      mockPrismaService.donation.findUnique.mockResolvedValue(mockDonation);
      mockPrismaService.donation.delete.mockResolvedValue(mockDonation);

      const result = await service.deleteDonation('1');

      expect(result).toEqual(mockDonation);
      expect(mockPrismaService.donation.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if donation not found', async () => {
      mockPrismaService.donation.findUnique.mockResolvedValue(null);

      await expect(service.deleteDonation('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getDistributions', () => {
    it('should return paginated distributions', async () => {
      const mockDistributions = [
        {
          id: '1',
          distributionType: 'money',
          amount: 5000,
          distributionDate: new Date(),
          category: { id: '1', name: 'Cash Donation' },
          recipient: { id: '1', fullName: 'Test Person', phone: '0771234567' },
        },
      ];

      mockPrismaService.donationDistribution.findMany.mockResolvedValue(mockDistributions);
      mockPrismaService.donationDistribution.count.mockResolvedValue(1);

      const result = await service.getDistributions({ page: 1, limit: 20 });

      expect(result.data).toEqual(mockDistributions);
      expect(result.total).toBe(1);
    });
  });

  describe('createDistribution', () => {
    it('should create a distribution', async () => {
      const createDto = {
        categoryId: '1',
        distributionType: DonationType.MONEY,
        amount: 5000,
        reason: 'Monthly assistance',
        distributionDate: '2025-01-01',
      };

      const mockDistribution = {
        id: '1',
        ...createDto,
        distributionDate: new Date('2025-01-01'),
        recipient: null,
        category: { id: '1', name: 'Cash Donation' },
      };

      // Mock getStockByCategory dependencies
      mockPrismaService.donationCategory.findUnique.mockResolvedValue({
        id: '1', name: 'Cash Donation', type: 'money', isActive: true,
      });
      mockPrismaService.donation.aggregate
        .mockResolvedValueOnce({ _sum: { amount: new Decimal(50000) } }) // money donations
        .mockResolvedValueOnce({ _sum: { quantity: null, estimatedValue: null } }); // goods donations
      mockPrismaService.donationDistribution.aggregate
        .mockResolvedValueOnce({ _sum: { amount: new Decimal(0) } }) // money distributions
        .mockResolvedValueOnce({ _sum: { quantity: null } }); // goods distributions
      mockPrismaService.donation.findFirst.mockResolvedValue(null); // unit info

      mockPrismaService.donationDistribution.create.mockResolvedValue(mockDistribution);

      const result = await service.createDistribution(createDto);

      expect(result).toEqual(mockDistribution);
    });
  });

  describe('getDonationsSummary', () => {
    it('should return donations summary', async () => {
      mockPrismaService.donation.aggregate.mockResolvedValue({ _sum: { amount: 50000 }, _count: 10 });
      mockPrismaService.donation.groupBy.mockResolvedValue([]);
      mockPrismaService.$queryRaw.mockResolvedValue([]);

      const result = await service.getDonationsSummary(2025);

      expect(result).toBeDefined();
      expect(result.totalMoneyReceived).toBeDefined();
    });
  });
});

