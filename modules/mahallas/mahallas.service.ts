import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMahallaDto } from './dto/create-mahalla.dto';
import { UpdateMahallaDto } from './dto/update-mahalla.dto';

/**
 * MahallasService - Works with Person-based families
 * 
 * In the new schema:
 * - Family heads are identified by familyHeadId = null
 * - Family count = count of people with familyHeadId = null in that mahalla
 */
@Injectable()
export class MahallasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const mahallas = await this.prisma.mahalla.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            houses: true,
            mosques: true,
          },
        },
      },
      orderBy: { title: 'asc' },
    });

    // Get family counts and people counts for each mahalla
    // Family count = count of people with familyHeadId = null (they are family heads)
    const additionalCounts = await Promise.all(
      mahallas.map(async (m) => {
        const [familyCount, peopleCount] = await Promise.all([
          this.prisma.person.count({
            where: { 
              house: { mahallaId: m.id },
              familyHeadId: null, // Family heads have no familyHeadId
            },
          }),
          this.prisma.person.count({
            where: { house: { mahallaId: m.id } },
          }),
        ]);
        return { mahallaId: m.id, familyCount, peopleCount };
      })
    );

    // Add family count and people count to each mahalla
    return mahallas.map((m) => {
      const counts = additionalCounts.find((c) => c.mahallaId === m.id);
      return {
        ...m,
        _count: {
          ...m._count,
          families: counts?.familyCount || 0,
          people: counts?.peopleCount || 0,
        },
      };
    });
  }

  async findById(id: string) {
    const mahalla = await this.prisma.mahalla.findUnique({
      where: { id },
      include: {
        houses: {
          orderBy: { houseNumber: 'asc' },
        },
        mosques: true,
        _count: {
          select: {
            houses: true,
            mosques: true,
          },
        },
      },
    });

    if (!mahalla) {
      throw new NotFoundException('Mahalla not found');
    }

    return mahalla;
  }

  async create(createMahallaDto: CreateMahallaDto, createdBy?: string) {
    return this.prisma.mahalla.create({
      data: {
        ...createMahallaDto,
        createdBy,
      },
    });
  }

  async update(id: string, updateMahallaDto: UpdateMahallaDto) {
    const mahalla = await this.prisma.mahalla.findUnique({
      where: { id },
    });

    if (!mahalla) {
      throw new NotFoundException('Mahalla not found');
    }

    return this.prisma.mahalla.update({
      where: { id },
      data: updateMahallaDto,
    });
  }

  async delete(id: string) {
    // Check if mahalla has houses
    const housesCount = await this.prisma.house.count({
      where: { mahallaId: id },
    });

    if (housesCount > 0) {
      throw new BadRequestException(
        'Cannot delete mahalla with existing houses. Remove houses first.',
      );
    }

    await this.prisma.mahalla.delete({
      where: { id },
    });

    return { message: 'Mahalla deleted successfully' };
  }

  async getStats(id: string) {
    const [
      totalHouses,
      totalPeople,
      activeMembers,
      totalMosques,
      maleCount,
      femaleCount,
      totalFamilies,
    ] = await Promise.all([
      this.prisma.house.count({
        where: { mahallaId: id, isActive: true },
      }),
      this.prisma.person.count({
        where: { house: { mahallaId: id } },
      }),
      this.prisma.person.count({
        where: {
          house: { mahallaId: id },
          memberStatusId: 1, // Active
        },
      }),
      this.prisma.mosque.count({
        where: { mahallaId: id, isActive: true },
      }),
      this.prisma.person.count({
        where: {
          house: { mahallaId: id },
          gender: 'male',
        },
      }),
      this.prisma.person.count({
        where: {
          house: { mahallaId: id },
          gender: 'female',
        },
      }),
      // Family count = count of family heads in this mahalla
      this.prisma.person.count({
        where: {
          house: { mahallaId: id },
          familyHeadId: null, // They are family heads
        },
      }),
    ]);

    return {
      totalHouses,
      totalPeople,
      activeMembers,
      totalMosques,
      maleCount,
      femaleCount,
      totalFamilies,
    };
  }

  async getFamilies(id: string) {
    // Get all family heads in this mahalla with their members
    const familyHeads = await this.prisma.person.findMany({
      where: {
        house: { mahallaId: id },
        familyHeadId: null, // They are family heads
      },
      include: {
        house: {
          select: {
            id: true,
            houseNumber: true,
          },
        },
        memberStatus: true,
        familyMembers: {
          select: {
            id: true,
            fullName: true,
            gender: true,
            relationshipType: true,
            memberStatus: true,
          },
        },
        _count: {
          select: {
            familyMembers: true,
          },
        },
      },
      orderBy: [
        { house: { houseNumber: 'asc' } },
        { fullName: 'asc' },
      ],
    });

    // Transform to match expected format
    return familyHeads.map(head => ({
      id: head.id, // Family ID is the head's ID
      name: `${head.fullName} Family`,
      familyHead: {
        id: head.id,
        fullName: head.fullName,
        phone: head.phone,
        nic: head.nic,
        gender: head.gender,
        memberStatus: head.memberStatus,
      },
      house: head.house,
      members: head.familyMembers,
      _count: {
        members: head._count.familyMembers + 1, // Include the head
      },
      isSandaaEligible: head.isSandaaEligible,
      sandaaExemptReason: head.sandaaExemptReason,
    }));
  }
}
