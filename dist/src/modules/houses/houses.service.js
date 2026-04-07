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
exports.HousesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let HousesService = class HousesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const { page = 1, limit = 20, mahallaId, search } = params;
        const skip = (page - 1) * limit;
        const where = {
            isActive: true,
        };
        if (mahallaId) {
            where.mahallaId = mahallaId;
        }
        if (search) {
            where.OR = [
                { houseNumber: { equals: parseInt(search) || -1 } },
                { addressLine1: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [houses, total] = await Promise.all([
            this.prisma.house.findMany({
                where,
                skip,
                take: limit,
                include: {
                    mahalla: true,
                    _count: {
                        select: {
                            people: true,
                        },
                    },
                },
                orderBy: [
                    { mahalla: { title: 'asc' } },
                    { houseNumber: 'asc' },
                ],
            }),
            this.prisma.house.count({ where }),
        ]);
        const housesWithFamilyCount = await Promise.all(houses.map(async (house) => {
            const familyCount = await this.prisma.person.count({
                where: {
                    houseId: house.id,
                    familyHeadId: null,
                },
            });
            return {
                ...house,
                _count: {
                    ...house._count,
                    families: familyCount,
                },
            };
        }));
        return {
            data: housesWithFamilyCount,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findById(id) {
        const house = await this.prisma.house.findUnique({
            where: { id },
            include: {
                mahalla: true,
                people: {
                    include: {
                        familyHead: {
                            select: {
                                id: true,
                                fullName: true,
                            },
                        },
                        relationshipType: true,
                    },
                    orderBy: [
                        { familyHeadId: 'asc' },
                        { fullName: 'asc' },
                    ],
                },
            },
        });
        if (!house) {
            throw new common_1.NotFoundException('House not found');
        }
        const familyHeads = house.people.filter(p => p.familyHeadId === null);
        return {
            ...house,
            familyHeads,
        };
    }
    async create(createHouseDto, createdBy) {
        const { mahallaId, ...rest } = createHouseDto;
        const lastHouse = await this.prisma.house.findFirst({
            where: { mahallaId },
            orderBy: { houseNumber: 'desc' },
        });
        const houseNumber = (lastHouse?.houseNumber || 0) + 1;
        return this.prisma.house.create({
            data: {
                ...rest,
                mahallaId,
                houseNumber,
                createdBy,
            },
            include: {
                mahalla: true,
            },
        });
    }
    async update(id, updateHouseDto) {
        const house = await this.prisma.house.findUnique({
            where: { id },
        });
        if (!house) {
            throw new common_1.NotFoundException('House not found');
        }
        return this.prisma.house.update({
            where: { id },
            data: updateHouseDto,
            include: {
                mahalla: true,
            },
        });
    }
    async delete(id) {
        const peopleCount = await this.prisma.person.count({
            where: { houseId: id },
        });
        if (peopleCount > 0) {
            throw new common_1.BadRequestException('Cannot delete house with registered people. Remove people first.');
        }
        await this.prisma.house.delete({
            where: { id },
        });
        return { message: 'House deleted successfully' };
    }
    async getHouseMembers(id) {
        const house = await this.prisma.house.findUnique({
            where: { id },
            include: {
                people: {
                    include: {
                        relationshipType: true,
                        memberStatus: true,
                        familyHead: {
                            select: {
                                id: true,
                                fullName: true,
                            },
                        },
                    },
                    orderBy: [
                        { familyHeadId: 'asc' },
                        { fullName: 'asc' },
                    ],
                },
            },
        });
        if (!house) {
            throw new common_1.NotFoundException('House not found');
        }
        const familyHeads = house.people.filter(p => p.familyHeadId === null);
        const families = familyHeads.map(head => {
            const members = house.people.filter(p => p.familyHeadId === head.id && p.id !== head.id);
            return {
                id: head.id,
                name: head.familyName || `${head.fullName}'s Family`,
                familyHead: head,
                members,
                memberCount: members.length + 1,
                isSandaaEligible: head.isSandaaEligible ?? true,
                sandaaExemptReason: head.sandaaExemptReason,
            };
        });
        const allMembers = house.people;
        const totalMembers = allMembers.length;
        const totalFamilies = familyHeads.length;
        return {
            families,
            allMembers,
            totalMembers,
            totalFamilies,
        };
    }
};
exports.HousesService = HousesService;
exports.HousesService = HousesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HousesService);
//# sourceMappingURL=houses.service.js.map