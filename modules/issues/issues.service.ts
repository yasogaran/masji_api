import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateIssueDto,
  UpdateIssueDto,
  ResolveIssueDto,
  IssueQueryDto,
} from './dto/issues.dto';

@Injectable()
export class IssuesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: IssueQueryDto) {
    const { status, search, page = 1, limit = 20 } = query;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [issues, total] = await Promise.all([
      this.prisma.issue.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          raisedByPerson: {
            select: { id: true, fullName: true, phone: true },
          },
          meetingDecisions: {
            include: {
              meeting: {
                select: { id: true, title: true, meetingDate: true },
              },
            },
          },
        },
        orderBy: { raisedDate: 'desc' },
      }),
      this.prisma.issue.count({ where }),
    ]);

    return {
      data: issues,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const issue = await this.prisma.issue.findUnique({
      where: { id },
      include: {
        raisedByPerson: {
          select: { id: true, fullName: true, phone: true },
        },
        meetingDecisions: {
          include: {
            meeting: {
              select: { id: true, title: true, meetingDate: true },
            },
          },
        },
      },
    });

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    return issue;
  }

  async create(dto: CreateIssueDto) {
    // Validate person if provided
    if (dto.raisedBy) {
      const person = await this.prisma.person.findUnique({
        where: { id: dto.raisedBy },
      });
      if (!person) {
        throw new BadRequestException('Person not found');
      }
    }

    return this.prisma.issue.create({
      data: {
        title: dto.title,
        description: dto.description,
        raisedBy: dto.raisedBy,
        raisedDate: new Date(dto.raisedDate),
        status: dto.status || 'open',
      },
      include: {
        raisedByPerson: {
          select: { id: true, fullName: true, phone: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdateIssueDto) {
    await this.findById(id);

    return this.prisma.issue.update({
      where: { id },
      data: dto,
      include: {
        raisedByPerson: {
          select: { id: true, fullName: true, phone: true },
        },
      },
    });
  }

  async resolve(id: string, dto: ResolveIssueDto) {
    const issue = await this.findById(id);

    if (issue.status === 'resolved' || issue.status === 'closed') {
      throw new BadRequestException('Issue is already resolved or closed');
    }

    return this.prisma.issue.update({
      where: { id },
      data: {
        status: 'resolved',
        resolution: dto.resolution,
        resolvedDate: new Date(dto.resolvedDate),
      },
      include: {
        raisedByPerson: {
          select: { id: true, fullName: true, phone: true },
        },
      },
    });
  }

  async reopen(id: string) {
    const issue = await this.findById(id);

    if (issue.status === 'open' || issue.status === 'in_progress') {
      throw new BadRequestException('Issue is already open');
    }

    return this.prisma.issue.update({
      where: { id },
      data: {
        status: 'open',
        resolution: null,
        resolvedDate: null,
      },
      include: {
        raisedByPerson: {
          select: { id: true, fullName: true, phone: true },
        },
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);

    // Delete related meeting decisions first
    await this.prisma.meetingDecision.deleteMany({
      where: { relatedIssueId: id },
    });

    return this.prisma.issue.delete({
      where: { id },
    });
  }

  async getSummary() {
    const [open, inProgress, resolved, closed, recentIssues] = await Promise.all([
      this.prisma.issue.count({ where: { status: 'open' } }),
      this.prisma.issue.count({ where: { status: 'in_progress' } }),
      this.prisma.issue.count({ where: { status: 'resolved' } }),
      this.prisma.issue.count({ where: { status: 'closed' } }),
      this.prisma.issue.findMany({
        where: { status: { in: ['open', 'in_progress'] } },
        include: {
          raisedByPerson: {
            select: { id: true, fullName: true },
          },
        },
        orderBy: { raisedDate: 'desc' },
        take: 5,
      }),
    ]);

    return {
      open,
      inProgress,
      resolved,
      closed,
      total: open + inProgress + resolved + closed,
      recentIssues,
    };
  }
}
