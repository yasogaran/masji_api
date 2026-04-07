import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateFamilyDto, QueryFamiliesDto } from './dto/families.dto';

/**
 * FamiliesService - Works with Person-based families
 * 
 * In the new schema:
 * - A "family" is implicit: it's defined by the family head (Person with familyHeadId = null)
 * - Family heads have familyHeadId = null (they ARE the head, so they don't point to anyone)
 * - Family members have familyHeadId pointing to their family head
 * - isSandaaEligible and sandaaExemptReason are on the Person record (only relevant for family heads)
 */
@Injectable()
export class FamiliesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all families (family heads)
   * Returns the Person records that are family heads with their familyMembers
   */
  async findAll(query: QueryFamiliesDto) {
    const { page = 1, limit = 20, search, mahallaId, isSandaaEligible } = query;
    const skip = (page - 1) * limit;

    // Family heads are people with familyHeadId = null (they don't have a parent head)
    const where: any = {
      familyHeadId: null,
    };

    if (mahallaId) {
      where.house = { mahallaId };
    }

    if (isSandaaEligible !== undefined) {
      where.isSandaaEligible = isSandaaEligible;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { nic: { contains: search } },
        { familyName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [familyHeads, total] = await Promise.all([
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
          familyMembers: {
            select: {
              id: true,
              fullName: true,
              gender: true,
              phone: true,
              relationshipType: true,
              memberStatus: true,
            },
          },
          relationshipType: true,
        },
        orderBy: [
          { house: { mahalla: { title: 'asc' } } },
          { house: { houseNumber: 'asc' } },
          { fullName: 'asc' },
        ],
      }),
      this.prisma.person.count({ where }),
    ]);

    return {
      data: familyHeads,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single family by family head's ID
   * Returns the Person record that is the family head with their familyMembers
   */
  async findOne(id: string) {
    const familyHead = await this.prisma.person.findUnique({
      where: { id },
      include: {
        house: {
          include: {
            mahalla: true,
          },
        },
        memberStatus: true,
        civilStatus: true,
        educationLevel: true,
        occupation: true,
        relationshipType: true,
        familyMembers: {
          include: {
            memberStatus: true,
            civilStatus: true,
            relationshipType: true,
          },
          orderBy: [
            { relationshipTypeId: 'asc' },
            { dob: 'asc' },
          ],
        },
      },
    });

    if (!familyHead) {
      throw new NotFoundException('Family not found');
    }

    // Verify this person is actually a family head (has no parent family head)
    if (familyHead.familyHeadId !== null) {
      throw new NotFoundException('This person is not a family head');
    }

    // Get Sandaa payment history if eligible
    let sandaaHistory = [];
    if (familyHead.isSandaaEligible) {
      sandaaHistory = await this.prisma.sandaaPayment.findMany({
        where: { personId: id },
        orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
        take: 12,
      });
    }

    return {
      ...familyHead,
      sandaaHistory,
    };
  }

  /**
   * Get summary statistics for families
   */
  async getSummary(mahallaId?: string) {
    const baseWhere: any = {
      familyHeadId: null, // Family heads have no parent head
    };

    if (mahallaId) {
      baseWhere.house = { mahallaId };
    }

    const [totalFamilies, eligibleFamilies, nonEligibleFamilies] = await Promise.all([
      this.prisma.person.count({ where: baseWhere }),
      this.prisma.person.count({ where: { ...baseWhere, isSandaaEligible: true } }),
      this.prisma.person.count({ where: { ...baseWhere, isSandaaEligible: false } }),
    ]);

    // Get mahalla-wise breakdown
    const mahallas = await this.prisma.mahalla.findMany({
      where: { isActive: true },
    });

    const mahallaStats = await Promise.all(
      mahallas.map(async (m) => {
        const mahallaWhere: any = {
          familyHeadId: null, // Family heads have no parent head
          house: { mahallaId: m.id },
        };

        const [total, eligible, nonEligible] = await Promise.all([
          this.prisma.person.count({ where: mahallaWhere }),
          this.prisma.person.count({ where: { ...mahallaWhere, isSandaaEligible: true } }),
          this.prisma.person.count({ where: { ...mahallaWhere, isSandaaEligible: false } }),
        ]);

        return {
          mahallaId: m.id,
          mahallaTitle: m.title,
          totalFamilies: total,
          eligibleFamilies: eligible,
          nonEligibleFamilies: nonEligible,
        };
      })
    );

    return {
      totalFamilies,
      eligibleFamilies,
      nonEligibleFamilies,
      byMahalla: mahallaStats,
    };
  }

  /**
   * Update a family (updates the family head's record)
   */
  async update(id: string, dto: UpdateFamilyDto) {
    const familyHead = await this.prisma.person.findUnique({ where: { id } });
    if (!familyHead) {
      throw new NotFoundException('Family not found');
    }

    if (familyHead.familyHeadId !== null) {
      throw new NotFoundException('This person is not a family head');
    }

    return this.prisma.person.update({
      where: { id },
      data: {
        familyName: dto.familyName,
        isSandaaEligible: dto.isSandaaEligible,
        sandaaExemptReason: dto.isSandaaEligible ? null : dto.sandaaExemptReason,
      },
      include: {
        house: {
          include: { mahalla: true },
        },
        familyMembers: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
  }

  /**
   * Update Sandaa eligibility for a family
   */
  async updateEligibility(id: string, isSandaaEligible: boolean, sandaaExemptReason?: string) {
    const familyHead = await this.prisma.person.findUnique({ where: { id } });
    if (!familyHead) {
      throw new NotFoundException('Family not found');
    }

    if (familyHead.familyHeadId !== null) {
      throw new NotFoundException('This person is not a family head');
    }

    return this.prisma.person.update({
      where: { id },
      data: {
        isSandaaEligible,
        sandaaExemptReason: isSandaaEligible ? null : sandaaExemptReason,
      },
      include: {
        house: {
          include: { mahalla: true },
        },
        familyMembers: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
  }

  /**
   * Delete is not applicable in the new model since families are implicit
   * To "delete" a family, you would need to reassign all members to a different head
   * This operation is complex and should be handled carefully
   */
  async delete(id: string) {
    const familyHead = await this.prisma.person.findUnique({
      where: { id },
      include: {
        familyMembers: true,
      },
    });

    if (!familyHead) {
      throw new NotFoundException('Family not found');
    }

    if (familyHead.familyHeadId !== null) {
      throw new NotFoundException('This person is not a family head');
    }

    // Check if there are family members
    if (familyHead.familyMembers.length > 0) {
      // Remove family head reference from all members
      await this.prisma.person.updateMany({
        where: { familyHeadId: id },
        data: { familyHeadId: null },
      });
    }

    // Note: We don't delete the person, we just remove the family structure
    // If you want to delete the person entirely, use the People service

    return { message: 'Family dissolved. Members are now independent.' };
  }
}
