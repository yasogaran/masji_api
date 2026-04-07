"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const houses_service_1 = require("./houses.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const prisma_mock_1 = require("../../__mocks__/prisma.mock");
describe('HousesService', () => {
    let service;
    let prisma;
    const mockHouse = {
        id: 'house-1',
        mahallaId: 'mahalla-1',
        houseNumber: 1,
        addressLine1: '123 Main St',
        addressLine2: null,
        addressLine3: null,
        city: 'Test City',
        postalCode: '12345',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        mahalla: {
            id: 'mahalla-1',
            title: 'Test Mahalla',
        },
    };
    beforeEach(async () => {
        prisma = (0, prisma_mock_1.createMockPrismaService)();
        const module = await testing_1.Test.createTestingModule({
            providers: [
                houses_service_1.HousesService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: prisma,
                },
            ],
        }).compile();
        service = module.get(houses_service_1.HousesService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('findAll', () => {
        it('should return paginated houses', async () => {
            const mockHouses = [{ ...mockHouse, _count: { people: 4 } }];
            prisma.house.findMany.mockResolvedValue(mockHouses);
            prisma.house.count.mockResolvedValue(1);
            const result = await service.findAll({ page: 1, limit: 20 });
            expect(result.data).toEqual(mockHouses);
            expect(result.meta).toEqual({
                page: 1,
                limit: 20,
                total: 1,
                totalPages: 1,
            });
        });
        it('should filter by mahallaId', async () => {
            prisma.house.findMany.mockResolvedValue([]);
            prisma.house.count.mockResolvedValue(0);
            await service.findAll({ mahallaId: 'mahalla-1' });
            expect(prisma.house.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    mahallaId: 'mahalla-1',
                }),
            }));
        });
        it('should search by house number or address', async () => {
            prisma.house.findMany.mockResolvedValue([]);
            prisma.house.count.mockResolvedValue(0);
            await service.findAll({ search: 'Main' });
            expect(prisma.house.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    OR: expect.any(Array),
                }),
            }));
        });
    });
    describe('findById', () => {
        it('should return a house with people', async () => {
            const mockHouseWithPeople = {
                ...mockHouse,
                people: [],
            };
            prisma.house.findUnique.mockResolvedValue(mockHouseWithPeople);
            const result = await service.findById('house-1');
            expect(result).toEqual(mockHouseWithPeople);
        });
        it('should throw NotFoundException when house not found', async () => {
            prisma.house.findUnique.mockResolvedValue(null);
            await expect(service.findById('non-existent')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('create', () => {
        it('should create a house with auto-generated house number', async () => {
            const createDto = {
                mahallaId: 'mahalla-1',
                addressLine1: '456 New St',
                city: 'New City',
            };
            prisma.house.findFirst.mockResolvedValue(null);
            prisma.house.create.mockResolvedValue({
                ...mockHouse,
                ...createDto,
                houseNumber: 1,
            });
            const result = await service.create(createDto, 'user-1');
            expect(result.houseNumber).toBe(1);
            expect(prisma.house.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    houseNumber: 1,
                }),
                include: { mahalla: true },
            });
        });
        it('should increment house number from last house', async () => {
            const createDto = {
                mahallaId: 'mahalla-1',
                addressLine1: '789 Another St',
            };
            prisma.house.findFirst.mockResolvedValue({ houseNumber: 5 });
            prisma.house.create.mockResolvedValue({
                ...mockHouse,
                ...createDto,
                houseNumber: 6,
            });
            const result = await service.create(createDto);
            expect(result.houseNumber).toBe(6);
        });
    });
    describe('update', () => {
        it('should update an existing house', async () => {
            const updateDto = { addressLine1: 'Updated Address' };
            prisma.house.findUnique.mockResolvedValue(mockHouse);
            prisma.house.update.mockResolvedValue({ ...mockHouse, ...updateDto });
            const result = await service.update('house-1', updateDto);
            expect(result.addressLine1).toBe('Updated Address');
        });
        it('should throw NotFoundException when house not found', async () => {
            prisma.house.findUnique.mockResolvedValue(null);
            await expect(service.update('non-existent', { addressLine1: 'Test' })).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('delete', () => {
        it('should delete a house with no people', async () => {
            prisma.person.count.mockResolvedValue(0);
            prisma.house.delete.mockResolvedValue(mockHouse);
            const result = await service.delete('house-1');
            expect(result).toEqual({ message: 'House deleted successfully' });
        });
        it('should throw BadRequestException when house has people', async () => {
            prisma.person.count.mockResolvedValue(3);
            await expect(service.delete('house-1')).rejects.toThrow(common_1.BadRequestException);
            expect(prisma.house.delete).not.toHaveBeenCalled();
        });
    });
    describe('getHouseMembers', () => {
        it('should return families with members and all members', async () => {
            const familyHead = {
                id: 'person-1',
                fullName: 'Family Head',
                familyHeadId: null,
                relationshipType: null,
                memberStatus: { id: 1, title: 'Active' },
            };
            const member = {
                id: 'person-2',
                fullName: 'Family Member',
                familyHeadId: 'person-1',
                relationshipType: { id: 3, title: 'Son', sortOrder: 3 },
                memberStatus: { id: 1, title: 'Active' },
            };
            const family = {
                id: 'family-1',
                name: 'Test Family',
                familyHead,
                members: [member],
            };
            prisma.house.findUnique.mockResolvedValue({
                ...mockHouse,
                families: [family],
                people: [familyHead, member],
            });
            const result = await service.getHouseMembers('house-1');
            expect(result.families).toHaveLength(1);
            expect(result.families[0].familyHead).toEqual(familyHead);
            expect(result.families[0].members).toEqual([member]);
            expect(result.families[0].memberCount).toBe(2);
            expect(result.allMembers).toHaveLength(2);
            expect(result.totalMembers).toBe(2);
            expect(result.totalFamilies).toBe(1);
        });
        it('should throw NotFoundException when house not found', async () => {
            prisma.house.findUnique.mockResolvedValue(null);
            await expect(service.getHouseMembers('non-existent')).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=houses.service.spec.js.map