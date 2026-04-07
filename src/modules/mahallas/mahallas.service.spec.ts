import { Test, TestingModule } from '@nestjs/testing';
import { MahallasService } from './mahallas.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { createMockPrismaService, MockPrismaService } from '../../__mocks__/prisma.mock';

describe('MahallasService', () => {
  let service: MahallasService;
  let prisma: MockPrismaService;

  const mockMahalla = {
    id: 'mahalla-1',
    title: 'Test Mahalla',
    description: 'Test Description',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-1',
  };

  beforeEach(async () => {
    prisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MahallasService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<MahallasService>(MahallasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all active mahallas with counts', async () => {
      const mockMahallas = [
        { ...mockMahalla, _count: { houses: 5, mosques: 2 } },
      ];
      prisma.mahalla.findMany.mockResolvedValue(mockMahallas);
      // person.count is called twice per mahalla (familyCount + peopleCount)
      prisma.person.count.mockResolvedValue(0);

      const result = await service.findAll();

      expect(result).toEqual([
        { ...mockMahalla, _count: { houses: 5, mosques: 2, families: 0, people: 0 } },
      ]);
      expect(prisma.mahalla.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        include: {
          _count: {
            select: {
              houses: true,
              mosques: true,
            },
          },
        },
        orderBy: { title: 'asc' },
      });
    });
  });

  describe('findById', () => {
    it('should return a mahalla by id with related data', async () => {
      const mockMahallaWithRelations = {
        ...mockMahalla,
        houses: [],
        mosques: [],
        _count: { houses: 0, mosques: 0 },
      };
      prisma.mahalla.findUnique.mockResolvedValue(mockMahallaWithRelations);

      const result = await service.findById('mahalla-1');

      expect(result).toEqual(mockMahallaWithRelations);
      expect(prisma.mahalla.findUnique).toHaveBeenCalledWith({
        where: { id: 'mahalla-1' },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException when mahalla not found', async () => {
      prisma.mahalla.findUnique.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new mahalla', async () => {
      const createDto = { title: 'New Mahalla', description: 'Description' };
      prisma.mahalla.create.mockResolvedValue({ ...mockMahalla, ...createDto });

      const result = await service.create(createDto, 'user-1');

      expect(result.title).toBe('New Mahalla');
      expect(prisma.mahalla.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          createdBy: 'user-1',
        },
      });
    });

    it('should create mahalla without createdBy', async () => {
      const createDto = { title: 'New Mahalla' };
      prisma.mahalla.create.mockResolvedValue({ ...mockMahalla, ...createDto });

      const result = await service.create(createDto);

      expect(result.title).toBe('New Mahalla');
      expect(prisma.mahalla.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          createdBy: undefined,
        },
      });
    });
  });

  describe('update', () => {
    it('should update an existing mahalla', async () => {
      const updateDto = { title: 'Updated Mahalla' };
      prisma.mahalla.findUnique.mockResolvedValue(mockMahalla);
      prisma.mahalla.update.mockResolvedValue({ ...mockMahalla, ...updateDto });

      const result = await service.update('mahalla-1', updateDto);

      expect(result.title).toBe('Updated Mahalla');
      expect(prisma.mahalla.update).toHaveBeenCalledWith({
        where: { id: 'mahalla-1' },
        data: updateDto,
      });
    });

    it('should throw NotFoundException when mahalla not found', async () => {
      prisma.mahalla.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { title: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a mahalla with no houses', async () => {
      prisma.house.count.mockResolvedValue(0);
      prisma.mahalla.delete.mockResolvedValue(mockMahalla);

      const result = await service.delete('mahalla-1');

      expect(result).toEqual({ message: 'Mahalla deleted successfully' });
      expect(prisma.mahalla.delete).toHaveBeenCalledWith({
        where: { id: 'mahalla-1' },
      });
    });

    it('should throw BadRequestException when mahalla has houses', async () => {
      prisma.house.count.mockResolvedValue(5);

      await expect(service.delete('mahalla-1')).rejects.toThrow(
        BadRequestException,
      );
      expect(prisma.mahalla.delete).not.toHaveBeenCalled();
    });
  });

  describe('getStats', () => {
    it('should return statistics for a mahalla', async () => {
      prisma.house.count.mockResolvedValue(10);
      prisma.mosque.count.mockResolvedValue(2);
      prisma.person.count
        .mockResolvedValueOnce(50)   // totalPeople
        .mockResolvedValueOnce(45)   // activeMembers
        .mockResolvedValueOnce(25)   // maleCount
        .mockResolvedValueOnce(25)   // femaleCount
        .mockResolvedValueOnce(12);  // totalFamilies

      const result = await service.getStats('mahalla-1');

      expect(result).toEqual({
        totalHouses: 10,
        totalPeople: 50,
        activeMembers: 45,
        totalMosques: 2,
        maleCount: 25,
        femaleCount: 25,
        totalFamilies: 12,
      });
    });
  });
});

