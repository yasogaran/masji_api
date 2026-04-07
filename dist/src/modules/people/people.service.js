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
exports.PeopleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PeopleService = class PeopleService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const { page = 1, limit = 20, search, mahallaId, houseId, status } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { nic: { contains: search } },
                { phone: { contains: search } },
            ];
        }
        if (houseId) {
            where.houseId = houseId;
        }
        if (mahallaId) {
            where.house = { mahallaId };
        }
        if (status) {
            where.memberStatusId = status;
        }
        const [people, total] = await Promise.all([
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
                    memberStatus: true,
                    civilStatus: true,
                    relationshipType: true,
                    familyHead: {
                        select: {
                            id: true,
                            fullName: true,
                        },
                    },
                },
                orderBy: { fullName: 'asc' },
            }),
            this.prisma.person.count({ where }),
        ]);
        return {
            data: people,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findById(id) {
        const person = await this.prisma.person.findUnique({
            where: { id },
            include: {
                house: {
                    include: {
                        mahalla: true,
                    },
                },
                familyHead: true,
                familyMembers: true,
                memberStatus: true,
                civilStatus: true,
                educationLevel: true,
                occupation: true,
                relationshipType: true,
            },
        });
        if (!person) {
            throw new common_1.NotFoundException('Person not found');
        }
        return person;
    }
    async findByNic(nic) {
        return this.prisma.person.findUnique({
            where: { nic },
            include: {
                house: {
                    include: {
                        mahalla: true,
                    },
                },
            },
        });
    }
    async create(createPersonDto, createdBy) {
        if (createPersonDto.nic) {
            const existing = await this.prisma.person.findUnique({
                where: { nic: createPersonDto.nic },
            });
            if (existing) {
                throw new common_1.BadRequestException('NIC already registered');
            }
        }
        let isOutJamathMahalla = false;
        if (createPersonDto.houseId) {
            const house = await this.prisma.house.findUnique({
                where: { id: createPersonDto.houseId },
                include: { mahalla: true },
            });
            if (house?.mahalla?.isOutJamath) {
                isOutJamathMahalla = true;
            }
        }
        const data = { ...createPersonDto, createdBy };
        if (data.dob && typeof data.dob === 'string') {
            data.dob = new Date(data.dob);
        }
        const isFamilyHead = createPersonDto.relationshipTypeId === 1;
        if (isOutJamathMahalla) {
            data.familyHeadId = null;
            data.isSandaaEligible = false;
        }
        else if (isFamilyHead) {
            data.familyHeadId = null;
            data.isSandaaEligible = createPersonDto.isSandaaEligible ?? true;
        }
        return this.prisma.person.create({
            data,
            include: {
                house: true,
                memberStatus: true,
                relationshipType: true,
                familyHead: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
    }
    async update(id, updatePersonDto) {
        const person = await this.prisma.person.findUnique({
            where: { id },
        });
        if (!person) {
            throw new common_1.NotFoundException('Person not found');
        }
        const nic = updatePersonDto.nic;
        if (nic && nic !== person.nic) {
            const existing = await this.prisma.person.findUnique({
                where: { nic },
            });
            if (existing) {
                throw new common_1.BadRequestException('NIC already registered');
            }
        }
        const data = { ...updatePersonDto };
        if (data.dob && typeof data.dob === 'string') {
            data.dob = new Date(data.dob);
        }
        return this.prisma.person.update({
            where: { id },
            data,
            include: {
                house: true,
                memberStatus: true,
                familyHead: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
    }
    async delete(id) {
        const familyMembers = await this.prisma.person.count({
            where: { familyHeadId: id },
        });
        if (familyMembers > 0) {
            throw new common_1.BadRequestException('Cannot delete person who is a family head. Transfer family leadership first.');
        }
        await this.prisma.person.delete({
            where: { id },
        });
        return { message: 'Person deleted successfully' };
    }
    async getFamilyHeads(mahallaId) {
        const where = {
            familyHeadId: null,
        };
        if (mahallaId) {
            where.house = { mahallaId };
        }
        return this.prisma.person.findMany({
            where,
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
                    },
                },
            },
            orderBy: { fullName: 'asc' },
        });
    }
    async getLookups() {
        const [memberStatuses, civilStatuses, educationLevels, occupations, relationshipTypes,] = await Promise.all([
            this.prisma.memberStatus.findMany(),
            this.prisma.civilStatus.findMany(),
            this.prisma.educationLevel.findMany({ orderBy: { sortOrder: 'asc' } }),
            this.prisma.occupation.findMany({ orderBy: { title: 'asc' } }),
            this.prisma.relationshipType.findMany({ orderBy: { sortOrder: 'asc' } }),
        ]);
        return {
            memberStatuses,
            civilStatuses,
            educationLevels,
            occupations,
            relationshipTypes,
        };
    }
};
exports.PeopleService = PeopleService;
exports.PeopleService = PeopleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PeopleService);
//# sourceMappingURL=people.service.js.map