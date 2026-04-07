"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const issues_service_1 = require("./issues.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
describe('IssuesService', () => {
    let service;
    let prisma;
    const mockPrisma = {
        issue: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        person: {
            findUnique: jest.fn(),
        },
        meetingDecision: {
            deleteMany: jest.fn(),
        },
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                issues_service_1.IssuesService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrisma },
            ],
        }).compile();
        service = module.get(issues_service_1.IssuesService);
        prisma = module.get(prisma_service_1.PrismaService);
        jest.clearAllMocks();
    });
    describe('findAll', () => {
        it('should return paginated issues', async () => {
            const mockIssues = [
                { id: '1', title: 'Test Issue 1', status: 'open' },
                { id: '2', title: 'Test Issue 2', status: 'resolved' },
            ];
            mockPrisma.issue.findMany.mockResolvedValue(mockIssues);
            mockPrisma.issue.count.mockResolvedValue(2);
            const result = await service.findAll({ page: 1, limit: 10 });
            expect(result.data).toEqual(mockIssues);
            expect(result.meta).toEqual({
                page: 1,
                limit: 10,
                total: 2,
                totalPages: 1,
            });
        });
        it('should filter by status', async () => {
            mockPrisma.issue.findMany.mockResolvedValue([]);
            mockPrisma.issue.count.mockResolvedValue(0);
            await service.findAll({ status: 'open', page: 1, limit: 10 });
            expect(mockPrisma.issue.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({ status: 'open' }),
            }));
        });
        it('should search by title and description', async () => {
            mockPrisma.issue.findMany.mockResolvedValue([]);
            mockPrisma.issue.count.mockResolvedValue(0);
            await service.findAll({ search: 'water', page: 1, limit: 10 });
            expect(mockPrisma.issue.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    OR: [
                        { title: { contains: 'water', mode: 'insensitive' } },
                        { description: { contains: 'water', mode: 'insensitive' } },
                    ],
                }),
            }));
        });
    });
    describe('findById', () => {
        it('should return an issue by id', async () => {
            const mockIssue = { id: '1', title: 'Test Issue', status: 'open' };
            mockPrisma.issue.findUnique.mockResolvedValue(mockIssue);
            const result = await service.findById('1');
            expect(result).toEqual(mockIssue);
            expect(mockPrisma.issue.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: '1' } }));
        });
        it('should throw NotFoundException if issue not found', async () => {
            mockPrisma.issue.findUnique.mockResolvedValue(null);
            await expect(service.findById('nonexistent')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('create', () => {
        it('should create a new issue', async () => {
            const dto = {
                title: 'New Issue',
                description: 'Description',
                raisedDate: '2024-12-01',
            };
            const mockCreated = { id: '1', ...dto, status: 'open' };
            mockPrisma.issue.create.mockResolvedValue(mockCreated);
            const result = await service.create(dto);
            expect(result).toEqual(mockCreated);
            expect(mockPrisma.issue.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    title: dto.title,
                    description: dto.description,
                    status: 'open',
                }),
            }));
        });
        it('should validate person exists if raisedBy is provided', async () => {
            const dto = {
                title: 'New Issue',
                raisedDate: '2024-12-01',
                raisedBy: 'person-id',
            };
            mockPrisma.person.findUnique.mockResolvedValue(null);
            await expect(service.create(dto)).rejects.toThrow(common_1.BadRequestException);
        });
        it('should create issue with valid raisedBy', async () => {
            const dto = {
                title: 'New Issue',
                raisedDate: '2024-12-01',
                raisedBy: 'person-id',
            };
            const mockPerson = { id: 'person-id', fullName: 'Test Person' };
            const mockCreated = { id: '1', ...dto, status: 'open' };
            mockPrisma.person.findUnique.mockResolvedValue(mockPerson);
            mockPrisma.issue.create.mockResolvedValue(mockCreated);
            const result = await service.create(dto);
            expect(result).toEqual(mockCreated);
        });
    });
    describe('update', () => {
        it('should update an existing issue', async () => {
            const existingIssue = { id: '1', title: 'Old Title', status: 'open' };
            const updateDto = { title: 'New Title' };
            const updatedIssue = { ...existingIssue, ...updateDto };
            mockPrisma.issue.findUnique.mockResolvedValue(existingIssue);
            mockPrisma.issue.update.mockResolvedValue(updatedIssue);
            const result = await service.update('1', updateDto);
            expect(result.title).toBe('New Title');
            expect(mockPrisma.issue.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: '1' },
                data: updateDto,
            }));
        });
        it('should throw NotFoundException if issue not found', async () => {
            mockPrisma.issue.findUnique.mockResolvedValue(null);
            await expect(service.update('nonexistent', { title: 'New' })).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('resolve', () => {
        it('should resolve an open issue', async () => {
            const openIssue = { id: '1', title: 'Test', status: 'open' };
            const resolveDto = {
                resolution: 'Fixed the problem',
                resolvedDate: '2024-12-20',
            };
            const resolvedIssue = { ...openIssue, status: 'resolved', ...resolveDto };
            mockPrisma.issue.findUnique.mockResolvedValue(openIssue);
            mockPrisma.issue.update.mockResolvedValue(resolvedIssue);
            const result = await service.resolve('1', resolveDto);
            expect(result.status).toBe('resolved');
            expect(mockPrisma.issue.update).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    status: 'resolved',
                    resolution: resolveDto.resolution,
                }),
            }));
        });
        it('should throw BadRequestException if already resolved', async () => {
            const resolvedIssue = { id: '1', title: 'Test', status: 'resolved' };
            mockPrisma.issue.findUnique.mockResolvedValue(resolvedIssue);
            await expect(service.resolve('1', { resolution: 'Fix', resolvedDate: '2024-12-20' })).rejects.toThrow(common_1.BadRequestException);
        });
        it('should throw BadRequestException if closed', async () => {
            const closedIssue = { id: '1', title: 'Test', status: 'closed' };
            mockPrisma.issue.findUnique.mockResolvedValue(closedIssue);
            await expect(service.resolve('1', { resolution: 'Fix', resolvedDate: '2024-12-20' })).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('reopen', () => {
        it('should reopen a resolved issue', async () => {
            const resolvedIssue = { id: '1', title: 'Test', status: 'resolved' };
            const reopenedIssue = { ...resolvedIssue, status: 'open', resolution: null };
            mockPrisma.issue.findUnique.mockResolvedValue(resolvedIssue);
            mockPrisma.issue.update.mockResolvedValue(reopenedIssue);
            const result = await service.reopen('1');
            expect(result.status).toBe('open');
            expect(result.resolution).toBeNull();
        });
        it('should throw BadRequestException if already open', async () => {
            const openIssue = { id: '1', title: 'Test', status: 'open' };
            mockPrisma.issue.findUnique.mockResolvedValue(openIssue);
            await expect(service.reopen('1')).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('delete', () => {
        it('should delete an issue and related decisions', async () => {
            const issue = {
                id: '1',
                title: 'Test',
                status: 'open',
                rentals: [],
                meetingDecisions: [],
            };
            mockPrisma.issue.findUnique.mockResolvedValue(issue);
            mockPrisma.meetingDecision.deleteMany.mockResolvedValue({ count: 0 });
            mockPrisma.issue.delete.mockResolvedValue(issue);
            const result = await service.delete('1');
            expect(mockPrisma.meetingDecision.deleteMany).toHaveBeenCalledWith({
                where: { relatedIssueId: '1' },
            });
            expect(mockPrisma.issue.delete).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });
    });
    describe('getSummary', () => {
        it('should return issue summary counts', async () => {
            mockPrisma.issue.count
                .mockResolvedValueOnce(5)
                .mockResolvedValueOnce(3)
                .mockResolvedValueOnce(10)
                .mockResolvedValueOnce(2);
            mockPrisma.issue.findMany.mockResolvedValue([]);
            const result = await service.getSummary();
            expect(result).toEqual({
                open: 5,
                inProgress: 3,
                resolved: 10,
                closed: 2,
                total: 20,
                recentIssues: [],
            });
        });
    });
});
//# sourceMappingURL=issues.service.spec.js.map