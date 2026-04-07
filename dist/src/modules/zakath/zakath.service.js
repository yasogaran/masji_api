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
exports.ZakathService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ZakathService = class ZakathService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCategories() {
        return this.prisma.zakathCategory.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async getAllCategories() {
        return this.prisma.zakathCategory.findMany({
            orderBy: { sortOrder: 'asc' },
        });
    }
    async getCategoryById(id) {
        const category = await this.prisma.zakathCategory.findUnique({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async createCategory(dto) {
        return this.prisma.zakathCategory.create({
            data: {
                name: dto.name,
                nameArabic: dto.nameArabic,
                description: dto.description,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
    }
    async updateCategory(id, dto) {
        await this.getCategoryById(id);
        return this.prisma.zakathCategory.update({
            where: { id },
            data: dto,
        });
    }
    async deleteCategory(id) {
        const usageCount = await this.prisma.zakathRequest.count({
            where: { categoryId: id },
        });
        if (usageCount > 0) {
            throw new common_1.BadRequestException('Cannot delete category that is used in requests');
        }
        return this.prisma.zakathCategory.delete({ where: { id } });
    }
    async getPeriods(query) {
        const { status, year, page = 1, limit = 10 } = query;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (year) {
            where.hijriYear = year;
        }
        const [data, total] = await Promise.all([
            this.prisma.zakathPeriod.findMany({
                where,
                orderBy: [{ hijriYear: 'desc' }, { hijriMonth: 'desc' }],
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    _count: {
                        select: {
                            collections: true,
                            requests: true,
                        },
                    },
                },
            }),
            this.prisma.zakathPeriod.count({ where }),
        ]);
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getActivePeriod() {
        return this.prisma.zakathPeriod.findFirst({
            where: { status: 'active', isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getPeriodById(id) {
        const period = await this.prisma.zakathPeriod.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        collections: true,
                        requests: true,
                    },
                },
            },
        });
        if (!period) {
            throw new common_1.NotFoundException('Zakath period not found');
        }
        return period;
    }
    async createPeriod(dto, createdBy) {
        return this.prisma.zakathPeriod.create({
            data: {
                name: dto.name,
                hijriMonth: dto.hijriMonth,
                hijriYear: dto.hijriYear,
                gregorianStart: dto.gregorianStart ? new Date(dto.gregorianStart) : null,
                gregorianEnd: dto.gregorianEnd ? new Date(dto.gregorianEnd) : null,
                status: 'active',
                createdBy,
            },
        });
    }
    async updatePeriod(id, dto) {
        await this.getPeriodById(id);
        return this.prisma.zakathPeriod.update({
            where: { id },
            data: {
                ...dto,
                gregorianStart: dto.gregorianStart ? new Date(dto.gregorianStart) : undefined,
                gregorianEnd: dto.gregorianEnd ? new Date(dto.gregorianEnd) : undefined,
            },
        });
    }
    async completeCycle(id, completedBy) {
        const period = await this.getPeriodById(id);
        if (period.status === 'completed') {
            throw new common_1.BadRequestException('This cycle is already completed');
        }
        const [collectionsTotal, distributionsTotal] = await Promise.all([
            this.prisma.zakathCollection.aggregate({
                where: { zakathPeriodId: id },
                _sum: { amount: true },
            }),
            this.prisma.zakathDistribution.aggregate({
                where: { zakathRequest: { zakathPeriodId: id } },
                _sum: { amount: true },
            }),
        ]);
        return this.prisma.zakathPeriod.update({
            where: { id },
            data: {
                status: 'completed',
                totalCollected: collectionsTotal._sum.amount ?? 0,
                totalDistributed: distributionsTotal._sum.amount ?? 0,
                completedAt: new Date(),
                completedBy,
            },
        });
    }
    async deletePeriod(id) {
        const period = await this.getPeriodById(id);
        if (period._count.collections > 0 || period._count.requests > 0) {
            throw new common_1.BadRequestException('Cannot delete period with existing collections or requests');
        }
        return this.prisma.zakathPeriod.delete({ where: { id } });
    }
    async getCollections(query) {
        const { zakathPeriodId, search, page = 1, limit = 10 } = query;
        const where = {};
        if (zakathPeriodId) {
            where.zakathPeriodId = zakathPeriodId;
        }
        if (search) {
            where.OR = [
                { donorName: { contains: search, mode: 'insensitive' } },
                { donor: { fullName: { contains: search, mode: 'insensitive' } } },
                { notes: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.zakathCollection.findMany({
                where,
                orderBy: { collectionDate: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    donor: {
                        select: {
                            id: true,
                            fullName: true,
                            phone: true,
                            house: {
                                select: {
                                    houseNumber: true,
                                    mahalla: { select: { title: true } },
                                },
                            },
                        },
                    },
                    zakathPeriod: {
                        select: { id: true, name: true },
                    },
                },
            }),
            this.prisma.zakathCollection.count({ where }),
        ]);
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getCollectionById(id) {
        const collection = await this.prisma.zakathCollection.findUnique({
            where: { id },
            include: {
                donor: {
                    select: {
                        id: true,
                        fullName: true,
                        phone: true,
                    },
                },
                zakathPeriod: true,
            },
        });
        if (!collection) {
            throw new common_1.NotFoundException('Collection not found');
        }
        return collection;
    }
    async createCollection(dto, createdBy) {
        const period = await this.getPeriodById(dto.zakathPeriodId);
        if (period.status !== 'active') {
            throw new common_1.BadRequestException('Cannot add collection to a non-active period');
        }
        if (dto.donorId) {
            const existingRequest = await this.prisma.zakathRequest.findFirst({
                where: {
                    zakathPeriodId: dto.zakathPeriodId,
                    requesterId: dto.donorId,
                    status: { in: ['approved', 'partial', 'distributed'] },
                },
            });
            if (existingRequest) {
                throw new common_1.BadRequestException('This person has already received zakath in this cycle. A person cannot be both a giver and receiver in the same zakath cycle.');
            }
        }
        return this.prisma.zakathCollection.create({
            data: {
                zakathPeriodId: dto.zakathPeriodId,
                donorId: dto.donorId,
                donorName: dto.donorName,
                donorPhone: dto.donorPhone,
                amount: dto.amount,
                collectionDate: new Date(dto.collectionDate),
                paymentMethod: dto.paymentMethod,
                referenceNo: dto.referenceNo,
                notes: dto.notes,
                createdBy,
            },
            include: {
                donor: {
                    select: { id: true, fullName: true },
                },
            },
        });
    }
    async updateCollection(id, dto) {
        const collection = await this.getCollectionById(id);
        if (collection.zakathPeriod.status !== 'active') {
            throw new common_1.BadRequestException('Cannot modify collection in a non-active period');
        }
        return this.prisma.zakathCollection.update({
            where: { id },
            data: {
                ...dto,
                collectionDate: dto.collectionDate ? new Date(dto.collectionDate) : undefined,
            },
        });
    }
    async deleteCollection(id) {
        const collection = await this.getCollectionById(id);
        if (collection.zakathPeriod.status !== 'active') {
            throw new common_1.BadRequestException('Cannot delete collection from a non-active period');
        }
        return this.prisma.zakathCollection.delete({ where: { id } });
    }
    async getRequests(query) {
        const { zakathPeriodId, categoryId, status, search, page = 1, limit = 10 } = query;
        const where = {};
        if (zakathPeriodId) {
            where.zakathPeriodId = zakathPeriodId;
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { requester: { fullName: { contains: search, mode: 'insensitive' } } },
                { reason: { contains: search, mode: 'insensitive' } },
                { notes: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.zakathRequest.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    requester: {
                        select: {
                            id: true,
                            fullName: true,
                            phone: true,
                            house: {
                                select: {
                                    houseNumber: true,
                                    mahalla: { select: { title: true } },
                                },
                            },
                        },
                    },
                    category: {
                        select: { id: true, name: true, nameArabic: true },
                    },
                    zakathPeriod: {
                        select: { id: true, name: true },
                    },
                    distributions: {
                        select: { id: true, amount: true, distributedAt: true },
                    },
                },
            }),
            this.prisma.zakathRequest.count({ where }),
        ]);
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getRequestById(id) {
        const request = await this.prisma.zakathRequest.findUnique({
            where: { id },
            include: {
                requester: {
                    select: {
                        id: true,
                        fullName: true,
                        phone: true,
                        house: {
                            select: {
                                houseNumber: true,
                                mahalla: { select: { title: true } },
                            },
                        },
                    },
                },
                category: true,
                zakathPeriod: true,
                distributions: {
                    include: {
                        distributedByUser: {
                            select: { id: true, fullName: true },
                        },
                    },
                },
            },
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        return request;
    }
    async createRequest(dto) {
        const period = await this.getPeriodById(dto.zakathPeriodId);
        if (period.status !== 'active') {
            throw new common_1.BadRequestException('Cannot create request for a non-active period');
        }
        await this.getCategoryById(dto.categoryId);
        if (dto.isExternal) {
            if (!dto.externalName) {
                throw new common_1.BadRequestException('External requester name is required');
            }
            return this.prisma.zakathRequest.create({
                data: {
                    zakathPeriodId: dto.zakathPeriodId,
                    categoryId: dto.categoryId,
                    amountRequested: dto.amountRequested,
                    reason: dto.reason,
                    notes: dto.notes,
                    supportingDocs: dto.supportingDocs,
                    status: 'pending',
                    isExternal: true,
                    externalName: dto.externalName,
                    externalPhone: dto.externalPhone,
                    externalNic: dto.externalNic,
                    externalAddress: dto.externalAddress,
                },
                include: {
                    category: {
                        select: { id: true, name: true },
                    },
                },
            });
        }
        if (!dto.requesterId) {
            throw new common_1.BadRequestException('Requester ID is required for registered members');
        }
        const existingCollection = await this.prisma.zakathCollection.findFirst({
            where: {
                zakathPeriodId: dto.zakathPeriodId,
                donorId: dto.requesterId,
            },
        });
        if (existingCollection) {
            throw new common_1.BadRequestException('This person has already given zakath in this cycle. A person cannot be both a giver and receiver in the same zakath cycle.');
        }
        return this.prisma.zakathRequest.create({
            data: {
                zakathPeriodId: dto.zakathPeriodId,
                requesterId: dto.requesterId,
                categoryId: dto.categoryId,
                amountRequested: dto.amountRequested,
                reason: dto.reason,
                notes: dto.notes,
                supportingDocs: dto.supportingDocs,
                status: 'pending',
                isExternal: false,
            },
            include: {
                requester: {
                    select: { id: true, fullName: true },
                },
                category: {
                    select: { id: true, name: true },
                },
            },
        });
    }
    async updateRequest(id, dto) {
        const request = await this.getRequestById(id);
        if (request.status !== 'pending') {
            throw new common_1.BadRequestException('Can only update pending requests');
        }
        if (dto.categoryId) {
            await this.getCategoryById(dto.categoryId);
        }
        return this.prisma.zakathRequest.update({
            where: { id },
            data: dto,
        });
    }
    async approveRequest(id, dto, decidedBy) {
        const request = await this.getRequestById(id);
        if (request.status !== 'pending') {
            throw new common_1.BadRequestException('Can only approve pending requests');
        }
        return this.prisma.zakathRequest.update({
            where: { id },
            data: {
                status: 'approved',
                amountApproved: dto.amountApproved,
                decisionNotes: dto.decisionNotes,
                decisionDate: new Date(),
                decidedBy,
            },
        });
    }
    async rejectRequest(id, dto, decidedBy) {
        const request = await this.getRequestById(id);
        if (request.status !== 'pending') {
            throw new common_1.BadRequestException('Can only reject pending requests');
        }
        return this.prisma.zakathRequest.update({
            where: { id },
            data: {
                status: 'rejected',
                decisionNotes: dto.decisionNotes,
                decisionDate: new Date(),
                decidedBy,
            },
        });
    }
    async deleteRequest(id) {
        const request = await this.getRequestById(id);
        if (request.distributions.length > 0) {
            throw new common_1.BadRequestException('Cannot delete request with distributions');
        }
        return this.prisma.zakathRequest.delete({ where: { id } });
    }
    async createDistribution(dto, distributedBy) {
        const request = await this.getRequestById(dto.zakathRequestId);
        if (request.status !== 'approved' && request.status !== 'partial') {
            throw new common_1.BadRequestException('Can only distribute to approved requests');
        }
        const totalDistributed = request.distributions.reduce((sum, d) => sum + Number(d.amount), 0);
        const amountApproved = Number(request.amountApproved);
        if (totalDistributed + dto.amount > amountApproved) {
            throw new common_1.BadRequestException(`Distribution amount exceeds approved amount. Remaining: ${amountApproved - totalDistributed}`);
        }
        const distribution = await this.prisma.zakathDistribution.create({
            data: {
                zakathRequestId: dto.zakathRequestId,
                amount: dto.amount,
                distributedAt: new Date(),
                distributedBy,
                notes: dto.notes,
            },
        });
        const newTotal = totalDistributed + dto.amount;
        const newStatus = newTotal >= amountApproved ? 'distributed' : 'partial';
        await this.prisma.zakathRequest.update({
            where: { id: dto.zakathRequestId },
            data: { status: newStatus },
        });
        return distribution;
    }
    async getDistributionById(id) {
        const distribution = await this.prisma.zakathDistribution.findUnique({
            where: { id },
            include: {
                zakathRequest: {
                    include: {
                        requester: { select: { id: true, fullName: true } },
                        category: { select: { id: true, name: true } },
                    },
                },
                distributedByUser: {
                    select: { id: true, fullName: true },
                },
            },
        });
        if (!distribution) {
            throw new common_1.NotFoundException('Distribution not found');
        }
        return distribution;
    }
    async getPeriodReport(periodId) {
        const period = await this.getPeriodById(periodId);
        const collectionsData = await this.prisma.zakathCollection.aggregate({
            where: { zakathPeriodId: periodId },
            _sum: { amount: true },
            _count: true,
        });
        const distributionsData = await this.prisma.zakathDistribution.aggregate({
            where: { zakathRequest: { zakathPeriodId: periodId } },
            _sum: { amount: true },
            _count: true,
        });
        const requestsByStatus = await this.prisma.zakathRequest.groupBy({
            by: ['status'],
            where: { zakathPeriodId: periodId },
            _count: true,
            _sum: { amountRequested: true, amountApproved: true },
        });
        const distributionsByCategory = await this.prisma.zakathRequest.groupBy({
            by: ['categoryId'],
            where: { zakathPeriodId: periodId, status: { in: ['distributed', 'partial'] } },
            _sum: { amountApproved: true },
            _count: true,
        });
        const categoryIds = distributionsByCategory.map(d => d.categoryId);
        const categories = await this.prisma.zakathCategory.findMany({
            where: { id: { in: categoryIds } },
        });
        const categoryMap = new Map(categories.map(c => [c.id, c]));
        const distributionsByCategoryWithNames = distributionsByCategory.map(d => ({
            ...d,
            category: categoryMap.get(d.categoryId),
        }));
        const topDonors = await this.prisma.zakathCollection.groupBy({
            by: ['donorId', 'donorName'],
            where: { zakathPeriodId: periodId },
            _sum: { amount: true },
            _count: true,
            orderBy: { _sum: { amount: 'desc' } },
            take: 10,
        });
        const donorIds = topDonors.filter(d => d.donorId).map(d => d.donorId);
        const donors = await this.prisma.person.findMany({
            where: { id: { in: donorIds } },
            select: { id: true, fullName: true },
        });
        const donorMap = new Map(donors.map(d => [d.id, d]));
        const topDonorsWithNames = topDonors.map(d => ({
            donorName: d.donorId ? donorMap.get(d.donorId)?.fullName : d.donorName,
            totalAmount: d._sum.amount,
            count: d._count,
        }));
        return {
            period,
            summary: {
                totalCollected: collectionsData._sum.amount ?? 0,
                collectionsCount: collectionsData._count,
                totalDistributed: distributionsData._sum.amount ?? 0,
                distributionsCount: distributionsData._count,
                balance: Number(collectionsData._sum.amount ?? 0) - Number(distributionsData._sum.amount ?? 0),
            },
            requestsByStatus: requestsByStatus.map(r => ({
                status: r.status,
                count: r._count,
                amountRequested: r._sum.amountRequested,
                amountApproved: r._sum.amountApproved,
            })),
            distributionsByCategory: distributionsByCategoryWithNames,
            topDonors: topDonorsWithNames,
        };
    }
    async getOverallReport() {
        const periodsSummary = await this.prisma.zakathPeriod.findMany({
            select: {
                id: true,
                name: true,
                hijriYear: true,
                status: true,
                totalCollected: true,
                totalDistributed: true,
                _count: {
                    select: {
                        collections: true,
                        requests: true,
                    },
                },
            },
            orderBy: [{ hijriYear: 'desc' }, { hijriMonth: 'desc' }],
        });
        const overallCollections = await this.prisma.zakathCollection.aggregate({
            _sum: { amount: true },
            _count: true,
        });
        const overallDistributions = await this.prisma.zakathDistribution.aggregate({
            _sum: { amount: true },
            _count: true,
        });
        const categoryWiseDistribution = await this.prisma.zakathRequest.groupBy({
            by: ['categoryId'],
            where: { status: { in: ['distributed', 'partial'] } },
            _sum: { amountApproved: true },
            _count: true,
        });
        const categoryIds = categoryWiseDistribution.map(d => d.categoryId);
        const categories = await this.prisma.zakathCategory.findMany({
            where: { id: { in: categoryIds } },
        });
        const categoryMap = new Map(categories.map(c => [c.id, c]));
        return {
            overall: {
                totalCollected: overallCollections._sum.amount ?? 0,
                totalCollectionsCount: overallCollections._count,
                totalDistributed: overallDistributions._sum.amount ?? 0,
                totalDistributionsCount: overallDistributions._count,
            },
            periodsSummary,
            categoryWiseDistribution: categoryWiseDistribution.map(d => ({
                category: categoryMap.get(d.categoryId),
                totalDistributed: d._sum.amountApproved,
                recipientsCount: d._count,
            })),
        };
    }
};
exports.ZakathService = ZakathService;
exports.ZakathService = ZakathService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ZakathService);
//# sourceMappingURL=zakath.service.js.map