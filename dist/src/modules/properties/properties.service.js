"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PropertiesService = class PropertiesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPropertyRentalIncomeCategory() {
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
    async generatePropertyRentalReceiptNumber() {
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
    async findAll(query) {
        const where = {};
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
    async findById(id) {
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
        if (!property)
            throw new common_1.NotFoundException('Property not found');
        return property;
    }
    async create(dto) {
        return this.prisma.property.create({
            data: {
                name: dto.name,
                address: dto.address,
                description: dto.description,
                propertyType: dto.propertyType,
            },
        });
    }
    async update(id, dto) {
        await this.findById(id);
        return this.prisma.property.update({
            where: { id },
            data: dto,
        });
    }
    async delete(id) {
        const property = await this.findById(id);
        const activeRentals = property.rentals.filter(r => r.isActive);
        if (activeRentals.length > 0) {
            throw new common_1.BadRequestException('Cannot delete property with active rentals');
        }
        return this.prisma.property.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async getRentals(query) {
        const where = {};
        if (query?.propertyId)
            where.propertyId = query.propertyId;
        if (query?.isActive !== undefined)
            where.isActive = query.isActive;
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
    async createRental(dto) {
        const property = await this.findById(dto.propertyId);
        const activeRental = property.rentals.find(r => r.isActive);
        if (activeRental) {
            throw new common_1.BadRequestException('Property already has an active rental');
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
    async updateRental(rentalId, dto) {
        const rental = await this.prisma.propertyRental.findUnique({
            where: { id: rentalId },
        });
        if (!rental)
            throw new common_1.NotFoundException('Rental not found');
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
    async endRental(rentalId, endDate) {
        const rental = await this.prisma.propertyRental.findUnique({
            where: { id: rentalId },
        });
        if (!rental)
            throw new common_1.NotFoundException('Rental not found');
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
    async deleteRental(rentalId) {
        const rental = await this.prisma.propertyRental.findUnique({
            where: { id: rentalId },
            include: { rentPayments: true },
        });
        if (!rental)
            throw new common_1.NotFoundException('Rental not found');
        if (rental.rentPayments.length > 0) {
            await this.prisma.rentPayment.deleteMany({
                where: { propertyRentalId: rentalId },
            });
        }
        return this.prisma.propertyRental.delete({
            where: { id: rentalId },
        });
    }
    async getRentPayments(rentalId) {
        return this.prisma.rentPayment.findMany({
            where: { propertyRentalId: rentalId },
            orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
        });
    }
    async getAllRentPayments(query) {
        const where = {};
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
    async createRentPayment(dto) {
        const rental = await this.prisma.propertyRental.findUnique({
            where: { id: dto.propertyRentalId },
            include: { property: true },
        });
        if (!rental)
            throw new common_1.NotFoundException('Rental not found');
        const existing = await this.prisma.rentPayment.findFirst({
            where: {
                propertyRentalId: dto.propertyRentalId,
                periodMonth: dto.periodMonth,
                periodYear: dto.periodYear,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Payment already exists for this period');
        }
        const isPaid = !!dto.paidAt;
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
    async markPaymentAsPaid(paymentId, notes) {
        const payment = await this.prisma.rentPayment.findUnique({
            where: { id: paymentId },
            include: {
                propertyRental: {
                    include: { property: true },
                },
            },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        if (payment.status === 'paid') {
            throw new common_1.BadRequestException('Payment is already marked as paid');
        }
        const incomeCategory = await this.getPropertyRentalIncomeCategory();
        const receiptNumber = await this.generatePropertyRentalReceiptNumber();
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
    async deleteRentPayment(paymentId) {
        const payment = await this.prisma.rentPayment.findUnique({
            where: { id: paymentId },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        return this.prisma.rentPayment.delete({
            where: { id: paymentId },
        });
    }
    async generatePendingPayments(year, month) {
        const activeRentals = await this.prisma.propertyRental.findMany({
            where: {
                isActive: true,
                startDate: { lte: new Date(year, month - 1, 28) },
            },
        });
        const created = [];
        for (const rental of activeRentals) {
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
        const monthlyIncome = await this.prisma.propertyRental.aggregate({
            where: { isActive: true },
            _sum: { monthlyRent: true },
        });
        const currentYear = new Date().getFullYear();
        const collectedThisYear = await this.prisma.rentPayment.aggregate({
            where: {
                periodYear: currentYear,
                status: 'paid',
            },
            _sum: { amount: true },
        });
        const vacantProperties = allProperties.filter(p => p.rentals.length === 0).length;
        const recentPayments = await this.prisma.rentPayment.findMany({
            include: {
                propertyRental: {
                    include: { property: true },
                },
            },
            orderBy: { paidAt: 'desc' },
            take: 5,
        });
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
        const years = await this.prisma.$queryRaw `
      SELECT DISTINCT period_year as year
      FROM rent_payments
      ORDER BY year DESC
    `;
        return years.map(y => y.year);
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map