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
exports.MahallasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let MahallasService = class MahallasService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const mahallas = await this.prisma.mahalla.findMany({
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
        const additionalCounts = await Promise.all(mahallas.map(async (m) => {
            const [familyCount, peopleCount] = await Promise.all([
                this.prisma.person.count({
                    where: {
                        house: { mahallaId: m.id },
                        familyHeadId: null,
                    },
                }),
                this.prisma.person.count({
                    where: { house: { mahallaId: m.id } },
                }),
            ]);
            return { mahallaId: m.id, familyCount, peopleCount };
        }));
        return mahallas.map((m) => {
            const counts = additionalCounts.find((c) => c.mahallaId === m.id);
            return {
                ...m,
                _count: {
                    ...m._count,
                    families: counts?.familyCount || 0,
                    people: counts?.peopleCount || 0,
                },
            };
        });
    }
    async findById(id) {
        const mahalla = await this.prisma.mahalla.findUnique({
            where: { id },
            include: {
                houses: {
                    orderBy: { houseNumber: 'asc' },
                },
                mosques: true,
                _count: {
                    select: {
                        houses: true,
                        mosques: true,
                    },
                },
            },
        });
        if (!mahalla) {
            throw new common_1.NotFoundException('Mahalla not found');
        }
        return mahalla;
    }
    async create(createMahallaDto, createdBy) {
        return this.prisma.mahalla.create({
            data: {
                ...createMahallaDto,
                createdBy,
            },
        });
    }
    async update(id, updateMahallaDto) {
        const mahalla = await this.prisma.mahalla.findUnique({
            where: { id },
        });
        if (!mahalla) {
            throw new common_1.NotFoundException('Mahalla not found');
        }
        return this.prisma.mahalla.update({
            where: { id },
            data: updateMahallaDto,
        });
    }
    async delete(id) {
        const housesCount = await this.prisma.house.count({
            where: { mahallaId: id },
        });
        if (housesCount > 0) {
            throw new common_1.BadRequestException('Cannot delete mahalla with existing houses. Remove houses first.');
        }
        await this.prisma.mahalla.delete({
            where: { id },
        });
        return { message: 'Mahalla deleted successfully' };
    }
    async getStats(id) {
        const [totalHouses, totalPeople, activeMembers, totalMosques, maleCount, femaleCount, totalFamilies,] = await Promise.all([
            this.prisma.house.count({
                where: { mahallaId: id, isActive: true },
            }),
            this.prisma.person.count({
                where: { house: { mahallaId: id } },
            }),
            this.prisma.person.count({
                where: {
                    house: { mahallaId: id },
                    memberStatusId: 1,
                },
            }),
            this.prisma.mosque.count({
                where: { mahallaId: id, isActive: true },
            }),
            this.prisma.person.count({
                where: {
                    house: { mahallaId: id },
                    gender: 'male',
                },
            }),
            this.prisma.person.count({
                where: {
                    house: { mahallaId: id },
                    gender: 'female',
                },
            }),
            this.prisma.person.count({
                where: {
                    house: { mahallaId: id },
                    familyHeadId: null,
                },
            }),
        ]);
        return {
            totalHouses,
            totalPeople,
            activeMembers,
            totalMosques,
            maleCount,
            femaleCount,
            totalFamilies,
        };
    }
    async getFamilies(id) {
        const familyHeads = await this.prisma.person.findMany({
            where: {
                house: { mahallaId: id },
                familyHeadId: null,
            },
            include: {
                house: {
                    select: {
                        id: true,
                        houseNumber: true,
                    },
                },
                memberStatus: true,
                familyMembers: {
                    select: {
                        id: true,
                        fullName: true,
                        gender: true,
                        relationshipType: true,
                        memberStatus: true,
                    },
                },
                _count: {
                    select: {
                        familyMembers: true,
                    },
                },
            },
            orderBy: [
                { house: { houseNumber: 'asc' } },
                { fullName: 'asc' },
            ],
        });
        return familyHeads.map(head => ({
            id: head.id,
            name: `${head.fullName} Family`,
            familyHead: {
                id: head.id,
                fullName: head.fullName,
                phone: head.phone,
                nic: head.nic,
                gender: head.gender,
                memberStatus: head.memberStatus,
            },
            house: head.house,
            members: head.familyMembers,
            _count: {
                members: head._count.familyMembers + 1,
            },
            isSandaaEligible: head.isSandaaEligible,
            sandaaExemptReason: head.sandaaExemptReason,
        }));
    }
};
exports.MahallasService = MahallasService;
exports.MahallasService = MahallasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MahallasService);
//# sourceMappingURL=mahallas.service.js.map