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
exports.KurbaanService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const QRCode = require("qrcode");
let KurbaanService = class KurbaanService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPeriods(query) {
        const page = query?.page || 1;
        const limit = query?.limit || 50;
        const skip = (page - 1) * limit;
        const where = {};
        if (query?.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        const [data, total] = await Promise.all([
            this.prisma.kurbaanPeriod.findMany({
                where,
                orderBy: { hijriYear: 'desc' },
                skip,
                take: limit,
                include: {
                    _count: {
                        select: { participants: true },
                    },
                },
            }),
            this.prisma.kurbaanPeriod.count({ where }),
        ]);
        const periodsWithStats = await Promise.all(data.map(async (period) => {
            const stats = await this.prisma.kurbaanParticipant.groupBy({
                by: ['isDistributed'],
                where: { kurbaanPeriodId: period.id },
                _count: true,
            });
            const distributed = stats.find((s) => s.isDistributed)?._count || 0;
            const pending = stats.find((s) => !s.isDistributed)?._count || 0;
            return {
                ...period,
                stats: {
                    totalParticipants: period._count.participants,
                    distributed,
                    pending,
                },
            };
        }));
        return {
            data: periodsWithStats,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getActivePeriod() {
        return this.prisma.kurbaanPeriod.findFirst({
            where: { isActive: true },
            include: {
                _count: {
                    select: { participants: true },
                },
            },
        });
    }
    async getPeriodById(id) {
        const period = await this.prisma.kurbaanPeriod.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { participants: true },
                },
            },
        });
        if (!period) {
            throw new common_1.NotFoundException('Kurbaan period not found');
        }
        const stats = await this.prisma.kurbaanParticipant.groupBy({
            by: ['isDistributed'],
            where: { kurbaanPeriodId: id },
            _count: true,
        });
        const distributed = stats.find((s) => s.isDistributed)?._count || 0;
        const pending = stats.find((s) => !s.isDistributed)?._count || 0;
        return {
            ...period,
            stats: {
                totalParticipants: period._count.participants,
                distributed,
                pending,
            },
        };
    }
    async createPeriod(dto, userId) {
        await this.prisma.kurbaanPeriod.updateMany({
            where: { isActive: true },
            data: { isActive: false },
        });
        return this.prisma.kurbaanPeriod.create({
            data: {
                name: dto.name,
                hijriYear: dto.hijriYear,
                gregorianDate: dto.gregorianDate ? new Date(dto.gregorianDate) : null,
                isActive: true,
                createdBy: userId,
            },
        });
    }
    async updatePeriod(id, dto) {
        const period = await this.prisma.kurbaanPeriod.findUnique({ where: { id } });
        if (!period) {
            throw new common_1.NotFoundException('Kurbaan period not found');
        }
        if (dto.isActive === true) {
            await this.prisma.kurbaanPeriod.updateMany({
                where: { id: { not: id }, isActive: true },
                data: { isActive: false },
            });
        }
        return this.prisma.kurbaanPeriod.update({
            where: { id },
            data: {
                name: dto.name,
                hijriYear: dto.hijriYear,
                gregorianDate: dto.gregorianDate ? new Date(dto.gregorianDate) : undefined,
                isActive: dto.isActive,
            },
        });
    }
    async completePeriod(id) {
        const period = await this.prisma.kurbaanPeriod.findUnique({ where: { id } });
        if (!period) {
            throw new common_1.NotFoundException('Kurbaan period not found');
        }
        return this.prisma.kurbaanPeriod.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async deletePeriod(id) {
        const period = await this.prisma.kurbaanPeriod.findUnique({
            where: { id },
            include: { _count: { select: { participants: true } } },
        });
        if (!period) {
            throw new common_1.NotFoundException('Kurbaan period not found');
        }
        if (period._count.participants > 0) {
            throw new common_1.BadRequestException('Cannot delete period with participants. Delete participants first.');
        }
        return this.prisma.kurbaanPeriod.delete({ where: { id } });
    }
    async generateQRCode(data) {
        try {
            const qrData = JSON.stringify(data);
            return await QRCode.toDataURL(qrData, {
                width: 200,
                margin: 1,
                color: {
                    dark: '#0d9488',
                    light: '#ffffff',
                },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to generate QR code');
        }
    }
    async getParticipants(query) {
        const page = query.page || 1;
        const limit = query.limit || 50;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.kurbaanPeriodId) {
            where.kurbaanPeriodId = query.kurbaanPeriodId;
        }
        if (query.isDistributed !== undefined) {
            where.isDistributed = query.isDistributed;
        }
        if (query.search) {
            where.OR = [
                { familyHead: { fullName: { contains: query.search, mode: 'insensitive' } } },
                { externalName: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        if (query.mahallaId === 'external') {
            where.isExternal = true;
        }
        else if (query.mahallaId) {
            where.isExternal = false;
            where.familyHead = {
                ...where.familyHead,
                house: {
                    mahallaId: query.mahallaId,
                },
            };
        }
        const [data, total] = await Promise.all([
            this.prisma.kurbaanParticipant.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    familyHead: {
                        include: {
                            house: {
                                include: {
                                    mahalla: true,
                                },
                            },
                        },
                    },
                    kurbaanPeriod: true,
                    distributedByUser: {
                        select: { id: true, fullName: true },
                    },
                },
            }),
            this.prisma.kurbaanParticipant.count({ where }),
        ]);
        const participantsWithMemberCount = await Promise.all(data.map(async (participant) => {
            if (participant.isExternal) {
                return {
                    ...participant,
                    familyCount: 1,
                    memberCount: participant.externalPeopleCount || 1,
                };
            }
            if (!participant.familyHeadId) {
                return {
                    ...participant,
                    familyCount: 1,
                    memberCount: 1,
                };
            }
            const memberCount = await this.prisma.person.count({
                where: { familyHeadId: participant.familyHeadId },
            });
            return {
                ...participant,
                familyCount: 1,
                memberCount: memberCount + 1,
            };
        }));
        return {
            data: participantsWithMemberCount,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getParticipantById(id) {
        const participant = await this.prisma.kurbaanParticipant.findUnique({
            where: { id },
            include: {
                familyHead: {
                    include: {
                        house: {
                            include: {
                                mahalla: true,
                            },
                        },
                    },
                },
                kurbaanPeriod: true,
                distributedByUser: {
                    select: { id: true, fullName: true },
                },
            },
        });
        if (!participant) {
            throw new common_1.NotFoundException('Participant not found');
        }
        return participant;
    }
    async createParticipant(dto, userId) {
        const period = await this.prisma.kurbaanPeriod.findUnique({
            where: { id: dto.kurbaanPeriodId },
        });
        if (!period) {
            throw new common_1.NotFoundException('Kurbaan period not found');
        }
        if (dto.isExternal) {
            if (!dto.externalName) {
                throw new common_1.BadRequestException('External family name is required');
            }
            const qrData = {
                type: 'KURBAAN',
                periodId: dto.kurbaanPeriodId,
                periodName: period.name,
                isExternal: true,
                externalName: dto.externalName,
                externalPhone: dto.externalPhone,
                externalPeopleCount: dto.externalPeopleCount,
                timestamp: new Date().toISOString(),
            };
            const qrCode = await this.generateQRCode(qrData);
            return this.prisma.kurbaanParticipant.create({
                data: {
                    kurbaanPeriodId: dto.kurbaanPeriodId,
                    isExternal: true,
                    externalName: dto.externalName,
                    externalPhone: dto.externalPhone,
                    externalAddress: dto.externalAddress,
                    externalPeopleCount: dto.externalPeopleCount,
                    qrCode,
                },
                include: {
                    kurbaanPeriod: true,
                },
            });
        }
        if (!dto.familyHeadId) {
            throw new common_1.BadRequestException('Family head ID is required for registered families');
        }
        const familyHead = await this.prisma.person.findUnique({
            where: { id: dto.familyHeadId },
            include: {
                house: {
                    include: { mahalla: true },
                },
            },
        });
        if (!familyHead) {
            throw new common_1.NotFoundException('Family head not found');
        }
        const existing = await this.prisma.kurbaanParticipant.findFirst({
            where: {
                kurbaanPeriodId: dto.kurbaanPeriodId,
                familyHeadId: dto.familyHeadId,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Family is already registered for this period');
        }
        const qrData = {
            type: 'KURBAAN',
            periodId: dto.kurbaanPeriodId,
            periodName: period.name,
            familyHeadId: dto.familyHeadId,
            familyHeadName: familyHead.fullName,
            houseNo: familyHead.house?.houseNumber,
            mahalla: familyHead.house?.mahalla?.title,
            timestamp: new Date().toISOString(),
        };
        const qrCode = await this.generateQRCode(qrData);
        return this.prisma.kurbaanParticipant.create({
            data: {
                kurbaanPeriodId: dto.kurbaanPeriodId,
                familyHeadId: dto.familyHeadId,
                isExternal: false,
                qrCode,
            },
            include: {
                familyHead: {
                    include: {
                        house: {
                            include: { mahalla: true },
                        },
                    },
                },
                kurbaanPeriod: true,
            },
        });
    }
    async bulkCreateParticipants(dto, userId) {
        const period = await this.prisma.kurbaanPeriod.findUnique({
            where: { id: dto.kurbaanPeriodId },
        });
        if (!period) {
            throw new common_1.NotFoundException('Kurbaan period not found');
        }
        const results = {
            created: 0,
            skipped: 0,
            errors: [],
        };
        for (const familyHeadId of dto.familyHeadIds) {
            try {
                const existing = await this.prisma.kurbaanParticipant.findFirst({
                    where: {
                        kurbaanPeriodId: dto.kurbaanPeriodId,
                        familyHeadId,
                    },
                });
                if (existing) {
                    results.skipped++;
                    continue;
                }
                const familyHead = await this.prisma.person.findUnique({
                    where: { id: familyHeadId },
                    include: {
                        house: {
                            include: { mahalla: true },
                        },
                    },
                });
                if (!familyHead) {
                    results.errors.push(`Family head ${familyHeadId} not found`);
                    continue;
                }
                const qrData = {
                    type: 'KURBAAN',
                    periodId: dto.kurbaanPeriodId,
                    periodName: period.name,
                    familyHeadId,
                    familyHeadName: familyHead.fullName,
                    houseNo: familyHead.house?.houseNumber,
                    mahalla: familyHead.house?.mahalla?.title,
                    timestamp: new Date().toISOString(),
                };
                const qrCode = await this.generateQRCode(qrData);
                await this.prisma.kurbaanParticipant.create({
                    data: {
                        kurbaanPeriodId: dto.kurbaanPeriodId,
                        familyHeadId,
                        qrCode,
                    },
                });
                results.created++;
            }
            catch (error) {
                results.errors.push(`Error for ${familyHeadId}: ${error.message}`);
            }
        }
        return results;
    }
    async registerAllFamilies(dto, userId) {
        const period = await this.prisma.kurbaanPeriod.findUnique({
            where: { id: dto.kurbaanPeriodId },
        });
        if (!period) {
            throw new common_1.NotFoundException('Kurbaan period not found');
        }
        const familyHeads = await this.prisma.person.findMany({
            where: {
                familyHeadId: null,
                ...(dto.mahallaId ? { house: { mahallaId: dto.mahallaId } } : {}),
            },
            select: { id: true },
        });
        const familyHeadIds = familyHeads.map(fh => fh.id);
        return this.bulkCreateParticipants({
            kurbaanPeriodId: dto.kurbaanPeriodId,
            familyHeadIds,
        }, userId);
    }
    async markDistributed(id, dto, userId) {
        const participant = await this.prisma.kurbaanParticipant.findUnique({
            where: { id },
        });
        if (!participant) {
            throw new common_1.NotFoundException('Participant not found');
        }
        if (participant.isDistributed) {
            throw new common_1.BadRequestException('Already marked as distributed');
        }
        return this.prisma.kurbaanParticipant.update({
            where: { id },
            data: {
                isDistributed: true,
                distributedAt: new Date(),
                distributedBy: userId,
            },
            include: {
                familyHead: {
                    include: {
                        house: {
                            include: { mahalla: true },
                        },
                    },
                },
                kurbaanPeriod: true,
            },
        });
    }
    async markDistributedByQR(qrCode, userId) {
        const participant = await this.prisma.kurbaanParticipant.findFirst({
            where: { qrCode },
        });
        if (!participant) {
            throw new common_1.NotFoundException('Participant not found');
        }
        return this.markDistributed(participant.id, {}, userId);
    }
    async deleteParticipant(id) {
        const participant = await this.prisma.kurbaanParticipant.findUnique({
            where: { id },
        });
        if (!participant) {
            throw new common_1.NotFoundException('Participant not found');
        }
        return this.prisma.kurbaanParticipant.delete({ where: { id } });
    }
    async getPeriodReport(periodId) {
        const period = await this.prisma.kurbaanPeriod.findUnique({
            where: { id: periodId },
        });
        if (!period) {
            throw new common_1.NotFoundException('Kurbaan period not found');
        }
        const participants = await this.prisma.kurbaanParticipant.findMany({
            where: { kurbaanPeriodId: periodId },
            include: {
                familyHead: {
                    include: {
                        house: {
                            include: { mahalla: true },
                        },
                    },
                },
            },
        });
        const totalParticipants = participants.length;
        const distributed = participants.filter((p) => p.isDistributed).length;
        const pending = totalParticipants - distributed;
        const externalParticipants = participants.filter((p) => p.isExternal);
        const registeredParticipants = participants.filter((p) => !p.isExternal);
        const externalStats = {
            total: externalParticipants.length,
            distributed: externalParticipants.filter((p) => p.isDistributed).length,
            pending: externalParticipants.filter((p) => !p.isDistributed).length,
            totalPeople: externalParticipants.reduce((sum, p) => sum + (p.externalPeopleCount || 1), 0),
        };
        const registeredStats = {
            total: registeredParticipants.length,
            distributed: registeredParticipants.filter((p) => p.isDistributed).length,
            pending: registeredParticipants.filter((p) => !p.isDistributed).length,
        };
        const byMahalla = {};
        for (const p of registeredParticipants) {
            const mahallaId = p.familyHead?.house?.mahallaId || 'unknown';
            const mahallaName = p.familyHead?.house?.mahalla?.title || 'Unknown';
            if (!byMahalla[mahallaId]) {
                byMahalla[mahallaId] = {
                    mahallaId,
                    mahallaName,
                    total: 0,
                    distributed: 0,
                    pending: 0,
                };
            }
            byMahalla[mahallaId].total++;
            if (p.isDistributed) {
                byMahalla[mahallaId].distributed++;
            }
            else {
                byMahalla[mahallaId].pending++;
            }
        }
        return {
            period: {
                id: period.id,
                name: period.name,
                hijriYear: period.hijriYear,
                gregorianDate: period.gregorianDate,
                isActive: period.isActive,
            },
            summary: {
                totalParticipants,
                distributed,
                pending,
                distributionPercentage: totalParticipants > 0 ? Math.round((distributed / totalParticipants) * 100) : 0,
            },
            registered: registeredStats,
            external: externalStats,
            byMahalla: Object.values(byMahalla).sort((a, b) => b.total - a.total),
        };
    }
    async getParticipantsForCards(periodId, mahallaId, filterType, page, limit) {
        const where = { kurbaanPeriodId: periodId };
        if (filterType === 'external') {
            where.isExternal = true;
        }
        else if (mahallaId) {
            where.isExternal = false;
            where.familyHead = {
                house: { mahallaId },
            };
        }
        const total = await this.prisma.kurbaanParticipant.count({ where });
        const queryOptions = {
            where,
            include: {
                familyHead: {
                    include: {
                        house: {
                            include: { mahalla: true },
                        },
                    },
                },
            },
            orderBy: [
                { isExternal: 'asc' },
                { familyHead: { house: { mahalla: { title: 'asc' } } } },
                { familyHead: { house: { houseNumber: 'asc' } } },
                { externalName: 'asc' },
            ],
        };
        if (page && limit) {
            queryOptions.skip = (page - 1) * limit;
            queryOptions.take = limit;
        }
        const participants = await this.prisma.kurbaanParticipant.findMany(queryOptions);
        const result = await Promise.all(participants.map(async (p) => {
            if (p.isExternal) {
                return {
                    id: p.id,
                    qrCode: p.qrCode,
                    isDistributed: p.isDistributed,
                    isExternal: true,
                    familyHead: {
                        id: null,
                        name: p.externalName || 'External Family',
                        phone: p.externalPhone,
                    },
                    house: {
                        number: null,
                        mahalla: 'External',
                        address: p.externalAddress,
                    },
                    memberCount: p.externalPeopleCount || 1,
                };
            }
            let totalMembers = 1;
            if (p.familyHeadId) {
                const memberCount = await this.prisma.person.count({
                    where: { familyHeadId: p.familyHeadId },
                });
                totalMembers = memberCount + 1;
            }
            const house = p.familyHead?.house;
            const addressParts = [
                house?.addressLine1,
                house?.addressLine2,
                house?.addressLine3,
                house?.city,
            ].filter(Boolean);
            const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : undefined;
            return {
                id: p.id,
                qrCode: p.qrCode,
                isDistributed: p.isDistributed,
                isExternal: false,
                familyHead: {
                    id: p.familyHead?.id,
                    name: p.familyHead?.fullName || 'Unknown',
                    phone: p.familyHead?.phone,
                },
                house: {
                    number: house?.houseNumber,
                    mahalla: house?.mahalla?.title,
                    address: fullAddress,
                },
                memberCount: totalMembers,
            };
        }));
        if (page && limit) {
            return {
                data: result,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }
        return result;
    }
};
exports.KurbaanService = KurbaanService;
exports.KurbaanService = KurbaanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KurbaanService);
//# sourceMappingURL=kurbaan.service.js.map