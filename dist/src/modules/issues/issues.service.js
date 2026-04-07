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
exports.IssuesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let IssuesService = class IssuesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { status, search, page = 1, limit = 20 } = query;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [issues, total] = await Promise.all([
            this.prisma.issue.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    raisedByPerson: {
                        select: { id: true, fullName: true, phone: true },
                    },
                    meetingDecisions: {
                        include: {
                            meeting: {
                                select: { id: true, title: true, meetingDate: true },
                            },
                        },
                    },
                },
                orderBy: { raisedDate: 'desc' },
            }),
            this.prisma.issue.count({ where }),
        ]);
        return {
            data: issues,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findById(id) {
        const issue = await this.prisma.issue.findUnique({
            where: { id },
            include: {
                raisedByPerson: {
                    select: { id: true, fullName: true, phone: true },
                },
                meetingDecisions: {
                    include: {
                        meeting: {
                            select: { id: true, title: true, meetingDate: true },
                        },
                    },
                },
            },
        });
        if (!issue) {
            throw new common_1.NotFoundException('Issue not found');
        }
        return issue;
    }
    async create(dto) {
        if (dto.raisedBy) {
            const person = await this.prisma.person.findUnique({
                where: { id: dto.raisedBy },
            });
            if (!person) {
                throw new common_1.BadRequestException('Person not found');
            }
        }
        return this.prisma.issue.create({
            data: {
                title: dto.title,
                description: dto.description,
                raisedBy: dto.raisedBy,
                raisedDate: new Date(dto.raisedDate),
                status: dto.status || 'open',
            },
            include: {
                raisedByPerson: {
                    select: { id: true, fullName: true, phone: true },
                },
            },
        });
    }
    async update(id, dto) {
        await this.findById(id);
        return this.prisma.issue.update({
            where: { id },
            data: dto,
            include: {
                raisedByPerson: {
                    select: { id: true, fullName: true, phone: true },
                },
            },
        });
    }
    async resolve(id, dto) {
        const issue = await this.findById(id);
        if (issue.status === 'resolved' || issue.status === 'closed') {
            throw new common_1.BadRequestException('Issue is already resolved or closed');
        }
        return this.prisma.issue.update({
            where: { id },
            data: {
                status: 'resolved',
                resolution: dto.resolution,
                resolvedDate: new Date(dto.resolvedDate),
            },
            include: {
                raisedByPerson: {
                    select: { id: true, fullName: true, phone: true },
                },
            },
        });
    }
    async reopen(id) {
        const issue = await this.findById(id);
        if (issue.status === 'open' || issue.status === 'in_progress') {
            throw new common_1.BadRequestException('Issue is already open');
        }
        return this.prisma.issue.update({
            where: { id },
            data: {
                status: 'open',
                resolution: null,
                resolvedDate: null,
            },
            include: {
                raisedByPerson: {
                    select: { id: true, fullName: true, phone: true },
                },
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.meetingDecision.deleteMany({
            where: { relatedIssueId: id },
        });
        return this.prisma.issue.delete({
            where: { id },
        });
    }
    async getSummary() {
        const [open, inProgress, resolved, closed, recentIssues] = await Promise.all([
            this.prisma.issue.count({ where: { status: 'open' } }),
            this.prisma.issue.count({ where: { status: 'in_progress' } }),
            this.prisma.issue.count({ where: { status: 'resolved' } }),
            this.prisma.issue.count({ where: { status: 'closed' } }),
            this.prisma.issue.findMany({
                where: { status: { in: ['open', 'in_progress'] } },
                include: {
                    raisedByPerson: {
                        select: { id: true, fullName: true },
                    },
                },
                orderBy: { raisedDate: 'desc' },
                take: 5,
            }),
        ]);
        return {
            open,
            inProgress,
            resolved,
            closed,
            total: open + inProgress + resolved + closed,
            recentIssues,
        };
    }
};
exports.IssuesService = IssuesService;
exports.IssuesService = IssuesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IssuesService);
//# sourceMappingURL=issues.service.js.map