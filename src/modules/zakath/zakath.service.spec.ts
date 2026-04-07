import { Test, TestingModule } from '@nestjs/testing';
import { ZakathService } from './zakath.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

describe('ZakathService', () => {
  let service: ZakathService;
  let mockPrismaService: any;

  beforeEach(async () => {
    mockPrismaService = {
      zakathCategory: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      zakathPeriod: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      zakathCollection: {
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
      zakathRequest: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
        groupBy: jest.fn(),
      },
      zakathDistribution: {
        findUnique: jest.fn(),
        create: jest.fn(),
        aggregate: jest.fn(),
      },
      person: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZakathService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ZakathService>(ZakathService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Categories', () => {
    const mockCategories = [
      { id: 'cat1', name: 'Al-Fuqara', nameArabic: 'الفقراء', sortOrder: 1, isActive: true },
      { id: 'cat2', name: 'Al-Masakin', nameArabic: 'المساكين', sortOrder: 2, isActive: true },
    ];

    it('should return active categories', async () => {
      mockPrismaService.zakathCategory.findMany.mockResolvedValue(mockCategories);

      const result = await service.getCategories();

      expect(result).toEqual(mockCategories);
      expect(mockPrismaService.zakathCategory.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
    });

    it('should return all categories including inactive', async () => {
      mockPrismaService.zakathCategory.findMany.mockResolvedValue(mockCategories);

      const result = await service.getAllCategories();

      expect(result).toEqual(mockCategories);
    });

    it('should create a new category', async () => {
      const createDto = { name: 'Test Category', nameArabic: 'اختبار', sortOrder: 10 };
      const createdCategory = { id: 'new-cat', ...createDto, isActive: true };
      mockPrismaService.zakathCategory.create.mockResolvedValue(createdCategory);

      const result = await service.createCategory(createDto);

      expect(result).toEqual(createdCategory);
    });

    it('should throw when category not found', async () => {
      mockPrismaService.zakathCategory.findUnique.mockResolvedValue(null);

      await expect(service.getCategoryById('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should not delete category used in requests', async () => {
      mockPrismaService.zakathCategory.findUnique.mockResolvedValue(mockCategories[0]);
      mockPrismaService.zakathRequest.count.mockResolvedValue(5);

      await expect(service.deleteCategory('cat1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('Periods/Cycles', () => {
    const mockPeriod = {
      id: 'period1',
      name: 'Ramadan 1446',
      hijriYear: 1446,
      hijriMonth: 9,
      status: 'active',
      isActive: true,
      _count: { collections: 10, requests: 5 },
    };

    it('should return periods with pagination', async () => {
      mockPrismaService.zakathPeriod.findMany.mockResolvedValue([mockPeriod]);
      mockPrismaService.zakathPeriod.count.mockResolvedValue(1);

      const result = await service.getPeriods({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should return active period', async () => {
      mockPrismaService.zakathPeriod.findFirst.mockResolvedValue(mockPeriod);

      const result = await service.getActivePeriod();

      expect(result).toEqual(mockPeriod);
    });

    it('should create a new period', async () => {
      const createDto = { name: 'Ramadan 1447', hijriYear: 1447, hijriMonth: 9 };
      const createdPeriod = { id: 'new-period', ...createDto, status: 'active' };
      mockPrismaService.zakathPeriod.create.mockResolvedValue(createdPeriod);

      const result = await service.createPeriod(createDto);

      expect(result.status).toBe('active');
    });

    it('should complete a cycle with totals', async () => {
      mockPrismaService.zakathPeriod.findUnique.mockResolvedValue(mockPeriod);
      mockPrismaService.zakathCollection.aggregate.mockResolvedValue({ _sum: { amount: new Decimal(50000) } });
      mockPrismaService.zakathDistribution.aggregate.mockResolvedValue({ _sum: { amount: new Decimal(45000) } });
      mockPrismaService.zakathPeriod.update.mockResolvedValue({
        ...mockPeriod,
        status: 'completed',
        totalCollected: new Decimal(50000),
        totalDistributed: new Decimal(45000),
      });

      const result = await service.completeCycle('period1');

      expect(result.status).toBe('completed');
    });

    it('should throw when completing already completed cycle', async () => {
      mockPrismaService.zakathPeriod.findUnique.mockResolvedValue({
        ...mockPeriod,
        status: 'completed',
      });

      await expect(service.completeCycle('period1')).rejects.toThrow(BadRequestException);
    });

    it('should not delete period with collections', async () => {
      mockPrismaService.zakathPeriod.findUnique.mockResolvedValue(mockPeriod);

      await expect(service.deletePeriod('period1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('Collections', () => {
    const mockCollection = {
      id: 'col1',
      zakathPeriodId: 'period1',
      donorId: 'person1',
      amount: new Decimal(10000),
      collectionDate: new Date(),
      donor: { id: 'person1', fullName: 'John Doe' },
      zakathPeriod: { id: 'period1', name: 'Ramadan 1446', status: 'active' },
    };

    it('should return collections with pagination', async () => {
      mockPrismaService.zakathCollection.findMany.mockResolvedValue([mockCollection]);
      mockPrismaService.zakathCollection.count.mockResolvedValue(1);

      const result = await service.getCollections({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should create a collection', async () => {
      mockPrismaService.zakathPeriod.findUnique.mockResolvedValue({
        id: 'period1',
        status: 'active',
        _count: { collections: 0, requests: 0 },
      });
      mockPrismaService.zakathCollection.create.mockResolvedValue(mockCollection);

      const result = await service.createCollection({
        zakathPeriodId: 'period1',
        donorId: 'person1',
        amount: 10000,
        collectionDate: '2025-03-15',
      });

      expect(result).toEqual(mockCollection);
    });

    it('should throw when adding collection to non-active period', async () => {
      mockPrismaService.zakathPeriod.findUnique.mockResolvedValue({
        id: 'period1',
        status: 'completed',
        _count: { collections: 10, requests: 5 },
      });

      await expect(
        service.createCollection({
          zakathPeriodId: 'period1',
          amount: 10000,
          collectionDate: '2025-03-15',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Requests', () => {
    const mockRequest = {
      id: 'req1',
      zakathPeriodId: 'period1',
      requesterId: 'person1',
      categoryId: 'cat1',
      amountRequested: new Decimal(5000),
      reason: 'Medical expenses',
      status: 'pending',
      requester: { id: 'person1', fullName: 'Jane Doe' },
      category: { id: 'cat1', name: 'Al-Fuqara' },
      zakathPeriod: { id: 'period1', status: 'active' },
      distributions: [],
    };

    it('should return requests with pagination and filters', async () => {
      mockPrismaService.zakathRequest.findMany.mockResolvedValue([mockRequest]);
      mockPrismaService.zakathRequest.count.mockResolvedValue(1);

      const result = await service.getRequests({
        zakathPeriodId: 'period1',
        status: 'pending' as any, // Cast to avoid enum type issue
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should create a request', async () => {
      mockPrismaService.zakathPeriod.findUnique.mockResolvedValue({
        id: 'period1',
        status: 'active',
        _count: { collections: 0, requests: 0 },
      });
      mockPrismaService.zakathCategory.findUnique.mockResolvedValue({ id: 'cat1', name: 'Al-Fuqara' });
      mockPrismaService.zakathRequest.create.mockResolvedValue(mockRequest);

      const result = await service.createRequest({
        zakathPeriodId: 'period1',
        requesterId: 'person1',
        categoryId: 'cat1',
        amountRequested: 5000,
        reason: 'Medical expenses',
      });

      expect(result.status).toBe('pending');
    });

    it('should approve a request', async () => {
      mockPrismaService.zakathRequest.findUnique.mockResolvedValue(mockRequest);
      mockPrismaService.zakathRequest.update.mockResolvedValue({
        ...mockRequest,
        status: 'approved',
        amountApproved: new Decimal(4500),
      });

      const result = await service.approveRequest('req1', {
        amountApproved: 4500,
        decisionNotes: 'Approved after verification',
      });

      expect(result.status).toBe('approved');
    });

    it('should reject a request', async () => {
      mockPrismaService.zakathRequest.findUnique.mockResolvedValue(mockRequest);
      mockPrismaService.zakathRequest.update.mockResolvedValue({
        ...mockRequest,
        status: 'rejected',
      });

      const result = await service.rejectRequest('req1', {
        decisionNotes: 'Does not meet criteria',
      });

      expect(result.status).toBe('rejected');
    });

    it('should not approve non-pending request', async () => {
      mockPrismaService.zakathRequest.findUnique.mockResolvedValue({
        ...mockRequest,
        status: 'approved',
      });

      await expect(
        service.approveRequest('req1', { amountApproved: 4500 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Distributions', () => {
    const mockApprovedRequest = {
      id: 'req1',
      status: 'approved',
      amountApproved: new Decimal(5000),
      distributions: [],
    };

    it('should create a distribution', async () => {
      mockPrismaService.zakathRequest.findUnique.mockResolvedValue(mockApprovedRequest);
      mockPrismaService.zakathDistribution.create.mockResolvedValue({
        id: 'dist1',
        zakathRequestId: 'req1',
        amount: new Decimal(5000),
        distributedAt: new Date(),
      });
      mockPrismaService.zakathRequest.update.mockResolvedValue({
        ...mockApprovedRequest,
        status: 'distributed',
      });

      const result = await service.createDistribution({
        zakathRequestId: 'req1',
        amount: 5000,
      });

      expect(result.amount).toEqual(new Decimal(5000));
    });

    it('should create partial distribution', async () => {
      mockPrismaService.zakathRequest.findUnique.mockResolvedValue(mockApprovedRequest);
      mockPrismaService.zakathDistribution.create.mockResolvedValue({
        id: 'dist1',
        zakathRequestId: 'req1',
        amount: new Decimal(2500),
      });
      mockPrismaService.zakathRequest.update.mockResolvedValue({
        ...mockApprovedRequest,
        status: 'partial',
      });

      const result = await service.createDistribution({
        zakathRequestId: 'req1',
        amount: 2500,
      });

      expect(result.amount).toEqual(new Decimal(2500));
    });

    it('should throw when distribution exceeds approved amount', async () => {
      mockPrismaService.zakathRequest.findUnique.mockResolvedValue({
        ...mockApprovedRequest,
        distributions: [{ amount: new Decimal(3000) }],
      });

      await expect(
        service.createDistribution({
          zakathRequestId: 'req1',
          amount: 3000,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Reports', () => {
    const mockPeriod = {
      id: 'period1',
      name: 'Ramadan 1446',
      status: 'active',
      _count: { collections: 10, requests: 5 },
    };

    it('should generate period report', async () => {
      mockPrismaService.zakathPeriod.findUnique.mockResolvedValue(mockPeriod);
      mockPrismaService.zakathCollection.aggregate.mockResolvedValue({
        _sum: { amount: new Decimal(50000) },
        _count: 10,
      });
      mockPrismaService.zakathDistribution.aggregate.mockResolvedValue({
        _sum: { amount: new Decimal(40000) },
        _count: 8,
      });
      mockPrismaService.zakathRequest.groupBy.mockResolvedValue([
        { status: 'pending', _count: 2, _sum: { amountRequested: new Decimal(10000) } },
        { status: 'approved', _count: 3, _sum: { amountApproved: new Decimal(15000) } },
      ]);
      mockPrismaService.zakathCollection.groupBy.mockResolvedValue([]);
      mockPrismaService.zakathCategory.findMany.mockResolvedValue([]);
      mockPrismaService.person.findMany.mockResolvedValue([]);

      const result = await service.getPeriodReport('period1');

      expect(result.summary.totalCollected).toEqual(new Decimal(50000));
      expect(result.summary.totalDistributed).toEqual(new Decimal(40000));
      expect(result.summary.balance).toBe(10000);
    });

    it('should generate overall report', async () => {
      mockPrismaService.zakathPeriod.findMany.mockResolvedValue([mockPeriod]);
      mockPrismaService.zakathCollection.aggregate.mockResolvedValue({
        _sum: { amount: new Decimal(100000) },
        _count: 50,
      });
      mockPrismaService.zakathDistribution.aggregate.mockResolvedValue({
        _sum: { amount: new Decimal(80000) },
        _count: 40,
      });
      mockPrismaService.zakathRequest.groupBy.mockResolvedValue([]);
      mockPrismaService.zakathCategory.findMany.mockResolvedValue([]);

      const result = await service.getOverallReport();

      expect(result.overall.totalCollected).toEqual(new Decimal(100000));
      expect(result.overall.totalDistributed).toEqual(new Decimal(80000));
    });
  });
});

