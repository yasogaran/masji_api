import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';

@Injectable()
export class HousesService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    mahallaId?: string;
    search?: string;
  }) {
    const { page = 1, limit = 20, mahallaId, search } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (mahallaId) {
      where.mahallaId = mahallaId;
    }

    if (search) {
      where.OR = [
        { houseNumber: { equals: parseInt(search) || -1 } },
        { addressLine1: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [houses, total] = await Promise.all([
      this.prisma.house.findMany({
        where,
        skip,
        take: limit,
        include: {
          mahalla: true,
          _count: {
            select: {
              people: true,
            },
          },
        },
        orderBy: [
          { mahalla: { title: 'asc' } },
          { houseNumber: 'asc' },
        ],
      }),
      this.prisma.house.count({ where }),
    ]);

    // Count family heads per house for family count
    // Family heads are identified by familyHeadId = null (they don't have a parent head)
    const housesWithFamilyCount = await Promise.all(
      houses.map(async (house) => {
        const familyCount = await this.prisma.person.count({
          where: {
            houseId: house.id,
            familyHeadId: null, // Family heads have no parent head
          },
        });
        return {
          ...house,
          _count: {
            ...house._count,
            families: familyCount,
          },
        };
      })
    );

    return {
      data: housesWithFamilyCount,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const house = await this.prisma.house.findUnique({
      where: { id },
      include: {
        mahalla: true,
        people: {
          include: {
            familyHead: {
              select: {
                id: true,
                fullName: true,
              },
            },
            relationshipType: true,
          },
          orderBy: [
            { familyHeadId: 'asc' }, // Family heads (null) first
            { fullName: 'asc' },
          ],
        },
      },
    });

    if (!house) {
      throw new NotFoundException('House not found');
    }

    // Get family heads for this house (people with familyHeadId = null)
    const familyHeads = house.people.filter(p => p.familyHeadId === null);

    return {
      ...house,
      familyHeads,
    };
  }

  async create(createHouseDto: CreateHouseDto, createdBy?: string) {
    const { mahallaId, ...rest } = createHouseDto;

    // Get next house number for this mahalla
    const lastHouse = await this.prisma.house.findFirst({
      where: { mahallaId },
      orderBy: { houseNumber: 'desc' },
    });

    const houseNumber = (lastHouse?.houseNumber || 0) + 1;

    return this.prisma.house.create({
      data: {
        ...rest,
        mahallaId,
        houseNumber,
        createdBy,
      },
      include: {
        mahalla: true,
      },
    });
  }

  async update(id: string, updateHouseDto: UpdateHouseDto) {
    const house = await this.prisma.house.findUnique({
      where: { id },
    });

    if (!house) {
      throw new NotFoundException('House not found');
    }

    return this.prisma.house.update({
      where: { id },
      data: updateHouseDto,
      include: {
        mahalla: true,
      },
    });
  }

  async delete(id: string) {
    // Check if house has people
    const peopleCount = await this.prisma.person.count({
      where: { houseId: id },
    });

    if (peopleCount > 0) {
      throw new BadRequestException(
        'Cannot delete house with registered people. Remove people first.',
      );
    }

    await this.prisma.house.delete({
      where: { id },
    });

    return { message: 'House deleted successfully' };
  }

  async getHouseMembers(id: string) {
    const house = await this.prisma.house.findUnique({
      where: { id },
      include: {
        people: {
          include: {
            relationshipType: true,
            memberStatus: true,
            familyHead: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
          orderBy: [
            { familyHeadId: 'asc' }, // Family heads (null) first
            { fullName: 'asc' },
          ],
        },
      },
    });

    if (!house) {
      throw new NotFoundException('House not found');
    }

    // Get family heads in this house (people with familyHeadId = null)
    const familyHeads = house.people.filter(p => p.familyHeadId === null);

    // Group people by their family head
    const families = familyHeads.map(head => {
      // Get members who belong to this family head (excluding the head)
      const members = house.people.filter(
        p => p.familyHeadId === head.id && p.id !== head.id
      );
      
      return {
        id: head.id, // Use family head's ID as family ID
        name: (head as any).familyName || `${head.fullName}'s Family`,
        familyHead: head,
        members,
        memberCount: members.length + 1, // +1 for family head
        isSandaaEligible: (head as any).isSandaaEligible ?? true,
        sandaaExemptReason: (head as any).sandaaExemptReason,
      };
    });

    // All people in the house (flat list)
    const allMembers = house.people;
    
    // Total count
    const totalMembers = allMembers.length;
    const totalFamilies = familyHeads.length;

    return {
      families,
      allMembers,
      totalMembers,
      totalFamilies,
    };
  }
}

