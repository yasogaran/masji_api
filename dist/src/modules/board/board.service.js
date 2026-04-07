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
exports.BoardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BoardService = class BoardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRoles() {
        return this.prisma.boardRole.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async createRole(data) {
        return this.prisma.boardRole.create({
            data: {
                roleName: data.roleName,
                isMahallaSpecific: data.isMahallaSpecific || false,
                sortOrder: data.sortOrder || 0,
                isActive: true,
            },
        });
    }
    async updateRole(id, data) {
        return this.prisma.boardRole.update({
            where: { id },
            data,
        });
    }
    async deleteRole(id) {
        const membersCount = await this.prisma.boardMember.count({
            where: { boardRoleId: id },
        });
        if (membersCount > 0) {
            throw new common_1.BadRequestException('Cannot delete role with assigned members');
        }
        return this.prisma.boardRole.delete({ where: { id } });
    }
    async getTerms() {
        return this.prisma.boardTerm.findMany({
            orderBy: { startDate: 'desc' },
            include: {
                _count: { select: { members: true } },
            },
        });
    }
    async getTermById(id) {
        const term = await this.prisma.boardTerm.findUnique({
            where: { id },
            include: {
                members: {
                    include: { person: true, boardRole: true, mahalla: true },
                    orderBy: { boardRole: { sortOrder: 'asc' } },
                },
            },
        });
        if (!term)
            throw new common_1.NotFoundException('Term not found');
        return term;
    }
    async getCurrentTerm() {
        return this.prisma.boardTerm.findFirst({
            where: { isCurrent: true },
            include: {
                members: {
                    include: { person: true, boardRole: true, mahalla: true },
                    orderBy: { boardRole: { sortOrder: 'asc' } },
                },
            },
        });
    }
    async createTerm(data) {
        if (data.isCurrent) {
            await this.prisma.boardTerm.updateMany({
                where: { isCurrent: true },
                data: { isCurrent: false },
            });
        }
        return this.prisma.boardTerm.create({
            data: {
                name: data.name,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                isCurrent: data.isCurrent || false,
            },
        });
    }
    async updateTerm(id, data) {
        if (data.isCurrent) {
            await this.prisma.boardTerm.updateMany({
                where: { isCurrent: true, id: { not: id } },
                data: { isCurrent: false },
            });
        }
        return this.prisma.boardTerm.update({
            where: { id },
            data: {
                name: data.name,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                isCurrent: data.isCurrent,
            },
        });
    }
    async deleteTerm(id) {
        const membersCount = await this.prisma.boardMember.count({
            where: { boardTermId: id },
        });
        if (membersCount > 0) {
            throw new common_1.BadRequestException('Cannot delete term with assigned members');
        }
        return this.prisma.boardTerm.delete({ where: { id } });
    }
    async getMembers(termId) {
        return this.prisma.boardMember.findMany({
            where: { boardTermId: termId },
            include: { person: true, boardRole: true, mahalla: true },
            orderBy: { boardRole: { sortOrder: 'asc' } },
        });
    }
    async addMember(data) {
        const existing = await this.prisma.boardMember.findFirst({
            where: {
                boardTermId: data.boardTermId,
                personId: data.personId,
                boardRoleId: data.boardRoleId,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('This person already has this role in this term');
        }
        return this.prisma.boardMember.create({
            data: {
                boardTermId: data.boardTermId,
                personId: data.personId,
                boardRoleId: data.boardRoleId,
                mahallaId: data.mahallaId || null,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
            },
            include: { person: true, boardRole: true, mahalla: true },
        });
    }
    async updateMember(id, data) {
        return this.prisma.boardMember.update({
            where: { id },
            data: {
                boardRoleId: data.boardRoleId,
                mahallaId: data.mahallaId,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
            include: { person: true, boardRole: true, mahalla: true },
        });
    }
    async removeMember(id) {
        return this.prisma.boardMember.delete({ where: { id } });
    }
};
exports.BoardService = BoardService;
exports.BoardService = BoardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BoardService);
//# sourceMappingURL=board.service.js.map