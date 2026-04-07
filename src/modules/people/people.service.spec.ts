import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { createMockPrismaService, MockPrismaService } from '../../__mocks__/prisma.mock';

describe('PeopleService', () => {
  let service: PeopleService;
  let prisma: MockPrismaService;

  const mockPerson = {
    id: 'person-1',
    fullName: 'John Doe',
    nic: '123456789V',
    dob: new Date('1990-01-01'),
    gender: 'male',
    phone: '0771234567',
    email: 'john@example.com',
    houseId: 'house-1',
    familyHeadId: null,
    memberStatusId: 1,
    civilStatusId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockHouse = {
    id: 'house-1',
    houseNumber: 1,
    mahalla: {
      id: 'mahalla-1',
      title: 'Test Mahalla',
    },
  };

  beforeEach(async () => {
    prisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<PeopleService>(PeopleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated people', async () => {
      const mockPeople = [{ ...mockPerson, house: mockHouse }];
      prisma.person.findMany.mockResolvedValue(mockPeople);
      prisma.person.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toEqual(mockPeople);
      expect(result.meta).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
    });

    it('should search by name, NIC, or phone', async () => {
      prisma.person.findMany.mockResolvedValue([]);
      prisma.person.count.mockResolvedValue(0);

      await service.findAll({ search: 'John' });

      expect(prisma.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { fullName: { contains: 'John', mode: 'insensitive' } },
              { nic: { contains: 'John' } },
              { phone: { contains: 'John' } },
            ],
          }),
        }),
      );
    });

    it('should filter by houseId', async () => {
      prisma.person.findMany.mockResolvedValue([]);
      prisma.person.count.mockResolvedValue(0);

      await service.findAll({ houseId: 'house-1' });

      expect(prisma.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            houseId: 'house-1',
          }),
        }),
      );
    });

    it('should filter by mahallaId', async () => {
      prisma.person.findMany.mockResolvedValue([]);
      prisma.person.count.mockResolvedValue(0);

      await service.findAll({ mahallaId: 'mahalla-1' });

      expect(prisma.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            house: { mahallaId: 'mahalla-1' },
          }),
        }),
      );
    });

    it('should filter by member status', async () => {
      prisma.person.findMany.mockResolvedValue([]);
      prisma.person.count.mockResolvedValue(0);

      await service.findAll({ status: 1 });

      expect(prisma.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            memberStatusId: 1,
          }),
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return a person with all relations', async () => {
      const mockPersonWithRelations = {
        ...mockPerson,
        house: mockHouse,
        familyHead: null,
        houseMembers: [],
        memberStatus: { id: 1, title: 'Active' },
      };
      prisma.person.findUnique.mockResolvedValue(mockPersonWithRelations);

      const result = await service.findById('person-1');

      expect(result).toEqual(mockPersonWithRelations);
      expect(prisma.person.findUnique).toHaveBeenCalledWith({
        where: { id: 'person-1' },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException when person not found', async () => {
      prisma.person.findUnique.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByNic', () => {
    it('should return a person by NIC', async () => {
      prisma.person.findUnique.mockResolvedValue({
        ...mockPerson,
        house: mockHouse,
      });

      const result = await service.findByNic('123456789V');

      expect(result?.nic).toBe('123456789V');
      expect(prisma.person.findUnique).toHaveBeenCalledWith({
        where: { nic: '123456789V' },
        include: expect.any(Object),
      });
    });
  });

  describe('create', () => {
    it('should create a new person', async () => {
      const createDto = {
        fullName: 'Jane Doe',
        houseId: 'house-1',
        gender: 'female',
      };
      
      prisma.person.create.mockResolvedValue({
        ...mockPerson,
        ...createDto,
        id: 'person-2',
      });

      const result = await service.create(createDto, 'user-1');

      expect(result.fullName).toBe('Jane Doe');
      expect(prisma.person.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...createDto,
          createdBy: 'user-1',
        }),
        include: expect.any(Object),
      });
    });

    it('should throw BadRequestException if NIC already exists', async () => {
      const createDto = {
        fullName: 'Jane Doe',
        houseId: 'house-1',
        nic: '123456789V',
      };
      
      prisma.person.findUnique.mockResolvedValue(mockPerson);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(prisma.person.create).not.toHaveBeenCalled();
    });

    it('should allow creation without NIC', async () => {
      const createDto = {
        fullName: 'Jane Doe',
        houseId: 'house-1',
      };
      
      prisma.person.create.mockResolvedValue({
        ...mockPerson,
        ...createDto,
        nic: null,
      });

      const result = await service.create(createDto);

      expect(result.fullName).toBe('Jane Doe');
    });
  });

  describe('update', () => {
    it('should update an existing person', async () => {
      const updateDto = { fullName: 'John Updated' };
      prisma.person.findUnique.mockResolvedValue(mockPerson);
      prisma.person.update.mockResolvedValue({ ...mockPerson, ...updateDto });

      const result = await service.update('person-1', updateDto);

      expect(result.fullName).toBe('John Updated');
    });

    it('should throw NotFoundException when person not found', async () => {
      prisma.person.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { fullName: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if updating to existing NIC', async () => {
      const updateDto = { nic: '987654321V' };
      prisma.person.findUnique
        .mockResolvedValueOnce(mockPerson) // First call for finding the person
        .mockResolvedValueOnce({ ...mockPerson, id: 'person-2', nic: '987654321V' }); // Second call for NIC check

      await expect(service.update('person-1', updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should allow updating NIC to the same value', async () => {
      const updateDto = { nic: '123456789V' };
      prisma.person.findUnique.mockResolvedValue(mockPerson);
      prisma.person.update.mockResolvedValue(mockPerson);

      const result = await service.update('person-1', updateDto);

      expect(result.nic).toBe('123456789V');
    });
  });

  describe('delete', () => {
    it('should delete a person who is not a family head', async () => {
      prisma.person.count.mockResolvedValue(0); // No family members
      prisma.person.delete.mockResolvedValue(mockPerson);

      const result = await service.delete('person-1');

      expect(result).toEqual({ message: 'Person deleted successfully' });
    });

    it('should throw BadRequestException if person is a family head with members', async () => {
      prisma.person.count.mockResolvedValue(2); // Has 2 family members

      await expect(service.delete('person-1')).rejects.toThrow(
        BadRequestException,
      );
      expect(prisma.person.delete).not.toHaveBeenCalled();
    });
  });

  describe('getFamilyHeads', () => {
    it('should return all family heads', async () => {
      const mockHeads = [
        { ...mockPerson, familyHeadId: null, familyMembers: [] },
      ];
      prisma.person.findMany.mockResolvedValue(mockHeads);

      const result = await service.getFamilyHeads();

      expect(result).toEqual(mockHeads);
      expect(prisma.person.findMany).toHaveBeenCalledWith({
        where: { familyHeadId: null },
        include: expect.any(Object),
        orderBy: { fullName: 'asc' },
      });
    });

    it('should filter family heads by mahalla', async () => {
      prisma.person.findMany.mockResolvedValue([]);

      await service.getFamilyHeads('mahalla-1');

      expect(prisma.person.findMany).toHaveBeenCalledWith({
        where: {
          familyHeadId: null,
          house: { mahallaId: 'mahalla-1' },
        },
        include: expect.any(Object),
        orderBy: { fullName: 'asc' },
      });
    });
  });

  describe('getLookups', () => {
    it('should return all lookup data', async () => {
      const mockStatuses = [{ id: 1, title: 'Active' }];
      const mockCivilStatuses = [{ id: 1, title: 'Single' }];
      const mockEducation = [{ id: 1, title: 'High School' }];
      const mockOccupations = [{ id: 1, title: 'Teacher' }];
      const mockRelationships = [{ id: 1, title: 'Spouse' }];

      prisma.memberStatus.findMany.mockResolvedValue(mockStatuses);
      prisma.civilStatus.findMany.mockResolvedValue(mockCivilStatuses);
      prisma.educationLevel.findMany.mockResolvedValue(mockEducation);
      prisma.occupation.findMany.mockResolvedValue(mockOccupations);
      prisma.relationshipType.findMany.mockResolvedValue(mockRelationships);

      const result = await service.getLookups();

      expect(result).toEqual({
        memberStatuses: mockStatuses,
        civilStatuses: mockCivilStatuses,
        educationLevels: mockEducation,
        occupations: mockOccupations,
        relationshipTypes: mockRelationships,
      });
    });
  });
});

