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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                include: {
                    person: {
                        select: {
                            id: true,
                            fullName: true,
                            phone: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count(),
        ]);
        return {
            data: users.map(u => ({
                ...u,
                passwordHash: undefined,
            })),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                person: true,
                permissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            ...user,
            passwordHash: undefined,
        };
    }
    async create(createUserDto) {
        const { personId, phone, email, password, permissions } = createUserDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { phone },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Phone number already registered');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                personId,
                phone,
                email,
                passwordHash,
                mustChangePassword: true,
            },
            include: {
                person: true,
            },
        });
        if (permissions && permissions.length > 0) {
            await this.prisma.userPermission.createMany({
                data: permissions.map(p => ({
                    userId: user.id,
                    permissionId: p.permissionId,
                    mahallaId: p.mahallaId,
                })),
            });
        }
        return {
            ...user,
            passwordHash: undefined,
        };
    }
    async updateStatus(id, status) {
        const user = await this.prisma.user.update({
            where: { id },
            data: { status },
        });
        return {
            ...user,
            passwordHash: undefined,
        };
    }
    async delete(id) {
        await this.prisma.userPermission.deleteMany({
            where: { userId: id },
        });
        await this.prisma.user.delete({
            where: { id },
        });
        return { message: 'User deleted successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map