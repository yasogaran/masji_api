import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

/**
 * PeopleService - Works with Person-based families
 * 
 * In the new schema:
 * - Family heads have familyHeadId = null
 * - Family members have familyHeadId pointing to their family head
 * - isSandaaEligible and sandaaExemptReason are on the Person record
 */
@Injectable()
export class PeopleService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    mahallaId?: string;
    houseId?: string;
    status?: number;
  }) {
    const { page = 1, limit = 20, search, mahallaId, houseId, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { nic: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    if (houseId) {
      where.houseId = houseId;
    }

    if (mahallaId) {
      where.house = { mahallaId };
    }

    if (status) {
      where.memberStatusId = status;
    }

    const [people, total] = await Promise.all([
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
          memberStatus: true,
          civilStatus: true,
          relationshipType: true,
          familyHead: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
        orderBy: { fullName: 'asc' },
      }),
      this.prisma.person.count({ where }),
    ]);

    return {
      data: people,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const person = await this.prisma.person.findUnique({
      where: { id },
      include: {
        house: {
          include: {
            mahalla: true,
          },
        },
        familyHead: true,
        familyMembers: true,
        memberStatus: true,
        civilStatus: true,
        educationLevel: true,
        occupation: true,
        relationshipType: true,
      },
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    return person;
  }

  async findByNic(nic: string) {
    return this.prisma.person.findUnique({
      where: { nic },
      include: {
        house: {
          include: {
            mahalla: true,
          },
        },
      },
    });
  }

  async create(createPersonDto: CreatePersonDto, createdBy?: string) {
    // Check if NIC already exists
    if (createPersonDto.nic) {
      const existing = await this.prisma.person.findUnique({
        where: { nic: createPersonDto.nic },
      });
      if (existing) {
        throw new BadRequestException('NIC already registered');
      }
    }

    // Check if the house belongs to an "Out Jamath" mahalla
    let isOutJamathMahalla = false;
    if (createPersonDto.houseId) {
      const house = await this.prisma.house.findUnique({
        where: { id: createPersonDto.houseId },
        include: { mahalla: true },
      });
      if (house?.mahalla?.isOutJamath) {
        isOutJamathMahalla = true;
      }
    }

    // Convert dob string to Date object if provided
    const data: any = { ...createPersonDto, createdBy };
    if (data.dob && typeof data.dob === 'string') {
      data.dob = new Date(data.dob);
    }

    // Check if this person is being created as a Family Head
    const isFamilyHead = createPersonDto.relationshipTypeId === 1;

    // For "Out Jamath" mahalla: people don't need family heads, they exist independently
    if (isOutJamathMahalla) {
      data.familyHeadId = null; // No family head for Out Jamath members
      data.isSandaaEligible = false; // Out Jamath members are not eligible for Sandaa by default
    } else if (isFamilyHead) {
      // If Family Head, set familyHeadId to null and set default Sandaa eligibility
      data.familyHeadId = null; // Family heads have no family head reference
      data.isSandaaEligible = createPersonDto.isSandaaEligible ?? true; // Default to eligible
    }

    return this.prisma.person.create({
      data,
      include: {
        house: true,
        memberStatus: true,
        relationshipType: true,
        familyHead: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    const person = await this.prisma.person.findUnique({
      where: { id },
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    // Check NIC uniqueness if being updated
    const nic = (updatePersonDto as any).nic;
    if (nic && nic !== person.nic) {
      const existing = await this.prisma.person.findUnique({
        where: { nic },
      });
      if (existing) {
        throw new BadRequestException('NIC already registered');
      }
    }

    // Convert dob string to Date object if provided
    const data: any = { ...updatePersonDto };
    if (data.dob && typeof data.dob === 'string') {
      data.dob = new Date(data.dob);
    }

    return this.prisma.person.update({
      where: { id },
      data,
      include: {
        house: true,
        memberStatus: true,
        familyHead: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    // Check if person is a family head (has family members pointing to them)
    const familyMembers = await this.prisma.person.count({
      where: { familyHeadId: id },
    });

    if (familyMembers > 0) {
      throw new BadRequestException(
        'Cannot delete person who is a family head. Transfer family leadership first.',
      );
    }

    await this.prisma.person.delete({
      where: { id },
    });

    return { message: 'Person deleted successfully' };
  }

  async getFamilyHeads(mahallaId?: string) {
    const where: any = {
      familyHeadId: null, // People who are heads (have no familyHeadId)
    };

    if (mahallaId) {
      where.house = { mahallaId };
    }

    return this.prisma.person.findMany({
      where,
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
          },
        },
      },
      orderBy: { fullName: 'asc' },
    });
  }

  async getLookups() {
    const [
      memberStatuses,
      civilStatuses,
      educationLevels,
      occupations,
      relationshipTypes,
    ] = await Promise.all([
      this.prisma.memberStatus.findMany(),
      this.prisma.civilStatus.findMany(),
      this.prisma.educationLevel.findMany({ orderBy: { sortOrder: 'asc' } }),
      this.prisma.occupation.findMany({ orderBy: { title: 'asc' } }),
      this.prisma.relationshipType.findMany({ orderBy: { sortOrder: 'asc' } }),
    ]);

    return {
      memberStatuses,
      civilStatuses,
      educationLevels,
      occupations,
      relationshipTypes,
    };
  }
}
