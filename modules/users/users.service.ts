import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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

  async findById(id: string) {
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
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      passwordHash: undefined,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const { personId, phone, email, password, permissions } = createUserDto;

    // Check if phone already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      throw new BadRequestException('Phone number already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
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

    // Assign permissions if provided
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

  async updateStatus(id: string, status: 'active' | 'inactive') {
    const user = await this.prisma.user.update({
      where: { id },
      data: { status },
    });

    return {
      ...user,
      passwordHash: undefined,
    };
  }

  async delete(id: string) {
    await this.prisma.userPermission.deleteMany({
      where: { userId: id },
    });

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }
}
