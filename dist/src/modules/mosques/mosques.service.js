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
exports.MosquesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let MosquesService = class MosquesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.mosque.findMany({
            where: { isActive: true },
            include: {
                mahalla: true,
                _count: {
                    select: {
                        roleAssignments: true,
                    },
                },
            },
            orderBy: [{ mosqueType: 'asc' }, { name: 'asc' }],
        });
    }
    async findById(id) {
        const mosque = await this.prisma.mosque.findUnique({
            where: { id },
            include: {
                mahalla: true,
                roleAssignments: {
                    include: {
                        person: true,
                        mosqueRole: true,
                    },
                    where: {
                        OR: [
                            { endDate: null },
                            { endDate: { gte: new Date() } },
                        ],
                    },
                },
            },
        });
        if (!mosque) {
            throw new common_1.NotFoundException('Mosque not found');
        }
        return mosque;
    }
    async getParentMosque() {
        return this.prisma.mosque.findFirst({
            where: { mosqueType: 'parent', isActive: true },
            include: { mahalla: true },
        });
    }
    async create(createMosqueDto, createdBy) {
        if (createMosqueDto.mosqueType === 'parent') {
            const existingParent = await this.prisma.mosque.findFirst({
                where: { mosqueType: 'parent', isActive: true },
            });
            if (existingParent) {
                throw new common_1.BadRequestException('A parent mosque already exists. Only one parent mosque is allowed.');
            }
        }
        return this.prisma.mosque.create({
            data: {
                ...createMosqueDto,
                mosqueType: createMosqueDto.mosqueType || 'sub',
            },
            include: {
                mahalla: true,
            },
        });
    }
    async update(id, updateMosqueDto) {
        const mosque = await this.prisma.mosque.findUnique({
            where: { id },
        });
        if (!mosque) {
            throw new common_1.NotFoundException('Mosque not found');
        }
        if (updateMosqueDto.mosqueType === 'parent' && mosque.mosqueType !== 'parent') {
            const existingParent = await this.prisma.mosque.findFirst({
                where: { mosqueType: 'parent', isActive: true, id: { not: id } },
            });
            if (existingParent) {
                throw new common_1.BadRequestException('A parent mosque already exists. Only one parent mosque is allowed.');
            }
        }
        return this.prisma.mosque.update({
            where: { id },
            data: updateMosqueDto,
            include: {
                mahalla: true,
            },
        });
    }
    async delete(id) {
        const mosque = await this.prisma.mosque.findUnique({
            where: { id },
        });
        if (!mosque) {
            throw new common_1.NotFoundException('Mosque not found');
        }
        const assignmentsCount = await this.prisma.mosqueRoleAssignment.count({
            where: { mosqueId: id },
        });
        if (assignmentsCount > 0) {
            throw new common_1.BadRequestException('Cannot delete mosque with role assignments. Remove assignments first.');
        }
        await this.prisma.mosque.delete({
            where: { id },
        });
        return { message: 'Mosque deleted successfully' };
    }
    async getRoles() {
        return this.prisma.mosqueRole.findMany({
            where: { isActive: true },
            orderBy: { roleName: 'asc' },
        });
    }
    async createRole(data) {
        return this.prisma.mosqueRole.create({
            data: {
                roleName: data.roleName,
                description: data.description,
                isActive: true,
            },
        });
    }
    async updateRole(id, data) {
        return this.prisma.mosqueRole.update({
            where: { id },
            data,
        });
    }
    async deleteRole(id) {
        const count = await this.prisma.mosqueRoleAssignment.count({
            where: { mosqueRoleId: id },
        });
        if (count > 0) {
            throw new common_1.BadRequestException('Cannot delete role with existing assignments');
        }
        return this.prisma.mosqueRole.delete({ where: { id } });
    }
    async getRoleAssignments(mosqueId) {
        return this.prisma.mosqueRoleAssignment.findMany({
            where: { mosqueId },
            include: {
                person: true,
                mosqueRole: true,
            },
            orderBy: { startDate: 'desc' },
        });
    }
    async addRoleAssignment(data) {
        const existing = await this.prisma.mosqueRoleAssignment.findFirst({
            where: {
                mosqueId: data.mosqueId,
                personId: data.personId,
                mosqueRoleId: data.mosqueRoleId,
                OR: [
                    { endDate: null },
                    { endDate: { gte: new Date() } },
                ],
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('This person already has this role at this mosque');
        }
        return this.prisma.mosqueRoleAssignment.create({
            data: {
                mosqueId: data.mosqueId,
                personId: data.personId,
                mosqueRoleId: data.mosqueRoleId,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
            },
            include: {
                person: true,
                mosqueRole: true,
            },
        });
    }
    async updateRoleAssignment(id, data) {
        return this.prisma.mosqueRoleAssignment.update({
            where: { id },
            data: {
                endDate: data.endDate ? new Date(data.endDate) : null,
            },
            include: {
                person: true,
                mosqueRole: true,
            },
        });
    }
    async removeRoleAssignment(id) {
        return this.prisma.mosqueRoleAssignment.delete({ where: { id } });
    }
};
exports.MosquesService = MosquesService;
exports.MosquesService = MosquesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MosquesService);
//# sourceMappingURL=mosques.service.js.map