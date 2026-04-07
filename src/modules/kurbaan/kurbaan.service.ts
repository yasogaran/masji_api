import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as QRCode from 'qrcode';
import {
  CreateKurbaanPeriodDto,
  UpdateKurbaanPeriodDto,
  CreateKurbaanParticipantDto,
  BulkCreateParticipantsDto,
  RegisterAllFamiliesDto,
  MarkDistributedDto,
  KurbaanParticipantQueryDto,
} from './dto/kurbaan.dto';

@Injectable()
export class KurbaanService {
  constructor(private prisma: PrismaService) {}

  // ==================
  // PERIOD MANAGEMENT
  // ==================

  async getPeriods(query?: { isActive?: boolean; page?: number; limit?: number }) {
    const page = query?.page || 1;
    const limit = query?.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query?.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const [data, total] = await Promise.all([
      this.prisma.kurbaanPeriod.findMany({
        where,
        orderBy: { hijriYear: 'desc' },
        skip,
        take: limit,
        include: {
          _count: {
            select: { participants: true },
          },
        },
      }),
      this.prisma.kurbaanPeriod.count({ where }),
    ]);

    // Add distribution stats to each period
    const periodsWithStats = await Promise.all(
      data.map(async (period) => {
        const stats = await this.prisma.kurbaanParticipant.groupBy({
          by: ['isDistributed'],
          where: { kurbaanPeriodId: period.id },
          _count: true,
        });

        const distributed = stats.find((s) => s.isDistributed)?._count || 0;
        const pending = stats.find((s) => !s.isDistributed)?._count || 0;

        return {
          ...period,
          stats: {
            totalParticipants: period._count.participants,
            distributed,
            pending,
          },
        };
      }),
    );

    return {
      data: periodsWithStats,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getActivePeriod() {
    return this.prisma.kurbaanPeriod.findFirst({
      where: { isActive: true },
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });
  }

  async getPeriodById(id: string) {
    const period = await this.prisma.kurbaanPeriod.findUnique({
      where: { id },
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });

    if (!period) {
      throw new NotFoundException('Kurbaan period not found');
    }

    // Get distribution stats
    const stats = await this.prisma.kurbaanParticipant.groupBy({
      by: ['isDistributed'],
      where: { kurbaanPeriodId: id },
      _count: true,
    });

    const distributed = stats.find((s) => s.isDistributed)?._count || 0;
    const pending = stats.find((s) => !s.isDistributed)?._count || 0;

    return {
      ...period,
      stats: {
        totalParticipants: period._count.participants,
        distributed,
        pending,
      },
    };
  }

  async createPeriod(dto: CreateKurbaanPeriodDto, userId?: string) {
    // Deactivate any existing active period
    await this.prisma.kurbaanPeriod.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    return this.prisma.kurbaanPeriod.create({
      data: {
        name: dto.name,
        hijriYear: dto.hijriYear,
        gregorianDate: dto.gregorianDate ? new Date(dto.gregorianDate) : null,
        isActive: true,
        createdBy: userId,
      },
    });
  }

  async updatePeriod(id: string, dto: UpdateKurbaanPeriodDto) {
    const period = await this.prisma.kurbaanPeriod.findUnique({ where: { id } });
    if (!period) {
      throw new NotFoundException('Kurbaan period not found');
    }

    // If activating this period, deactivate others
    if (dto.isActive === true) {
      await this.prisma.kurbaanPeriod.updateMany({
        where: { id: { not: id }, isActive: true },
        data: { isActive: false },
      });
    }

    return this.prisma.kurbaanPeriod.update({
      where: { id },
      data: {
        name: dto.name,
        hijriYear: dto.hijriYear,
        gregorianDate: dto.gregorianDate ? new Date(dto.gregorianDate) : undefined,
        isActive: dto.isActive,
      },
    });
  }

  async completePeriod(id: string) {
    const period = await this.prisma.kurbaanPeriod.findUnique({ where: { id } });
    if (!period) {
      throw new NotFoundException('Kurbaan period not found');
    }

    return this.prisma.kurbaanPeriod.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async deletePeriod(id: string) {
    const period = await this.prisma.kurbaanPeriod.findUnique({
      where: { id },
      include: { _count: { select: { participants: true } } },
    });

    if (!period) {
      throw new NotFoundException('Kurbaan period not found');
    }

    if (period._count.participants > 0) {
      throw new BadRequestException(
        'Cannot delete period with participants. Delete participants first.',
      );
    }

    return this.prisma.kurbaanPeriod.delete({ where: { id } });
  }

  // ========================
  // PARTICIPANT MANAGEMENT
  // ========================

  private async generateQRCode(data: any): Promise<string> {
    try {
      const qrData = JSON.stringify(data);
      return await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 1,
        color: {
          dark: '#0d9488', // teal color
          light: '#ffffff',
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to generate QR code');
    }
  }

  async getParticipants(query: KurbaanParticipantQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.kurbaanPeriodId) {
      where.kurbaanPeriodId = query.kurbaanPeriodId;
    }

    if (query.isDistributed !== undefined) {
      where.isDistributed = query.isDistributed;
    }

    // Handle search for both external and registered families
    if (query.search) {
      where.OR = [
        { familyHead: { fullName: { contains: query.search, mode: 'insensitive' } } },
        { externalName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // Handle mahalla filter - 'external' shows only external families
    if (query.mahallaId === 'external') {
      where.isExternal = true;
    } else if (query.mahallaId) {
      where.isExternal = false;
      where.familyHead = {
        ...where.familyHead,
        house: {
          mahallaId: query.mahallaId,
        },
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.kurbaanParticipant.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          familyHead: {
            include: {
              house: {
                include: {
                  mahalla: true,
                },
              },
            },
          },
          kurbaanPeriod: true,
          distributedByUser: {
            select: { id: true, fullName: true },
          },
        },
      }),
      this.prisma.kurbaanParticipant.count({ where }),
    ]);

    // Get member counts for each family
    const participantsWithMemberCount = await Promise.all(
      data.map(async (participant) => {
        // For external families, use external people count
        if (participant.isExternal) {
          return {
            ...participant,
            familyCount: 1,
            memberCount: participant.externalPeopleCount || 1,
          };
        }

        // For registered families, count family members from Person table
        if (!participant.familyHeadId) {
          return {
            ...participant,
            familyCount: 1,
            memberCount: 1,
          };
        }

        // Count family members (people who have this person as their familyHeadId) + 1 for head
        const memberCount = await this.prisma.person.count({
          where: { familyHeadId: participant.familyHeadId },
        });

        return {
          ...participant,
          familyCount: 1,
          memberCount: memberCount + 1, // +1 for the family head
        };
      }),
    );

    return {
      data: participantsWithMemberCount,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getParticipantById(id: string) {
    const participant = await this.prisma.kurbaanParticipant.findUnique({
      where: { id },
      include: {
        familyHead: {
          include: {
            house: {
              include: {
                mahalla: true,
              },
            },
          },
        },
        kurbaanPeriod: true,
        distributedByUser: {
          select: { id: true, fullName: true },
        },
      },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    return participant;
  }

  async createParticipant(dto: CreateKurbaanParticipantDto, userId?: string) {
    // Check if period exists and is active
    const period = await this.prisma.kurbaanPeriod.findUnique({
      where: { id: dto.kurbaanPeriodId },
    });

    if (!period) {
      throw new NotFoundException('Kurbaan period not found');
    }

    // Handle external family
    if (dto.isExternal) {
      if (!dto.externalName) {
        throw new BadRequestException('External family name is required');
      }

      // Generate QR code for external family
      const qrData = {
        type: 'KURBAAN',
        periodId: dto.kurbaanPeriodId,
        periodName: period.name,
        isExternal: true,
        externalName: dto.externalName,
        externalPhone: dto.externalPhone,
        externalPeopleCount: dto.externalPeopleCount,
        timestamp: new Date().toISOString(),
      };

      const qrCode = await this.generateQRCode(qrData);

      return this.prisma.kurbaanParticipant.create({
        data: {
          kurbaanPeriodId: dto.kurbaanPeriodId,
          isExternal: true,
          externalName: dto.externalName,
          externalPhone: dto.externalPhone,
          externalAddress: dto.externalAddress,
          externalPeopleCount: dto.externalPeopleCount,
          qrCode,
        },
        include: {
          kurbaanPeriod: true,
        },
      });
    }

    // Handle registered family
    if (!dto.familyHeadId) {
      throw new BadRequestException('Family head ID is required for registered families');
    }

    // Check if family head exists
    const familyHead = await this.prisma.person.findUnique({
      where: { id: dto.familyHeadId },
      include: {
        house: {
          include: { mahalla: true },
        },
      },
    });

    if (!familyHead) {
      throw new NotFoundException('Family head not found');
    }

    // Check if already registered
    const existing = await this.prisma.kurbaanParticipant.findFirst({
      where: {
        kurbaanPeriodId: dto.kurbaanPeriodId,
        familyHeadId: dto.familyHeadId,
      },
    });

    if (existing) {
      throw new BadRequestException('Family is already registered for this period');
    }

    // Generate QR code with participant info
    const qrData = {
      type: 'KURBAAN',
      periodId: dto.kurbaanPeriodId,
      periodName: period.name,
      familyHeadId: dto.familyHeadId,
      familyHeadName: familyHead.fullName,
      houseNo: familyHead.house?.houseNumber,
      mahalla: familyHead.house?.mahalla?.title,
      timestamp: new Date().toISOString(),
    };

    const qrCode = await this.generateQRCode(qrData);

    return this.prisma.kurbaanParticipant.create({
      data: {
        kurbaanPeriodId: dto.kurbaanPeriodId,
        familyHeadId: dto.familyHeadId,
        isExternal: false,
        qrCode,
      },
      include: {
        familyHead: {
          include: {
            house: {
              include: { mahalla: true },
            },
          },
        },
        kurbaanPeriod: true,
      },
    });
  }

  async bulkCreateParticipants(dto: BulkCreateParticipantsDto, userId?: string) {
    const period = await this.prisma.kurbaanPeriod.findUnique({
      where: { id: dto.kurbaanPeriodId },
    });

    if (!period) {
      throw new NotFoundException('Kurbaan period not found');
    }

    const results = {
      created: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const familyHeadId of dto.familyHeadIds) {
      try {
        // Check if already registered
        const existing = await this.prisma.kurbaanParticipant.findFirst({
          where: {
            kurbaanPeriodId: dto.kurbaanPeriodId,
            familyHeadId,
          },
        });

        if (existing) {
          results.skipped++;
          continue;
        }

        const familyHead = await this.prisma.person.findUnique({
          where: { id: familyHeadId },
          include: {
            house: {
              include: { mahalla: true },
            },
          },
        });

        if (!familyHead) {
          results.errors.push(`Family head ${familyHeadId} not found`);
          continue;
        }

        const qrData = {
          type: 'KURBAAN',
          periodId: dto.kurbaanPeriodId,
          periodName: period.name,
          familyHeadId,
          familyHeadName: familyHead.fullName,
          houseNo: familyHead.house?.houseNumber,
          mahalla: familyHead.house?.mahalla?.title,
          timestamp: new Date().toISOString(),
        };

        const qrCode = await this.generateQRCode(qrData);

        await this.prisma.kurbaanParticipant.create({
          data: {
            kurbaanPeriodId: dto.kurbaanPeriodId,
            familyHeadId,
            qrCode,
          },
        });

        results.created++;
      } catch (error) {
        results.errors.push(`Error for ${familyHeadId}: ${error.message}`);
      }
    }

    return results;
  }

  async registerAllFamilies(dto: RegisterAllFamiliesDto, userId?: string) {
    const period = await this.prisma.kurbaanPeriod.findUnique({
      where: { id: dto.kurbaanPeriodId },
    });

    if (!period) {
      throw new NotFoundException('Kurbaan period not found');
    }

    // Get all family heads (people with familyHeadId = null) from Person table
    const familyHeads = await this.prisma.person.findMany({
      where: {
        familyHeadId: null, // Family heads have no family head reference
        ...(dto.mahallaId ? { house: { mahallaId: dto.mahallaId } } : {}),
      },
      select: { id: true },
    });

    const familyHeadIds: string[] = familyHeads.map(fh => fh.id);

    return this.bulkCreateParticipants(
      {
        kurbaanPeriodId: dto.kurbaanPeriodId,
        familyHeadIds,
      },
      userId,
    );
  }

  async markDistributed(id: string, dto: MarkDistributedDto, userId?: string) {
    const participant = await this.prisma.kurbaanParticipant.findUnique({
      where: { id },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    if (participant.isDistributed) {
      throw new BadRequestException('Already marked as distributed');
    }

    return this.prisma.kurbaanParticipant.update({
      where: { id },
      data: {
        isDistributed: true,
        distributedAt: new Date(),
        distributedBy: userId,
      },
      include: {
        familyHead: {
          include: {
            house: {
              include: { mahalla: true },
            },
          },
        },
        kurbaanPeriod: true,
      },
    });
  }

  async markDistributedByQR(qrCode: string, userId?: string) {
    // The QR code contains JSON data, but we search by matching the qrCode field
    // In real implementation, you'd decode the QR and find by periodId + familyHeadId
    const participant = await this.prisma.kurbaanParticipant.findFirst({
      where: { qrCode },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    return this.markDistributed(participant.id, {}, userId);
  }

  async deleteParticipant(id: string) {
    const participant = await this.prisma.kurbaanParticipant.findUnique({
      where: { id },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    return this.prisma.kurbaanParticipant.delete({ where: { id } });
  }

  // ===========
  // REPORTS
  // ===========

  async getPeriodReport(periodId: string) {
    const period = await this.prisma.kurbaanPeriod.findUnique({
      where: { id: periodId },
    });

    if (!period) {
      throw new NotFoundException('Kurbaan period not found');
    }

    // Get overall stats
    const participants = await this.prisma.kurbaanParticipant.findMany({
      where: { kurbaanPeriodId: periodId },
      include: {
        familyHead: {
          include: {
            house: {
              include: { mahalla: true },
            },
          },
        },
      },
    });

    const totalParticipants = participants.length;
    const distributed = participants.filter((p) => p.isDistributed).length;
    const pending = totalParticipants - distributed;

    // Separate external and registered
    const externalParticipants = participants.filter((p) => p.isExternal);
    const registeredParticipants = participants.filter((p) => !p.isExternal);

    const externalStats = {
      total: externalParticipants.length,
      distributed: externalParticipants.filter((p) => p.isDistributed).length,
      pending: externalParticipants.filter((p) => !p.isDistributed).length,
      totalPeople: externalParticipants.reduce((sum, p) => sum + (p.externalPeopleCount || 1), 0),
    };

    const registeredStats = {
      total: registeredParticipants.length,
      distributed: registeredParticipants.filter((p) => p.isDistributed).length,
      pending: registeredParticipants.filter((p) => !p.isDistributed).length,
    };

    // Group by mahalla (only for registered families)
    const byMahalla: Record<
      string,
      { mahallaId: string; mahallaName: string; total: number; distributed: number; pending: number }
    > = {};

    for (const p of registeredParticipants) {
      const mahallaId = p.familyHead?.house?.mahallaId || 'unknown';
      const mahallaName = p.familyHead?.house?.mahalla?.title || 'Unknown';

      if (!byMahalla[mahallaId]) {
        byMahalla[mahallaId] = {
          mahallaId,
          mahallaName,
          total: 0,
          distributed: 0,
          pending: 0,
        };
      }

      byMahalla[mahallaId].total++;
      if (p.isDistributed) {
        byMahalla[mahallaId].distributed++;
      } else {
        byMahalla[mahallaId].pending++;
      }
    }

    return {
      period: {
        id: period.id,
        name: period.name,
        hijriYear: period.hijriYear,
        gregorianDate: period.gregorianDate,
        isActive: period.isActive,
      },
      summary: {
        totalParticipants,
        distributed,
        pending,
        distributionPercentage:
          totalParticipants > 0 ? Math.round((distributed / totalParticipants) * 100) : 0,
      },
      registered: registeredStats,
      external: externalStats,
      byMahalla: Object.values(byMahalla).sort((a, b) => b.total - a.total),
    };
  }

  // Get participants for PDF card generation
  async getParticipantsForCards(
    periodId: string, 
    mahallaId?: string, 
    filterType?: string,
    page?: number,
    limit?: number,
  ) {
    const where: any = { kurbaanPeriodId: periodId };

    // Filter by mahalla or external
    if (filterType === 'external') {
      where.isExternal = true;
    } else if (mahallaId) {
      where.isExternal = false;
      where.familyHead = {
        house: { mahallaId },
      };
    }

    // Get total count
    const total = await this.prisma.kurbaanParticipant.count({ where });

    // Build query options
    const queryOptions: any = {
      where,
      include: {
        familyHead: {
          include: {
            house: {
              include: { mahalla: true },
            },
          },
        },
      },
      orderBy: [
        { isExternal: 'asc' }, // Registered families first
        { familyHead: { house: { mahalla: { title: 'asc' } } } },
        { familyHead: { house: { houseNumber: 'asc' } } },
        { externalName: 'asc' },
      ],
    };

    // Add pagination if specified
    if (page && limit) {
      queryOptions.skip = (page - 1) * limit;
      queryOptions.take = limit;
    }

    const participants = await this.prisma.kurbaanParticipant.findMany(queryOptions) as any[];

    // Get member counts
    const result = await Promise.all(
      participants.map(async (p: any) => {
        // Handle external families
        if (p.isExternal) {
          return {
            id: p.id,
            qrCode: p.qrCode,
            isDistributed: p.isDistributed,
            isExternal: true,
            familyHead: {
              id: null,
              name: p.externalName || 'External Family',
              phone: p.externalPhone,
            },
            house: {
              number: null,
              mahalla: 'External',
              address: p.externalAddress,
            },
            memberCount: p.externalPeopleCount || 1,
          };
        }

        // Handle registered families - count members from Person table
        let totalMembers = 1; // Start with 1 for family head
        if (p.familyHeadId) {
          const memberCount = await this.prisma.person.count({
            where: { familyHeadId: p.familyHeadId },
          });
          totalMembers = memberCount + 1; // +1 for family head
        }

        // Build address from address fields
        const house = p.familyHead?.house;
        const addressParts = [
          house?.addressLine1,
          house?.addressLine2,
          house?.addressLine3,
          house?.city,
        ].filter(Boolean);
        const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : undefined;

        return {
          id: p.id,
          qrCode: p.qrCode,
          isDistributed: p.isDistributed,
          isExternal: false,
          familyHead: {
            id: p.familyHead?.id,
            name: p.familyHead?.fullName || 'Unknown',
            phone: p.familyHead?.phone,
          },
          house: {
            number: house?.houseNumber,
            mahalla: house?.mahalla?.title,
            address: fullAddress,
          },
          memberCount: totalMembers,
        };
      }),
    );

    // If pagination is requested, return with meta
    if (page && limit) {
      return {
        data: result,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    // Otherwise return just the array for PDF generation
    return result;
  }
}
