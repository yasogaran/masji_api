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
exports.FamiliesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FamiliesService = class FamiliesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 1, limit = 20, search, mahallaId, isSandaaEligible } = query;
        const skip = (page - 1) * limit;
        const where = {
            familyHeadId: null,
        };
        if (mahallaId) {
            where.house = { mahallaId };
        }
        if (isSandaaEligible !== undefined) {
            where.isSandaaEligible = isSandaaEligible;
        }
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } },
                { nic: { contains: search } },
                { familyName: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [familyHeads, total] = await Promise.all([
            this.prisma.person.findMany({
                where,
                skip,
                take: limit,
                include: {
                    house: {
                        include: {
                            mahalla: true,
                        },
                    },
                    familyMembers: {
                        select: {
                            id: true,
                            fullName: true,
                            gender: true,
                            phone: true,
                            relationshipType: true,
                            memberStatus: true,
                        },
                    },
                    relationshipType: true,
                },
                orderBy: [
                    { house: { mahalla: { title: 'asc' } } },
                    { house: { houseNumber: 'asc' } },
                    { fullName: 'asc' },
                ],
            }),
            this.prisma.person.count({ where }),
        ]);
        return {
            data: familyHeads,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const familyHead = await this.prisma.person.findUnique({
            where: { id },
            include: {
                house: {
                    include: {
                        mahalla: true,
                    },
                },
                memberStatus: true,
                civilStatus: true,
                educationLevel: true,
                occupation: true,
                relationshipType: true,
                familyMembers: {
                    include: {
                        memberStatus: true,
                        civilStatus: true,
                        relationshipType: true,
                    },
                    orderBy: [
                        { relationshipTypeId: 'asc' },
                        { dob: 'asc' },
                    ],
                },
            },
        });
        if (!familyHead) {
            throw new common_1.NotFoundException('Family not found');
        }
        if (familyHead.familyHeadId !== null) {
            throw new common_1.NotFoundException('This person is not a family head');
        }
        let sandaaHistory = [];
        if (familyHead.isSandaaEligible) {
            sandaaHistory = await this.prisma.sandaaPayment.findMany({
                where: { personId: id },
                orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
                take: 12,
            });
        }
        return {
            ...familyHead,
            sandaaHistory,
        };
    }
    async getSummary(mahallaId) {
        const baseWhere = {
            familyHeadId: null,
        };
        if (mahallaId) {
            baseWhere.house = { mahallaId };
        }
        const [totalFamilies, eligibleFamilies, nonEligibleFamilies] = await Promise.all([
            this.prisma.person.count({ where: baseWhere }),
            this.prisma.person.count({ where: { ...baseWhere, isSandaaEligible: true } }),
            this.prisma.person.count({ where: { ...baseWhere, isSandaaEligible: false } }),
        ]);
        const mahallas = await this.prisma.mahalla.findMany({
            where: { isActive: true },
        });
        const mahallaStats = await Promise.all(mahallas.map(async (m) => {
            const mahallaWhere = {
                familyHeadId: null,
                house: { mahallaId: m.id },
            };
            const [total, eligible, nonEligible] = await Promise.all([
                this.prisma.person.count({ where: mahallaWhere }),
                this.prisma.person.count({ where: { ...mahallaWhere, isSandaaEligible: true } }),
                this.prisma.person.count({ where: { ...mahallaWhere, isSandaaEligible: false } }),
            ]);
            return {
                mahallaId: m.id,
                mahallaTitle: m.title,
                totalFamilies: total,
                eligibleFamilies: eligible,
                nonEligibleFamilies: nonEligible,
            };
        }));
        return {
            totalFamilies,
            eligibleFamilies,
            nonEligibleFamilies,
            byMahalla: mahallaStats,
        };
    }
    async update(id, dto) {
        const familyHead = await this.prisma.person.findUnique({ where: { id } });
        if (!familyHead) {
            throw new common_1.NotFoundException('Family not found');
        }
        if (familyHead.familyHeadId !== null) {
            throw new common_1.NotFoundException('This person is not a family head');
        }
        return this.prisma.person.update({
            where: { id },
            data: {
                familyName: dto.familyName,
                isSandaaEligible: dto.isSandaaEligible,
                sandaaExemptReason: dto.isSandaaEligible ? null : dto.sandaaExemptReason,
            },
            include: {
                house: {
                    include: { mahalla: true },
                },
                familyMembers: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
    }
    async updateEligibility(id, isSandaaEligible, sandaaExemptReason) {
        const familyHead = await this.prisma.person.findUnique({ where: { id } });
        if (!familyHead) {
            throw new common_1.NotFoundException('Family not found');
        }
        if (familyHead.familyHeadId !== null) {
            throw new common_1.NotFoundException('This person is not a family head');
        }
        return this.prisma.person.update({
            where: { id },
            data: {
                isSandaaEligible,
                sandaaExemptReason: isSandaaEligible ? null : sandaaExemptReason,
            },
            include: {
                house: {
                    include: { mahalla: true },
                },
                familyMembers: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
    }
    async delete(id) {
        const familyHead = await this.prisma.person.findUnique({
            where: { id },
            include: {
                familyMembers: true,
            },
        });
        if (!familyHead) {
            throw new common_1.NotFoundException('Family not found');
        }
        if (familyHead.familyHeadId !== null) {
            throw new common_1.NotFoundException('This person is not a family head');
        }
        if (familyHead.familyMembers.length > 0) {
            await this.prisma.person.updateMany({
                where: { familyHeadId: id },
                data: { familyHeadId: null },
            });
        }
        return { message: 'Family dissolved. Members are now independent.' };
    }
};
exports.FamiliesService = FamiliesService;
exports.FamiliesService = FamiliesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FamiliesService);
//# sourceMappingURL=families.service.js.map