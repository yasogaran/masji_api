import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePropertyDto,
  UpdatePropertyDto,
  CreatePropertyRentalDto,
  UpdatePropertyRentalDto,
  CreateRentPaymentDto,
  PropertyQueryDto,
} from './dto/properties.dto';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  // Helper to get or create Property Rental Income category
  private async getPropertyRentalIncomeCategory() {
    let category = await this.prisma.incomeCategory.findFirst({
      where: { name: 'Property Rental' },
    });

    if (!category) {
      category = await this.prisma.incomeCategory.create({
        data: {
          name: 'Property Rental',
          description: 'Income from property rentals',
        },
      });
    }

    return category;
  }

  // Helper to generate receipt number
  private async generatePropertyRentalReceiptNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `PRO-${year}`;
    
    const lastReceipt = await this.prisma.income.findFirst({
      where: { receiptNumber: { startsWith: prefix } },
      orderBy: { receiptNumber: 'desc' },
    });

    let nextNumber = 1;
    if (lastReceipt?.receiptNumber) {
      const lastNumberStr = lastReceipt.receiptNumber.split('-').pop();
      if (lastNumberStr) {
        nextNumber = parseInt(lastNumberStr, 10) + 1;
      }
    }

    return `${prefix}-${String(nextNumber).padStart(5, '0')}`;
  }

  // ==================== Properties ====================
  async findAll(query?: PropertyQueryDto) {
    const where: any = {};

    if (!query?.includeInactive) {
      where.isActive = true;
    }

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { address: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query?.propertyType) {
      where.propertyType = query.propertyType;
    }

    const properties = await this.prisma.property.findMany({
      where,
      include: {
        rentals: {
          where: { isActive: true },
          include: {
            rentPayments: {
              orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
              take: 1,
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return properties.map(prop => {
      const activeRental = prop.rentals[0];
      return {
        ...prop,
        hasActiveRental: !!activeRental,
        currentTenant: activeRental?.tenantName || null,
        monthlyRent: activeRental?.monthlyRent || null,
      };
    });
  }

  async findById(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        rentals: {
          include: {
            rentPayments: {
              orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
            },
          },
          orderBy: { startDate: 'desc' },
        },
      },
    });

    if (!property) throw new NotFoundException('Property not found');

    return property;
  }

  async create(dto: CreatePropertyDto) {
    return this.prisma.property.create({
      data: {
        name: dto.name,
        address: dto.address,
        description: dto.description,
        propertyType: dto.propertyType,
      },
    });
  }

  async update(id: string, dto: UpdatePropertyDto) {
    await this.findById(id);
    return this.prisma.property.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    const property = await this.findById(id);

    // Check for active rentals
    const activeRentals = property.rentals.filter(r => r.isActive);
    if (activeRentals.length > 0) {
      throw new BadRequestException('Cannot delete property with active rentals');
    }

    return this.prisma.property.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ==================== Property Rentals ====================
  async getRentals(query?: { propertyId?: string; isActive?: boolean }) {
    const where: any = {};

    if (query?.propertyId) where.propertyId = query.propertyId;
    if (query?.isActive !== undefined) where.isActive = query.isActive;

    return this.prisma.propertyRental.findMany({
      where,
      include: {
        property: true,
        rentPayments: {
          orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
        },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async createRental(dto: CreatePropertyRentalDto) {
    const property = await this.findById(dto.propertyId);

    // Check if property already has an active rental
    const activeRental = property.rentals.find(r => r.isActive);
    if (activeRental) {
      throw new BadRequestException('Property already has an active rental');
    }

    return this.prisma.propertyRental.create({
      data: {
        propertyId: dto.propertyId,
        tenantName: dto.tenantName,
        tenantContact: dto.tenantContact,
        monthlyRent: dto.monthlyRent,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        isActive: true,
      },
      include: {
        property: true,
      },
    });
  }

  async updateRental(rentalId: string, dto: UpdatePropertyRentalDto) {
    const rental = await this.prisma.propertyRental.findUnique({
      where: { id: rentalId },
    });

    if (!rental) throw new NotFoundException('Rental not found');

    return this.prisma.propertyRental.update({
      where: { id: rentalId },
      data: {
        ...dto,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
      include: {
        property: true,
        rentPayments: true,
      },
    });
  }

  async endRental(rentalId: string, endDate: string) {
    const rental = await this.prisma.propertyRental.findUnique({
      where: { id: rentalId },
    });

    if (!rental) throw new NotFoundException('Rental not found');

    return this.prisma.propertyRental.update({
      where: { id: rentalId },
      data: {
        endDate: new Date(endDate),
        isActive: false,
      },
      include: {
        property: true,
      },
    });
  }

  async deleteRental(rentalId: string) {
    const rental = await this.prisma.propertyRental.findUnique({
      where: { id: rentalId },
      include: { rentPayments: true },
    });

    if (!rental) throw new NotFoundException('Rental not found');

    // Delete associated payments first
    if (rental.rentPayments.length > 0) {
      await this.prisma.rentPayment.deleteMany({
        where: { propertyRentalId: rentalId },
      });
    }

    return this.prisma.propertyRental.delete({
      where: { id: rentalId },
    });
  }

  // ==================== Rent Payments ====================
  async getRentPayments(rentalId: string) {
    return this.prisma.rentPayment.findMany({
      where: { propertyRentalId: rentalId },
      orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
    });
  }

  async getAllRentPayments(query?: { status?: string; year?: number; month?: number }) {
    const where: any = {};

    if (query?.status) {
      where.status = query.status;
    }

    if (query?.year) {
      where.periodYear = query.year;
    }

    if (query?.month) {
      where.periodMonth = query.month;
    }

    return this.prisma.rentPayment.findMany({
      where,
      include: {
        propertyRental: {
          include: { property: true },
        },
      },
      orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
    });
  }

  async createRentPayment(dto: CreateRentPaymentDto) {
    const rental = await this.prisma.propertyRental.findUnique({
      where: { id: dto.propertyRentalId },
      include: { property: true },
    });

    if (!rental) throw new NotFoundException('Rental not found');

    // Check if payment already exists for this period
    const existing = await this.prisma.rentPayment.findFirst({
      where: {
        propertyRentalId: dto.propertyRentalId,
        periodMonth: dto.periodMonth,
        periodYear: dto.periodYear,
      },
    });

    if (existing) {
      throw new BadRequestException('Payment already exists for this period');
    }

    const isPaid = !!dto.paidAt;

    // Create the payment record
    const payment = await this.prisma.rentPayment.create({
      data: {
        propertyRentalId: dto.propertyRentalId,
        amount: dto.amount,
        periodMonth: dto.periodMonth,
        periodYear: dto.periodYear,
        status: isPaid ? 'paid' : 'pending',
        paidAt: isPaid ? new Date(dto.paidAt) : null,
        notes: dto.notes,
      },
    });

    // If paid, also create finance income entry
    if (isPaid) {
      const incomeCategory = await this.getPropertyRentalIncomeCategory();
      const receiptNumber = await this.generatePropertyRentalReceiptNumber();

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      await this.prisma.income.create({
        data: {
          categoryId: incomeCategory.id,
          amount: dto.amount,
          receiptNumber,
          description: `Property Rental - ${rental.property.name} - ${rental.tenantName} - ${monthNames[dto.periodMonth - 1]} ${dto.periodYear}`,
          transactionDate: new Date(dto.paidAt),
          notes: dto.notes || `Rent payment for ${monthNames[dto.periodMonth - 1]} ${dto.periodYear}`,
        },
      });
    }

    return payment;
  }

  async markPaymentAsPaid(paymentId: string, notes?: string) {
    const payment = await this.prisma.rentPayment.findUnique({
      where: { id: paymentId },
      include: {
        propertyRental: {
          include: { property: true },
        },
      },
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status === 'paid') {
      throw new BadRequestException('Payment is already marked as paid');
    }

    // Get or create income category
    const incomeCategory = await this.getPropertyRentalIncomeCategory();
    const receiptNumber = await this.generatePropertyRentalReceiptNumber();

    // Create finance income entry
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    await this.prisma.income.create({
      data: {
        categoryId: incomeCategory.id,
        amount: payment.amount,
        receiptNumber,
        description: `Property Rental - ${payment.propertyRental.property.name} - ${payment.propertyRental.tenantName} - ${monthNames[payment.periodMonth - 1]} ${payment.periodYear}`,
        transactionDate: new Date(),
        notes: notes || `Rent payment for ${monthNames[payment.periodMonth - 1]} ${payment.periodYear}`,
      },
    });

    // Update payment status
    return this.prisma.rentPayment.update({
      where: { id: paymentId },
      data: {
        status: 'paid',
        paidAt: new Date(),
        notes: notes || payment.notes,
      },
      include: {
        propertyRental: {
          include: { property: true },
        },
      },
    });
  }

  async deleteRentPayment(paymentId: string) {
    const payment = await this.prisma.rentPayment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) throw new NotFoundException('Payment not found');

    return this.prisma.rentPayment.delete({
      where: { id: paymentId },
    });
  }

  // Generate pending payments for all active rentals for a given month
  async generatePendingPayments(year: number, month: number) {
    // Get all active rentals
    const activeRentals = await this.prisma.propertyRental.findMany({
      where: {
        isActive: true,
        startDate: { lte: new Date(year, month - 1, 28) }, // Rental must have started by end of month
      },
    });

    const created = [];
    
    for (const rental of activeRentals) {
      // Check if payment already exists for this period
      const existing = await this.prisma.rentPayment.findFirst({
        where: {
          propertyRentalId: rental.id,
          periodMonth: month,
          periodYear: year,
        },
      });

      if (!existing) {
        const payment = await this.prisma.rentPayment.create({
          data: {
            propertyRentalId: rental.id,
            amount: rental.monthlyRent,
            periodMonth: month,
            periodYear: year,
            status: 'pending',
          },
          include: {
            propertyRental: {
              include: { property: true },
            },
          },
        });
        created.push(payment);
      }
    }

    return {
      message: `Generated ${created.length} pending payments for ${month}/${year}`,
      payments: created,
    };
  }

  // ==================== Summary ====================
  async getSummary() {
    const [totalProperties, activeRentals, allProperties] = await Promise.all([
      this.prisma.property.count({ where: { isActive: true } }),
      this.prisma.propertyRental.count({ where: { isActive: true } }),
      this.prisma.property.findMany({
        where: { isActive: true },
        include: {
          rentals: {
            where: { isActive: true },
          },
        },
      }),
    ]);

    // Calculate monthly income
    const monthlyIncome = await this.prisma.propertyRental.aggregate({
      where: { isActive: true },
      _sum: { monthlyRent: true },
    });

    // Get this year's collected rent (only paid payments)
    const currentYear = new Date().getFullYear();
    const collectedThisYear = await this.prisma.rentPayment.aggregate({
      where: { 
        periodYear: currentYear,
        status: 'paid',
      },
      _sum: { amount: true },
    });

    // Properties without tenants
    const vacantProperties = allProperties.filter(p => p.rentals.length === 0).length;

    // Recent payments
    const recentPayments = await this.prisma.rentPayment.findMany({
      include: {
        propertyRental: {
          include: { property: true },
        },
      },
      orderBy: { paidAt: 'desc' },
      take: 5,
    });

    // Get property types distribution
    const propertyTypes = await this.prisma.property.groupBy({
      by: ['propertyType'],
      where: { isActive: true },
      _count: true,
    });

    return {
      totalProperties,
      activeRentals,
      vacantProperties,
      monthlyIncome: Number(monthlyIncome._sum.monthlyRent) || 0,
      collectedThisYear: Number(collectedThisYear._sum.amount) || 0,
      recentPayments,
      propertyTypes: propertyTypes.map(pt => ({
        type: pt.propertyType || 'Other',
        count: pt._count,
      })),
    };
  }

  async getAvailableYears() {
    const years = await this.prisma.$queryRaw<{ year: number }[]>`
      SELECT DISTINCT period_year as year
      FROM rent_payments
      ORDER BY year DESC
    `;
    return years.map(y => y.year);
  }
}
