import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  // Roles
  async getRoles() {
    return this.prisma.boardRole.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createRole(data: { roleName: string; isMahallaSpecific?: boolean; sortOrder?: number }) {
    return this.prisma.boardRole.create({
      data: {
        roleName: data.roleName,
        isMahallaSpecific: data.isMahallaSpecific || false,
        sortOrder: data.sortOrder || 0,
        isActive: true,
      },
    });
  }

  async updateRole(id: string, data: { roleName?: string; isMahallaSpecific?: boolean; sortOrder?: number; isActive?: boolean }) {
    return this.prisma.boardRole.update({
      where: { id },
      data,
    });
  }

  async deleteRole(id: string) {
    // Check if role has members
    const membersCount = await this.prisma.boardMember.count({
      where: { boardRoleId: id },
    });
    if (membersCount > 0) {
      throw new BadRequestException('Cannot delete role with assigned members');
    }
    return this.prisma.boardRole.delete({ where: { id } });
  }

  // Terms
  async getTerms() {
    return this.prisma.boardTerm.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        _count: { select: { members: true } },
      },
    });
  }

  async getTermById(id: string) {
    const term = await this.prisma.boardTerm.findUnique({
      where: { id },
      include: {
        members: {
          include: { person: true, boardRole: true, mahalla: true },
          orderBy: { boardRole: { sortOrder: 'asc' } },
        },
      },
    });
    if (!term) throw new NotFoundException('Term not found');
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

  async createTerm(data: { name: string; startDate: string; endDate?: string; isCurrent?: boolean }) {
    // If this is marked as current, unset all other current terms
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

  async updateTerm(id: string, data: { name?: string; startDate?: string; endDate?: string; isCurrent?: boolean }) {
    // If this is marked as current, unset all other current terms
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

  async deleteTerm(id: string) {
    // Check if term has members
    const membersCount = await this.prisma.boardMember.count({
      where: { boardTermId: id },
    });
    if (membersCount > 0) {
      throw new BadRequestException('Cannot delete term with assigned members');
    }
    return this.prisma.boardTerm.delete({ where: { id } });
  }

  // Members
  async getMembers(termId: string) {
    return this.prisma.boardMember.findMany({
      where: { boardTermId: termId },
      include: { person: true, boardRole: true, mahalla: true },
      orderBy: { boardRole: { sortOrder: 'asc' } },
    });
  }

  async addMember(data: {
    boardTermId: string;
    personId: string;
    boardRoleId: string;
    mahallaId?: string;
    startDate: string;
    endDate?: string;
  }) {
    // Check if person already has this role in this term
    const existing = await this.prisma.boardMember.findFirst({
      where: {
        boardTermId: data.boardTermId,
        personId: data.personId,
        boardRoleId: data.boardRoleId,
      },
    });
    if (existing) {
      throw new BadRequestException('This person already has this role in this term');
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

  async updateMember(id: string, data: {
    boardRoleId?: string;
    mahallaId?: string;
    startDate?: string;
    endDate?: string;
  }) {
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

  async removeMember(id: string) {
    return this.prisma.boardMember.delete({ where: { id } });
  }
}

