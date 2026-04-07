import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePaymentTypeDto,
  UpdatePaymentTypeDto,
  CreateOtherPaymentDto,
  UpdateOtherPaymentDto,
  RecordOtherPaymentDto,
  OtherPaymentQueryDto,
} from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  // ============ PAYMENT TYPE METHODS ============

  async getPaymentTypes(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };
    
    return this.prisma.paymentType.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { payments: true },
        },
      },
    });
  }

  async getPaymentTypeById(id: string) {
    const paymentType = await this.prisma.paymentType.findUnique({
      where: { id },
      include: {
        _count: {
          select: { payments: true },
        },
      },
    });

    if (!paymentType) {
      throw new NotFoundException('Payment type not found');
    }

    return paymentType;
  }

  async createPaymentType(dto: CreatePaymentTypeDto) {
    // Check if name already exists
    const existing = await this.prisma.paymentType.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new BadRequestException('Payment type with this name already exists');
    }

    return this.prisma.paymentType.create({
      data: {
        name: dto.name,
        amount: dto.amount ?? 0, // Default to 0 (variable amount)
        description: dto.description,
        type: dto.type ?? 'incoming', // Default to incoming
        isActive: dto.isActive ?? true, // Default to true if not provided
      },
    });
  }

  async updatePaymentType(id: string, dto: UpdatePaymentTypeDto) {
    const paymentType = await this.prisma.paymentType.findUnique({
      where: { id },
    });

    if (!paymentType) {
      throw new NotFoundException('Payment type not found');
    }

    // Check if new name conflicts with existing
    if (dto.name && dto.name !== paymentType.name) {
      const existing = await this.prisma.paymentType.findUnique({
        where: { name: dto.name },
      });

      if (existing) {
        throw new BadRequestException('Payment type with this name already exists');
      }
    }

    return this.prisma.paymentType.update({
      where: { id },
      data: dto,
    });
  }

  async deletePaymentType(id: string) {
    const paymentType = await this.prisma.paymentType.findUnique({
      where: { id },
      include: {
        _count: {
          select: { payments: true },
        },
      },
    });

    if (!paymentType) {
      throw new NotFoundException('Payment type not found');
    }

    if (paymentType._count.payments > 0) {
      throw new BadRequestException(
        'Cannot delete payment type with existing payments. Deactivate it instead.',
      );
    }

    return this.prisma.paymentType.delete({
      where: { id },
    });
  }

  // ============ OTHER PAYMENT METHODS ============

  async getPayments(query: OtherPaymentQueryDto) {
    const { paymentTypeId, personId, status, search, year, month, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (paymentTypeId) {
      where.paymentTypeId = paymentTypeId;
    }

    if (personId) {
      where.personId = personId;
    }

    if (status) {
      where.status = status;
    }

    if (year && month) {
      // Filter by specific year and month
      const startDate = new Date(year, month - 1, 1); // First day of month
      const endDate = new Date(year, month, 1); // First day of next month
      where.createdAt = {
        gte: startDate,
        lt: endDate,
      };
    } else if (year) {
      const startDate = new Date(year, 0, 1); // January 1st
      const endDate = new Date(year + 1, 0, 1); // January 1st of next year
      where.createdAt = {
        gte: startDate,
        lt: endDate,
      };
    } else if (month) {
      // Filter by month in current year if only month is provided
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 1);
      where.createdAt = {
        gte: startDate,
        lt: endDate,
      };
    }

    if (search) {
      where.person = {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { nic: { contains: search } },
          { phone: { contains: search } },
        ],
      };
    }

    const [payments, total] = await Promise.all([
      this.prisma.otherPayment.findMany({
        where,
        skip,
        take: limit,
        include: {
          person: {
            include: {
              house: {
                include: { mahalla: true },
              },
            },
          },
          paymentType: true,
          receivedByUser: {
            select: { id: true, fullName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.otherPayment.count({ where }),
    ]);

    return {
      data: payments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPaymentById(id: string) {
    const payment = await this.prisma.otherPayment.findUnique({
      where: { id },
      include: {
        person: {
          include: {
            house: {
              include: { mahalla: true },
            },
          },
        },
        paymentType: true,
        receivedByUser: {
          select: { id: true, fullName: true },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async createPayment(dto: CreateOtherPaymentDto) {
    // Verify person exists
    const person = await this.prisma.person.findUnique({
      where: { id: dto.personId },
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    // Get payment type to use default amount if not provided
    const paymentType = await this.prisma.paymentType.findUnique({
      where: { id: dto.paymentTypeId },
    });

    if (!paymentType) {
      throw new NotFoundException('Payment type not found');
    }

    if (!paymentType.isActive) {
      throw new BadRequestException('Payment type is not active');
    }

    // If payment type has zero/variable amount, require explicit amount in the request
    const paymentTypeAmount = paymentType.amount.toNumber();
    if (paymentTypeAmount === 0 && (dto.amount === undefined || dto.amount === null)) {
      throw new BadRequestException(
        `Payment type "${paymentType.name}" has a variable amount. You must explicitly provide the amount when creating this payment.`
      );
    }

    const amount = dto.amount ?? paymentTypeAmount;
    const status = dto.status || 'pending';

    return this.prisma.otherPayment.create({
      data: {
        personId: dto.personId,
        paymentTypeId: dto.paymentTypeId,
        amount,
        reason: dto.reason,
        status,
        // Set paidAt if status is 'paid'
        paidAt: status === 'paid' ? new Date() : null,
      },
      include: {
        person: true,
        paymentType: true,
      },
    });
  }

  async updatePayment(id: string, dto: UpdateOtherPaymentDto) {
    const payment = await this.prisma.otherPayment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // If changing payment type, verify it exists and is active
    if (dto.paymentTypeId && dto.paymentTypeId !== payment.paymentTypeId) {
      const paymentType = await this.prisma.paymentType.findUnique({
        where: { id: dto.paymentTypeId },
      });

      if (!paymentType) {
        throw new NotFoundException('Payment type not found');
      }

      if (!paymentType.isActive) {
        throw new BadRequestException('Payment type is not active');
      }
    }

    // If changing person, verify they exist
    if (dto.personId && dto.personId !== payment.personId) {
      const person = await this.prisma.person.findUnique({
        where: { id: dto.personId },
      });

      if (!person) {
        throw new NotFoundException('Person not found');
      }
    }

    // Build update data
    const updateData: any = {};
    if (dto.personId !== undefined) updateData.personId = dto.personId;
    if (dto.paymentTypeId !== undefined) updateData.paymentTypeId = dto.paymentTypeId;
    if (dto.amount !== undefined) updateData.amount = dto.amount;
    if (dto.reason !== undefined) updateData.reason = dto.reason;
    if (dto.status !== undefined) {
      updateData.status = dto.status;
      // If status is changed to 'paid', set paidAt
      if (dto.status === 'paid' && payment.status !== 'paid') {
        updateData.paidAt = new Date();
      }
      // If status is changed from 'paid' to something else, clear paidAt
      if (dto.status !== 'paid' && payment.status === 'paid') {
        updateData.paidAt = null;
        updateData.receivedBy = null;
      }
    }

    return this.prisma.otherPayment.update({
      where: { id },
      data: updateData,
      include: {
        person: {
          include: {
            house: { include: { mahalla: true } },
          },
        },
        paymentType: true,
      },
    });
  }

  async recordPayment(dto: RecordOtherPaymentDto, receivedBy?: string) {
    const payment = await this.prisma.otherPayment.findUnique({
      where: { id: dto.paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === 'paid') {
      throw new BadRequestException('Payment is already recorded');
    }

    return this.prisma.otherPayment.update({
      where: { id: dto.paymentId },
      data: {
        status: 'paid',
        paidAt: new Date(),
        receivedBy,
      },
      include: {
        person: {
          include: {
            house: { include: { mahalla: true } },
          },
        },
        paymentType: true,
      },
    });
  }

  async cancelPayment(id: string) {
    const payment = await this.prisma.otherPayment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === 'paid') {
      throw new BadRequestException('Cannot cancel a paid payment');
    }

    return this.prisma.otherPayment.update({
      where: { id },
      data: { status: 'cancelled' },
      include: {
        person: true,
        paymentType: true,
      },
    });
  }

  async getPersonPayments(personId: string) {
    const person = await this.prisma.person.findUnique({
      where: { id: personId },
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    const payments = await this.prisma.otherPayment.findMany({
      where: { personId },
      include: {
        paymentType: true,
        receivedByUser: {
          select: { id: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      person,
      payments,
    };
  }

  // ============ SUMMARY ============

  async getPaymentSummary(params?: { paymentTypeId?: string; year?: number; month?: number }) {
    const { paymentTypeId, year, month } = params || {};
    const where: any = {};
    
    if (paymentTypeId) {
      where.paymentTypeId = paymentTypeId;
    }

    // Add date filters
    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      where.createdAt = { gte: startDate, lt: endDate };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year + 1, 0, 1);
      where.createdAt = { gte: startDate, lt: endDate };
    } else if (month) {
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 1);
      where.createdAt = { gte: startDate, lt: endDate };
    }

    const [pending, paid, cancelled, total, incomingPaid, outgoingPaid] = await Promise.all([
      this.prisma.otherPayment.aggregate({
        where: { ...where, status: 'pending' },
        _count: true,
        _sum: { amount: true },
      }),
      this.prisma.otherPayment.aggregate({
        where: { ...where, status: 'paid' },
        _count: true,
        _sum: { amount: true },
      }),
      this.prisma.otherPayment.count({ where: { ...where, status: 'cancelled' } }),
      this.prisma.otherPayment.aggregate({
        where,
        _count: true,
        _sum: { amount: true },
      }),
      // Incoming payments (income) - only paid ones
      this.prisma.otherPayment.aggregate({
        where: { 
          ...where, 
          status: 'paid',
          paymentType: { type: 'incoming' }
        },
        _count: true,
        _sum: { amount: true },
      }),
      // Outgoing payments (expense) - only paid ones
      this.prisma.otherPayment.aggregate({
        where: { 
          ...where, 
          status: 'paid',
          paymentType: { type: 'outgoing' }
        },
        _count: true,
        _sum: { amount: true },
      }),
    ]);

    return {
      pending: {
        count: pending._count,
        amount: pending._sum.amount?.toNumber() || 0,
      },
      paid: {
        count: paid._count,
        amount: paid._sum.amount?.toNumber() || 0,
      },
      cancelled,
      total: {
        count: total._count,
        amount: total._sum.amount?.toNumber() || 0,
      },
      income: {
        count: incomingPaid._count,
        amount: incomingPaid._sum.amount?.toNumber() || 0,
      },
      expense: {
        count: outgoingPaid._count,
        amount: outgoingPaid._sum.amount?.toNumber() || 0,
      },
    };
  }
}
