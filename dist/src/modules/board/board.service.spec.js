"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const board_service_1 = require("./board.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const prisma_mock_1 = require("../../__mocks__/prisma.mock");
describe('BoardService', () => {
    let service;
    let prisma;
    const mockRole = {
        id: 'role-1',
        roleName: 'President',
        isMahallaSpecific: false,
        sortOrder: 1,
        isActive: true,
    };
    const mockTerm = {
        id: 'term-1',
        name: '2024-2025',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31'),
        termYears: 2,
        isCurrent: true,
        createdAt: new Date(),
    };
    const mockMember = {
        id: 'member-1',
        boardTermId: 'term-1',
        personId: 'person-1',
        boardRoleId: 'role-1',
        mahallaId: null,
        startDate: new Date('2024-01-01'),
        endDate: null,
        createdAt: new Date(),
        person: { id: 'person-1', fullName: 'John Doe' },
        boardRole: { id: 'role-1', roleName: 'President' },
        mahalla: null,
    };
    beforeEach(async () => {
        prisma = (0, prisma_mock_1.createMockPrismaService)();
        const module = await testing_1.Test.createTestingModule({
            providers: [
                board_service_1.BoardService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: prisma,
                },
            ],
        }).compile();
        service = module.get(board_service_1.BoardService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getRoles', () => {
        it('should return all active roles ordered by sortOrder', async () => {
            const mockRoles = [mockRole, { ...mockRole, id: 'role-2', roleName: 'Vice President', sortOrder: 2 }];
            prisma.boardRole.findMany.mockResolvedValue(mockRoles);
            const result = await service.getRoles();
            expect(result).toEqual(mockRoles);
            expect(prisma.boardRole.findMany).toHaveBeenCalledWith({
                where: { isActive: true },
                orderBy: { sortOrder: 'asc' },
            });
        });
    });
    describe('createRole', () => {
        it('should create a new role', async () => {
            const createDto = { roleName: 'Secretary', sortOrder: 3 };
            prisma.boardRole.create.mockResolvedValue({ ...mockRole, ...createDto, id: 'role-new' });
            const result = await service.createRole(createDto);
            expect(result.roleName).toBe('Secretary');
            expect(prisma.boardRole.create).toHaveBeenCalledWith({
                data: {
                    roleName: 'Secretary',
                    isMahallaSpecific: false,
                    sortOrder: 3,
                    isActive: true,
                },
            });
        });
        it('should create a role with default values', async () => {
            const createDto = { roleName: 'Treasurer' };
            prisma.boardRole.create.mockResolvedValue({ ...mockRole, ...createDto, id: 'role-new' });
            await service.createRole(createDto);
            expect(prisma.boardRole.create).toHaveBeenCalledWith({
                data: {
                    roleName: 'Treasurer',
                    isMahallaSpecific: false,
                    sortOrder: 0,
                    isActive: true,
                },
            });
        });
    });
    describe('updateRole', () => {
        it('should update an existing role', async () => {
            const updateDto = { roleName: 'Updated President' };
            prisma.boardRole.update.mockResolvedValue({ ...mockRole, ...updateDto });
            const result = await service.updateRole('role-1', updateDto);
            expect(result.roleName).toBe('Updated President');
            expect(prisma.boardRole.update).toHaveBeenCalledWith({
                where: { id: 'role-1' },
                data: updateDto,
            });
        });
    });
    describe('deleteRole', () => {
        it('should delete a role with no members', async () => {
            prisma.boardMember.count.mockResolvedValue(0);
            prisma.boardRole.delete.mockResolvedValue(mockRole);
            const result = await service.deleteRole('role-1');
            expect(result).toEqual(mockRole);
            expect(prisma.boardRole.delete).toHaveBeenCalledWith({
                where: { id: 'role-1' },
            });
        });
        it('should throw BadRequestException when role has members', async () => {
            prisma.boardMember.count.mockResolvedValue(3);
            await expect(service.deleteRole('role-1')).rejects.toThrow(common_1.BadRequestException);
            expect(prisma.boardRole.delete).not.toHaveBeenCalled();
        });
    });
    describe('getTerms', () => {
        it('should return all terms with member counts', async () => {
            const mockTerms = [{ ...mockTerm, _count: { members: 5 } }];
            prisma.boardTerm.findMany.mockResolvedValue(mockTerms);
            const result = await service.getTerms();
            expect(result).toEqual(mockTerms);
            expect(prisma.boardTerm.findMany).toHaveBeenCalledWith({
                orderBy: { startDate: 'desc' },
                include: {
                    _count: { select: { members: true } },
                },
            });
        });
    });
    describe('getTermById', () => {
        it('should return a term by id with members', async () => {
            const mockTermWithMembers = { ...mockTerm, members: [mockMember] };
            prisma.boardTerm.findUnique.mockResolvedValue(mockTermWithMembers);
            const result = await service.getTermById('term-1');
            expect(result).toEqual(mockTermWithMembers);
            expect(prisma.boardTerm.findUnique).toHaveBeenCalledWith({
                where: { id: 'term-1' },
                include: {
                    members: {
                        include: { person: true, boardRole: true, mahalla: true },
                        orderBy: { boardRole: { sortOrder: 'asc' } },
                    },
                },
            });
        });
        it('should throw NotFoundException when term not found', async () => {
            prisma.boardTerm.findUnique.mockResolvedValue(null);
            await expect(service.getTermById('non-existent')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('getCurrentTerm', () => {
        it('should return the current term', async () => {
            const currentTerm = { ...mockTerm, members: [] };
            prisma.boardTerm.findFirst.mockResolvedValue(currentTerm);
            const result = await service.getCurrentTerm();
            expect(result).toEqual(currentTerm);
            expect(prisma.boardTerm.findFirst).toHaveBeenCalledWith({
                where: { isCurrent: true },
                include: {
                    members: {
                        include: { person: true, boardRole: true, mahalla: true },
                        orderBy: { boardRole: { sortOrder: 'asc' } },
                    },
                },
            });
        });
    });
    describe('createTerm', () => {
        it('should create a new term', async () => {
            const createDto = { name: '2025-2026', startDate: '2025-01-01', endDate: '2026-12-31', isCurrent: false };
            prisma.boardTerm.create.mockResolvedValue({ ...mockTerm, ...createDto, id: 'term-new' });
            const result = await service.createTerm(createDto);
            expect(prisma.boardTerm.create).toHaveBeenCalledWith({
                data: {
                    name: '2025-2026',
                    startDate: new Date('2025-01-01'),
                    endDate: new Date('2026-12-31'),
                    isCurrent: false,
                },
            });
        });
        it('should unset other current terms when creating a new current term', async () => {
            const createDto = { name: '2025-2026', startDate: '2025-01-01', isCurrent: true };
            prisma.boardTerm.updateMany.mockResolvedValue({ count: 1 });
            prisma.boardTerm.create.mockResolvedValue({ ...mockTerm, ...createDto, id: 'term-new' });
            await service.createTerm(createDto);
            expect(prisma.boardTerm.updateMany).toHaveBeenCalledWith({
                where: { isCurrent: true },
                data: { isCurrent: false },
            });
        });
    });
    describe('updateTerm', () => {
        it('should update an existing term', async () => {
            const updateDto = { name: 'Updated Term' };
            prisma.boardTerm.update.mockResolvedValue({ ...mockTerm, ...updateDto });
            const result = await service.updateTerm('term-1', updateDto);
            expect(result.name).toBe('Updated Term');
        });
        it('should unset other current terms when setting as current', async () => {
            const updateDto = { isCurrent: true };
            prisma.boardTerm.updateMany.mockResolvedValue({ count: 1 });
            prisma.boardTerm.update.mockResolvedValue({ ...mockTerm, isCurrent: true });
            await service.updateTerm('term-1', updateDto);
            expect(prisma.boardTerm.updateMany).toHaveBeenCalledWith({
                where: { isCurrent: true, id: { not: 'term-1' } },
                data: { isCurrent: false },
            });
        });
    });
    describe('deleteTerm', () => {
        it('should delete a term with no members', async () => {
            prisma.boardMember.count.mockResolvedValue(0);
            prisma.boardTerm.delete.mockResolvedValue(mockTerm);
            const result = await service.deleteTerm('term-1');
            expect(result).toEqual(mockTerm);
            expect(prisma.boardTerm.delete).toHaveBeenCalledWith({
                where: { id: 'term-1' },
            });
        });
        it('should throw BadRequestException when term has members', async () => {
            prisma.boardMember.count.mockResolvedValue(5);
            await expect(service.deleteTerm('term-1')).rejects.toThrow(common_1.BadRequestException);
            expect(prisma.boardTerm.delete).not.toHaveBeenCalled();
        });
    });
    describe('getMembers', () => {
        it('should return all members for a term', async () => {
            const mockMembers = [mockMember];
            prisma.boardMember.findMany.mockResolvedValue(mockMembers);
            const result = await service.getMembers('term-1');
            expect(result).toEqual(mockMembers);
            expect(prisma.boardMember.findMany).toHaveBeenCalledWith({
                where: { boardTermId: 'term-1' },
                include: { person: true, boardRole: true, mahalla: true },
                orderBy: { boardRole: { sortOrder: 'asc' } },
            });
        });
    });
    describe('addMember', () => {
        it('should add a new member to a term', async () => {
            const addDto = {
                boardTermId: 'term-1',
                personId: 'person-1',
                boardRoleId: 'role-1',
                startDate: '2024-01-01',
            };
            prisma.boardMember.findFirst.mockResolvedValue(null);
            prisma.boardMember.create.mockResolvedValue(mockMember);
            const result = await service.addMember(addDto);
            expect(result).toEqual(mockMember);
            expect(prisma.boardMember.create).toHaveBeenCalledWith({
                data: {
                    boardTermId: 'term-1',
                    personId: 'person-1',
                    boardRoleId: 'role-1',
                    mahallaId: null,
                    startDate: new Date('2024-01-01'),
                    endDate: null,
                },
                include: { person: true, boardRole: true, mahalla: true },
            });
        });
        it('should add a member with mahalla', async () => {
            const addDto = {
                boardTermId: 'term-1',
                personId: 'person-1',
                boardRoleId: 'role-1',
                mahallaId: 'mahalla-1',
                startDate: '2024-01-01',
                endDate: '2025-12-31',
            };
            prisma.boardMember.findFirst.mockResolvedValue(null);
            prisma.boardMember.create.mockResolvedValue({ ...mockMember, mahallaId: 'mahalla-1' });
            await service.addMember(addDto);
            expect(prisma.boardMember.create).toHaveBeenCalledWith({
                data: {
                    boardTermId: 'term-1',
                    personId: 'person-1',
                    boardRoleId: 'role-1',
                    mahallaId: 'mahalla-1',
                    startDate: new Date('2024-01-01'),
                    endDate: new Date('2025-12-31'),
                },
                include: { person: true, boardRole: true, mahalla: true },
            });
        });
        it('should throw BadRequestException when person already has role in term', async () => {
            const addDto = {
                boardTermId: 'term-1',
                personId: 'person-1',
                boardRoleId: 'role-1',
                startDate: '2024-01-01',
            };
            prisma.boardMember.findFirst.mockResolvedValue(mockMember);
            await expect(service.addMember(addDto)).rejects.toThrow(common_1.BadRequestException);
            expect(prisma.boardMember.create).not.toHaveBeenCalled();
        });
    });
    describe('updateMember', () => {
        it('should update an existing member', async () => {
            const updateDto = { boardRoleId: 'role-2' };
            prisma.boardMember.update.mockResolvedValue({ ...mockMember, boardRoleId: 'role-2' });
            const result = await service.updateMember('member-1', updateDto);
            expect(result.boardRoleId).toBe('role-2');
        });
    });
    describe('removeMember', () => {
        it('should remove a member', async () => {
            prisma.boardMember.delete.mockResolvedValue(mockMember);
            const result = await service.removeMember('member-1');
            expect(result).toEqual(mockMember);
            expect(prisma.boardMember.delete).toHaveBeenCalledWith({
                where: { id: 'member-1' },
            });
        });
    });
});
//# sourceMappingURL=board.service.spec.js.map