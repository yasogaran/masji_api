import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMosqueDto } from './dto/create-mosque.dto';
import { UpdateMosqueDto } from './dto/update-mosque.dto';

@Injectable()
export class MosquesService {
  constructor(private prisma: PrismaService) {}

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

  async findById(id: string) {
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
      throw new NotFoundException('Mosque not found');
    }

    return mosque;
  }

  async getParentMosque() {
    return this.prisma.mosque.findFirst({
      where: { mosqueType: 'parent', isActive: true },
      include: { mahalla: true },
    });
  }

  async create(createMosqueDto: CreateMosqueDto, createdBy?: string) {
    // If trying to create a parent mosque, check if one already exists
    if (createMosqueDto.mosqueType === 'parent') {
      const existingParent = await this.prisma.mosque.findFirst({
        where: { mosqueType: 'parent', isActive: true },
      });

      if (existingParent) {
        throw new BadRequestException('A parent mosque already exists. Only one parent mosque is allowed.');
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

  async update(id: string, updateMosqueDto: UpdateMosqueDto) {
    const mosque = await this.prisma.mosque.findUnique({
      where: { id },
    });

    if (!mosque) {
      throw new NotFoundException('Mosque not found');
    }

    // If trying to change to parent mosque, check if one already exists
    if (updateMosqueDto.mosqueType === 'parent' && mosque.mosqueType !== 'parent') {
      const existingParent = await this.prisma.mosque.findFirst({
        where: { mosqueType: 'parent', isActive: true, id: { not: id } },
      });

      if (existingParent) {
        throw new BadRequestException('A parent mosque already exists. Only one parent mosque is allowed.');
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

  async delete(id: string) {
    const mosque = await this.prisma.mosque.findUnique({
      where: { id },
    });

    if (!mosque) {
      throw new NotFoundException('Mosque not found');
    }

    // Check if mosque has role assignments
    const assignmentsCount = await this.prisma.mosqueRoleAssignment.count({
      where: { mosqueId: id },
    });

    if (assignmentsCount > 0) {
      throw new BadRequestException(
        'Cannot delete mosque with role assignments. Remove assignments first.',
      );
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

  async createRole(data: { roleName: string; description?: string }) {
    return this.prisma.mosqueRole.create({
      data: {
        roleName: data.roleName,
        description: data.description,
        isActive: true,
      },
    });
  }

  async updateRole(id: string, data: { roleName?: string; description?: string; isActive?: boolean }) {
    return this.prisma.mosqueRole.update({
      where: { id },
      data,
    });
  }

  async deleteRole(id: string) {
    // Check for assignments
    const count = await this.prisma.mosqueRoleAssignment.count({
      where: { mosqueRoleId: id },
    });
    if (count > 0) {
      throw new BadRequestException('Cannot delete role with existing assignments');
    }
    return this.prisma.mosqueRole.delete({ where: { id } });
  }

  async getRoleAssignments(mosqueId: string) {
    return this.prisma.mosqueRoleAssignment.findMany({
      where: { mosqueId },
      include: {
        person: true,
        mosqueRole: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async addRoleAssignment(data: {
    mosqueId: string;
    personId: string;
    mosqueRoleId: string;
    startDate: string;
    endDate?: string;
  }) {
    // Check for duplicate active assignment
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
      throw new BadRequestException('This person already has this role at this mosque');
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

  async updateRoleAssignment(id: string, data: { endDate?: string }) {
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

  async removeRoleAssignment(id: string) {
    return this.prisma.mosqueRoleAssignment.delete({ where: { id } });
  }
}
