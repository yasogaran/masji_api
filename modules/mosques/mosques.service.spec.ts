import { Test, TestingModule } from '@nestjs/testing';
import { MosquesService } from './mosques.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { createMockPrismaService, MockPrismaService } from '../../__mocks__/prisma.mock';

describe('MosquesService', () => {
  let service: MosquesService;
  let prisma: MockPrismaService;

  const mockMosque = {
    id: 'mosque-1',
    mahallaId: 'mahalla-1',
    name: 'Test Mosque',
    mosqueType: 'sub',
    addressLine1: '123 Mosque St',
    addressLine2: null,
    city: 'Test City',
    phone: '0111234567',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    mahalla: {
      id: 'mahalla-1',
      title: 'Test Mahalla',
    },
  };

  const mockParentMosque = {
    ...mockMosque,
    id: 'mosque-parent',
    name: 'Main Mosque',
    mosqueType: 'parent',
  };

  beforeEach(async () => {
    prisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MosquesService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<MosquesService>(MosquesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all active mosques with mahalla and count', async () => {
      const mockMosques = [
        { ...mockParentMosque, _count: { roleAssignments: 5 } },
        { ...mockMosque, _count: { roleAssignments: 2 } },
      ];
      prisma.mosque.findMany.mockResolvedValue(mockMosques);

      const result = await service.findAll();

      expect(result).toEqual(mockMosques);
      expect(prisma.mosque.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        include: {
          mahalla: true,
          _count: {
            select: {
              roleAssignments: true,
            },
          },
        },
        orderBy: [{ mosqueType: 'asc' }, { name: 'asc' }],
      });
    });
  });

  describe('findById', () => {
    it('should return a mosque with role assignments', async () => {
      const mockMosqueWithRoles = {
        ...mockMosque,
        roleAssignments: [
          {
            id: 'assignment-1',
            person: { fullName: 'Imam' },
            mosqueRole: { roleName: 'Imam' },
          },
        ],
      };
      prisma.mosque.findUnique.mockResolvedValue(mockMosqueWithRoles);

      const result = await service.findById('mosque-1');

      expect(result).toEqual(mockMosqueWithRoles);
    });

    it('should throw NotFoundException when mosque not found', async () => {
      prisma.mosque.findUnique.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getParentMosque', () => {
    it('should return the parent mosque', async () => {
      prisma.mosque.findFirst.mockResolvedValue(mockParentMosque);

      const result = await service.getParentMosque();

      expect(result).toEqual(mockParentMosque);
      expect(prisma.mosque.findFirst).toHaveBeenCalledWith({
        where: { mosqueType: 'parent', isActive: true },
        include: { mahalla: true },
      });
    });

    it('should return null if no parent mosque exists', async () => {
      prisma.mosque.findFirst.mockResolvedValue(null);

      const result = await service.getParentMosque();

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a sub mosque', async () => {
      const createDto = {
        mahallaId: 'mahalla-1',
        name: 'New Sub Mosque',
        mosqueType: 'sub',
      };
      prisma.mosque.create.mockResolvedValue({
        ...mockMosque,
        ...createDto,
      });

      const result = await service.create(createDto);

      expect(result.name).toBe('New Sub Mosque');
      expect(result.mosqueType).toBe('sub');
    });

    it('should create a parent mosque when none exists', async () => {
      const createDto = {
        mahallaId: 'mahalla-1',
        name: 'Main Mosque',
        mosqueType: 'parent',
      };
      prisma.mosque.findFirst.mockResolvedValue(null);
      prisma.mosque.create.mockResolvedValue({
        ...mockMosque,
        ...createDto,
      });

      const result = await service.create(createDto);

      expect(result.mosqueType).toBe('parent');
    });

    it('should throw BadRequestException when creating second parent mosque', async () => {
      const createDto = {
        mahallaId: 'mahalla-1',
        name: 'Another Parent',
        mosqueType: 'parent',
      };
      prisma.mosque.findFirst.mockResolvedValue(mockParentMosque);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(prisma.mosque.create).not.toHaveBeenCalled();
    });

    it('should default to sub mosque type', async () => {
      const createDto = {
        mahallaId: 'mahalla-1',
        name: 'New Mosque',
      };
      prisma.mosque.create.mockResolvedValue({
        ...mockMosque,
        ...createDto,
        mosqueType: 'sub',
      });

      const result = await service.create(createDto);

      expect(result.mosqueType).toBe('sub');
      expect(prisma.mosque.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          mosqueType: 'sub',
        }),
        include: { mahalla: true },
      });
    });
  });

  describe('update', () => {
    it('should update an existing mosque', async () => {
      const updateDto = { name: 'Updated Mosque Name' };
      prisma.mosque.findUnique.mockResolvedValue(mockMosque);
      prisma.mosque.update.mockResolvedValue({ ...mockMosque, ...updateDto });

      const result = await service.update('mosque-1', updateDto);

      expect(result.name).toBe('Updated Mosque Name');
    });

    it('should throw NotFoundException when mosque not found', async () => {
      prisma.mosque.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should allow changing sub mosque to parent when no parent exists', async () => {
      const updateDto = { mosqueType: 'parent' };
      prisma.mosque.findUnique.mockResolvedValue(mockMosque);
      prisma.mosque.findFirst.mockResolvedValue(null);
      prisma.mosque.update.mockResolvedValue({ ...mockMosque, ...updateDto });

      const result = await service.update('mosque-1', updateDto);

      expect(result.mosqueType).toBe('parent');
    });

    it('should throw BadRequestException when changing to parent and one exists', async () => {
      const updateDto = { mosqueType: 'parent' };
      prisma.mosque.findUnique.mockResolvedValue(mockMosque);
      prisma.mosque.findFirst.mockResolvedValue(mockParentMosque);

      await expect(service.update('mosque-1', updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should allow parent mosque to remain parent on update', async () => {
      const updateDto = { name: 'Updated Parent Name', mosqueType: 'parent' };
      prisma.mosque.findUnique.mockResolvedValue(mockParentMosque);
      prisma.mosque.update.mockResolvedValue({ ...mockParentMosque, ...updateDto });

      const result = await service.update('mosque-parent', updateDto);

      expect(result.name).toBe('Updated Parent Name');
    });
  });

  describe('delete', () => {
    it('should delete a mosque with no role assignments', async () => {
      prisma.mosque.findUnique.mockResolvedValue(mockMosque);
      prisma.mosqueRoleAssignment.count.mockResolvedValue(0);
      prisma.mosque.delete.mockResolvedValue(mockMosque);

      const result = await service.delete('mosque-1');

      expect(result).toEqual({ message: 'Mosque deleted successfully' });
    });

    it('should throw NotFoundException when mosque not found', async () => {
      prisma.mosque.findUnique.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when mosque has role assignments', async () => {
      prisma.mosque.findUnique.mockResolvedValue(mockMosque);
      prisma.mosqueRoleAssignment.count.mockResolvedValue(3);

      await expect(service.delete('mosque-1')).rejects.toThrow(
        BadRequestException,
      );
      expect(prisma.mosque.delete).not.toHaveBeenCalled();
    });
  });

  describe('getRoles', () => {
    it('should return all active mosque roles', async () => {
      const mockRoles = [
        { id: 'role-1', roleName: 'Imam', isActive: true },
        { id: 'role-2', roleName: 'Muezzin', isActive: true },
      ];
      prisma.mosqueRole.findMany.mockResolvedValue(mockRoles);

      const result = await service.getRoles();

      expect(result).toEqual(mockRoles);
      expect(prisma.mosqueRole.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { roleName: 'asc' },
      });
    });
  });
});

