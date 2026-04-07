"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let MeetingsService = class MeetingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { search, fromDate, toDate, page = 1, limit = 20 } = query;
        const where = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { agenda: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (fromDate || toDate) {
            where.meetingDate = {};
            if (fromDate)
                where.meetingDate.gte = new Date(fromDate);
            if (toDate)
                where.meetingDate.lte = new Date(toDate);
        }
        const [meetings, total] = await Promise.all([
            this.prisma.meeting.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    decisions: {
                        include: {
                            relatedIssue: {
                                select: { id: true, title: true, status: true },
                            },
                        },
                    },
                    _count: {
                        select: { decisions: true },
                    },
                },
                orderBy: { meetingDate: 'desc' },
            }),
            this.prisma.meeting.count({ where }),
        ]);
        return {
            data: meetings,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findById(id) {
        const meeting = await this.prisma.meeting.findUnique({
            where: { id },
            include: {
                decisions: {
                    include: {
                        relatedIssue: {
                            select: { id: true, title: true, status: true },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!meeting) {
            throw new common_1.NotFoundException('Meeting not found');
        }
        return meeting;
    }
    async create(dto, createdBy) {
        const data = {
            title: dto.title,
            meetingDate: new Date(dto.meetingDate),
            location: dto.location,
            attendees: dto.attendees,
            agenda: dto.agenda,
            minutes: dto.minutes,
            createdBy,
        };
        if (dto.meetingTime) {
            const [hours, minutes] = dto.meetingTime.split(':').map(Number);
            const timeDate = new Date();
            timeDate.setHours(hours, minutes, 0, 0);
            data.meetingTime = timeDate;
        }
        return this.prisma.meeting.create({
            data,
            include: {
                decisions: true,
            },
        });
    }
    async update(id, dto) {
        await this.findById(id);
        const data = { ...dto };
        if (dto.meetingDate) {
            data.meetingDate = new Date(dto.meetingDate);
        }
        if (dto.meetingTime) {
            const [hours, minutes] = dto.meetingTime.split(':').map(Number);
            const timeDate = new Date();
            timeDate.setHours(hours, minutes, 0, 0);
            data.meetingTime = timeDate;
        }
        return this.prisma.meeting.update({
            where: { id },
            data,
            include: {
                decisions: {
                    include: {
                        relatedIssue: {
                            select: { id: true, title: true, status: true },
                        },
                    },
                },
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.meetingDecision.deleteMany({
            where: { meetingId: id },
        });
        return this.prisma.meeting.delete({
            where: { id },
        });
    }
    async addDecision(meetingId, dto) {
        await this.findById(meetingId);
        if (dto.relatedIssueId) {
            const issue = await this.prisma.issue.findUnique({
                where: { id: dto.relatedIssueId },
            });
            if (!issue) {
                throw new common_1.BadRequestException('Related issue not found');
            }
        }
        return this.prisma.meetingDecision.create({
            data: {
                meetingId,
                decision: dto.decision,
                relatedIssueId: dto.relatedIssueId,
            },
            include: {
                relatedIssue: {
                    select: { id: true, title: true, status: true },
                },
                meeting: {
                    select: { id: true, title: true, meetingDate: true },
                },
            },
        });
    }
    async removeDecision(decisionId) {
        const decision = await this.prisma.meetingDecision.findUnique({
            where: { id: decisionId },
        });
        if (!decision) {
            throw new common_1.NotFoundException('Decision not found');
        }
        return this.prisma.meetingDecision.delete({
            where: { id: decisionId },
        });
    }
    async updateDecision(decisionId, dto) {
        const decision = await this.prisma.meetingDecision.findUnique({
            where: { id: decisionId },
        });
        if (!decision) {
            throw new common_1.NotFoundException('Decision not found');
        }
        return this.prisma.meetingDecision.update({
            where: { id: decisionId },
            data: {
                decision: dto.decision,
                relatedIssueId: dto.relatedIssueId,
            },
            include: {
                relatedIssue: {
                    select: { id: true, title: true, status: true },
                },
            },
        });
    }
    async getSummary() {
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const [totalMeetings, recentMeetings, upcomingMeetings, totalDecisions] = await Promise.all([
            this.prisma.meeting.count(),
            this.prisma.meeting.count({
                where: {
                    meetingDate: { gte: thirtyDaysAgo, lte: now },
                },
            }),
            this.prisma.meeting.findMany({
                where: {
                    meetingDate: { gt: now },
                },
                orderBy: { meetingDate: 'asc' },
                take: 5,
            }),
            this.prisma.meetingDecision.count(),
        ]);
        const latestMeetings = await this.prisma.meeting.findMany({
            include: {
                _count: {
                    select: { decisions: true },
                },
            },
            orderBy: { meetingDate: 'desc' },
            take: 5,
        });
        return {
            totalMeetings,
            recentMeetings,
            upcomingMeetings,
            totalDecisions,
            latestMeetings,
        };
    }
    async getCalendarMeetings(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        return this.prisma.meeting.findMany({
            where: {
                meetingDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                _count: {
                    select: { decisions: true },
                },
            },
            orderBy: { meetingDate: 'asc' },
        });
    }
};
exports.MeetingsService = MeetingsService;
exports.MeetingsService = MeetingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MeetingsService);
//# sourceMappingURL=meetings.service.js.map