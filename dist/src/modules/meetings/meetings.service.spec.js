"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const meetings_service_1 = require("./meetings.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
describe('MeetingsService', () => {
    let service;
    let prisma;
    const mockPrisma = {
        meeting: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        meetingDecision: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
            count: jest.fn(),
        },
        issue: {
            findUnique: jest.fn(),
        },
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                meetings_service_1.MeetingsService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrisma },
            ],
        }).compile();
        service = module.get(meetings_service_1.MeetingsService);
        prisma = module.get(prisma_service_1.PrismaService);
        jest.clearAllMocks();
    });
    describe('findAll', () => {
        it('should return paginated meetings', async () => {
            const mockMeetings = [
                { id: '1', title: 'Meeting 1', meetingDate: new Date() },
                { id: '2', title: 'Meeting 2', meetingDate: new Date() },
            ];
            mockPrisma.meeting.findMany.mockResolvedValue(mockMeetings);
            mockPrisma.meeting.count.mockResolvedValue(2);
            const result = await service.findAll({ page: 1, limit: 10 });
            expect(result.data).toEqual(mockMeetings);
            expect(result.meta).toEqual({
                page: 1,
                limit: 10,
                total: 2,
                totalPages: 1,
            });
        });
        it('should search by title, agenda, and location', async () => {
            mockPrisma.meeting.findMany.mockResolvedValue([]);
            mockPrisma.meeting.count.mockResolvedValue(0);
            await service.findAll({ search: 'board', page: 1, limit: 10 });
            expect(mockPrisma.meeting.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    OR: [
                        { title: { contains: 'board', mode: 'insensitive' } },
                        { agenda: { contains: 'board', mode: 'insensitive' } },
                        { location: { contains: 'board', mode: 'insensitive' } },
                    ],
                }),
            }));
        });
        it('should filter by date range', async () => {
            mockPrisma.meeting.findMany.mockResolvedValue([]);
            mockPrisma.meeting.count.mockResolvedValue(0);
            await service.findAll({
                fromDate: '2024-12-01',
                toDate: '2024-12-31',
                page: 1,
                limit: 10,
            });
            expect(mockPrisma.meeting.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    meetingDate: {
                        gte: new Date('2024-12-01'),
                        lte: new Date('2024-12-31'),
                    },
                }),
            }));
        });
    });
    describe('findById', () => {
        it('should return a meeting by id', async () => {
            const mockMeeting = {
                id: '1',
                title: 'Test Meeting',
                meetingDate: new Date(),
                decisions: [],
            };
            mockPrisma.meeting.findUnique.mockResolvedValue(mockMeeting);
            const result = await service.findById('1');
            expect(result).toEqual(mockMeeting);
            expect(mockPrisma.meeting.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: '1' } }));
        });
        it('should throw NotFoundException if meeting not found', async () => {
            mockPrisma.meeting.findUnique.mockResolvedValue(null);
            await expect(service.findById('nonexistent')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('create', () => {
        it('should create a new meeting', async () => {
            const dto = {
                title: 'New Meeting',
                meetingDate: '2024-12-25',
                location: 'Conference Room',
            };
            const mockCreated = {
                id: '1',
                title: dto.title,
                meetingDate: new Date(dto.meetingDate),
                location: dto.location,
                decisions: [],
            };
            mockPrisma.meeting.create.mockResolvedValue(mockCreated);
            const result = await service.create(dto);
            expect(result).toEqual(mockCreated);
            expect(mockPrisma.meeting.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    title: dto.title,
                    location: dto.location,
                }),
            }));
        });
        it('should handle meeting time', async () => {
            const dto = {
                title: 'Meeting with Time',
                meetingDate: '2024-12-25',
                meetingTime: '14:30',
            };
            mockPrisma.meeting.create.mockResolvedValue({ id: '1', ...dto });
            await service.create(dto);
            expect(mockPrisma.meeting.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    meetingTime: expect.any(Date),
                }),
            }));
        });
    });
    describe('update', () => {
        it('should update an existing meeting', async () => {
            const existingMeeting = {
                id: '1',
                title: 'Old Title',
                meetingDate: new Date(),
                decisions: [],
            };
            const updateDto = { title: 'New Title' };
            const updatedMeeting = { ...existingMeeting, ...updateDto };
            mockPrisma.meeting.findUnique.mockResolvedValue(existingMeeting);
            mockPrisma.meeting.update.mockResolvedValue(updatedMeeting);
            const result = await service.update('1', updateDto);
            expect(result.title).toBe('New Title');
        });
        it('should throw NotFoundException if meeting not found', async () => {
            mockPrisma.meeting.findUnique.mockResolvedValue(null);
            await expect(service.update('nonexistent', { title: 'New' })).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('delete', () => {
        it('should delete a meeting and its decisions', async () => {
            const meeting = {
                id: '1',
                title: 'Test Meeting',
                meetingDate: new Date(),
                decisions: [],
            };
            mockPrisma.meeting.findUnique.mockResolvedValue(meeting);
            mockPrisma.meetingDecision.deleteMany.mockResolvedValue({ count: 0 });
            mockPrisma.meeting.delete.mockResolvedValue(meeting);
            const result = await service.delete('1');
            expect(mockPrisma.meetingDecision.deleteMany).toHaveBeenCalledWith({
                where: { meetingId: '1' },
            });
            expect(mockPrisma.meeting.delete).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });
    });
    describe('addDecision', () => {
        it('should add a decision to a meeting', async () => {
            const meeting = {
                id: '1',
                title: 'Test Meeting',
                meetingDate: new Date(),
                decisions: [],
            };
            const decisionDto = { decision: 'New decision' };
            const createdDecision = {
                id: 'd1',
                meetingId: '1',
                decision: 'New decision',
            };
            mockPrisma.meeting.findUnique.mockResolvedValue(meeting);
            mockPrisma.meetingDecision.create.mockResolvedValue(createdDecision);
            const result = await service.addDecision('1', decisionDto);
            expect(result).toEqual(createdDecision);
            expect(mockPrisma.meetingDecision.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    meetingId: '1',
                    decision: 'New decision',
                }),
            }));
        });
        it('should link decision to an issue', async () => {
            const meeting = {
                id: '1',
                title: 'Test Meeting',
                meetingDate: new Date(),
                decisions: [],
            };
            const issue = { id: 'issue-1', title: 'Test Issue' };
            const decisionDto = {
                decision: 'Decision related to issue',
                relatedIssueId: 'issue-1',
            };
            mockPrisma.meeting.findUnique.mockResolvedValue(meeting);
            mockPrisma.issue.findUnique.mockResolvedValue(issue);
            mockPrisma.meetingDecision.create.mockResolvedValue({
                id: 'd1',
                ...decisionDto,
            });
            await service.addDecision('1', decisionDto);
            expect(mockPrisma.issue.findUnique).toHaveBeenCalledWith({
                where: { id: 'issue-1' },
            });
        });
        it('should throw BadRequestException if related issue not found', async () => {
            const meeting = {
                id: '1',
                title: 'Test Meeting',
                meetingDate: new Date(),
                decisions: [],
            };
            const decisionDto = {
                decision: 'Decision',
                relatedIssueId: 'nonexistent',
            };
            mockPrisma.meeting.findUnique.mockResolvedValue(meeting);
            mockPrisma.issue.findUnique.mockResolvedValue(null);
            await expect(service.addDecision('1', decisionDto)).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('removeDecision', () => {
        it('should remove a decision', async () => {
            const decision = { id: 'd1', meetingId: '1', decision: 'Test' };
            mockPrisma.meetingDecision.findUnique.mockResolvedValue(decision);
            mockPrisma.meetingDecision.delete.mockResolvedValue(decision);
            const result = await service.removeDecision('d1');
            expect(mockPrisma.meetingDecision.delete).toHaveBeenCalledWith({
                where: { id: 'd1' },
            });
        });
        it('should throw NotFoundException if decision not found', async () => {
            mockPrisma.meetingDecision.findUnique.mockResolvedValue(null);
            await expect(service.removeDecision('nonexistent')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('getSummary', () => {
        it('should return meetings summary', async () => {
            mockPrisma.meeting.count
                .mockResolvedValueOnce(50)
                .mockResolvedValueOnce(5);
            mockPrisma.meeting.findMany.mockResolvedValue([]);
            mockPrisma.meetingDecision.count.mockResolvedValue(100);
            const result = await service.getSummary();
            expect(result).toEqual(expect.objectContaining({
                totalMeetings: 50,
                recentMeetings: 5,
                totalDecisions: 100,
            }));
        });
    });
    describe('getCalendarMeetings', () => {
        it('should return meetings for a specific month', async () => {
            const mockMeetings = [
                { id: '1', title: 'Meeting 1', meetingDate: new Date('2024-12-15') },
            ];
            mockPrisma.meeting.findMany.mockResolvedValue(mockMeetings);
            const result = await service.getCalendarMeetings(2024, 12);
            expect(result).toEqual(mockMeetings);
            expect(mockPrisma.meeting.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    meetingDate: {
                        gte: new Date(2024, 11, 1),
                        lte: new Date(2024, 12, 0),
                    },
                }),
            }));
        });
    });
});
//# sourceMappingURL=meetings.service.spec.js.map