import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateMeetingDto,
  UpdateMeetingDto,
  CreateDecisionDto,
  MeetingQueryDto,
} from './dto/meetings.dto';

@Injectable()
export class MeetingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: MeetingQueryDto) {
    const { search, fromDate, toDate, page = 1, limit = 20 } = query;
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { agenda: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (fromDate || toDate) {
      where.meetingDate = {};
      if (fromDate) where.meetingDate.gte = new Date(fromDate);
      if (toDate) where.meetingDate.lte = new Date(toDate);
    }

    const [meetings, total] = await Promise.all([
      this.prisma.meeting.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          decisions: {
            include: {
              relatedIssue: {
                select: { id: true, title: true, status: true },
              },
            },
          },
          _count: {
            select: { decisions: true },
          },
        },
        orderBy: { meetingDate: 'desc' },
      }),
      this.prisma.meeting.count({ where }),
    ]);

    return {
      data: meetings,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: {
        decisions: {
          include: {
            relatedIssue: {
              select: { id: true, title: true, status: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    return meeting;
  }

  async create(dto: CreateMeetingDto, createdBy?: string) {
    const data: any = {
      title: dto.title,
      meetingDate: new Date(dto.meetingDate),
      location: dto.location,
      attendees: dto.attendees,
      agenda: dto.agenda,
      minutes: dto.minutes,
      createdBy,
    };

    // Handle meeting time if provided
    if (dto.meetingTime) {
      // Convert HH:mm to a Date object (using a fixed date since we only care about time)
      const [hours, minutes] = dto.meetingTime.split(':').map(Number);
      const timeDate = new Date();
      timeDate.setHours(hours, minutes, 0, 0);
      data.meetingTime = timeDate;
    }

    return this.prisma.meeting.create({
      data,
      include: {
        decisions: true,
      },
    });
  }

  async update(id: string, dto: UpdateMeetingDto) {
    await this.findById(id);

    const data: any = { ...dto };

    if (dto.meetingDate) {
      data.meetingDate = new Date(dto.meetingDate);
    }

    if (dto.meetingTime) {
      const [hours, minutes] = dto.meetingTime.split(':').map(Number);
      const timeDate = new Date();
      timeDate.setHours(hours, minutes, 0, 0);
      data.meetingTime = timeDate;
    }

    return this.prisma.meeting.update({
      where: { id },
      data,
      include: {
        decisions: {
          include: {
            relatedIssue: {
              select: { id: true, title: true, status: true },
            },
          },
        },
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);

    // Delete related decisions first
    await this.prisma.meetingDecision.deleteMany({
      where: { meetingId: id },
    });

    return this.prisma.meeting.delete({
      where: { id },
    });
  }

  // ==================== Decisions ====================
  async addDecision(meetingId: string, dto: CreateDecisionDto) {
    await this.findById(meetingId);

    // Validate related issue if provided
    if (dto.relatedIssueId) {
      const issue = await this.prisma.issue.findUnique({
        where: { id: dto.relatedIssueId },
      });
      if (!issue) {
        throw new BadRequestException('Related issue not found');
      }
    }

    return this.prisma.meetingDecision.create({
      data: {
        meetingId,
        decision: dto.decision,
        relatedIssueId: dto.relatedIssueId,
      },
      include: {
        relatedIssue: {
          select: { id: true, title: true, status: true },
        },
        meeting: {
          select: { id: true, title: true, meetingDate: true },
        },
      },
    });
  }

  async removeDecision(decisionId: string) {
    const decision = await this.prisma.meetingDecision.findUnique({
      where: { id: decisionId },
    });

    if (!decision) {
      throw new NotFoundException('Decision not found');
    }

    return this.prisma.meetingDecision.delete({
      where: { id: decisionId },
    });
  }

  async updateDecision(decisionId: string, dto: CreateDecisionDto) {
    const decision = await this.prisma.meetingDecision.findUnique({
      where: { id: decisionId },
    });

    if (!decision) {
      throw new NotFoundException('Decision not found');
    }

    return this.prisma.meetingDecision.update({
      where: { id: decisionId },
      data: {
        decision: dto.decision,
        relatedIssueId: dto.relatedIssueId,
      },
      include: {
        relatedIssue: {
          select: { id: true, title: true, status: true },
        },
      },
    });
  }

  // ==================== Summary ====================
  async getSummary() {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalMeetings, recentMeetings, upcomingMeetings, totalDecisions] = await Promise.all([
      this.prisma.meeting.count(),
      this.prisma.meeting.count({
        where: {
          meetingDate: { gte: thirtyDaysAgo, lte: now },
        },
      }),
      this.prisma.meeting.findMany({
        where: {
          meetingDate: { gt: now },
        },
        orderBy: { meetingDate: 'asc' },
        take: 5,
      }),
      this.prisma.meetingDecision.count(),
    ]);

    // Get recent meetings with details
    const latestMeetings = await this.prisma.meeting.findMany({
      include: {
        _count: {
          select: { decisions: true },
        },
      },
      orderBy: { meetingDate: 'desc' },
      take: 5,
    });

    return {
      totalMeetings,
      recentMeetings,
      upcomingMeetings,
      totalDecisions,
      latestMeetings,
    };
  }

  // ==================== Calendar View ====================
  async getCalendarMeetings(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.prisma.meeting.findMany({
      where: {
        meetingDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        _count: {
          select: { decisions: true },
        },
      },
      orderBy: { meetingDate: 'asc' },
    });
  }
}
