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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async getPaymentTypeById(id) {
        const paymentType = await this.prisma.paymentType.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { payments: true },
                },
            },
        });
        if (!paymentType) {
            throw new common_1.NotFoundException('Payment type not found');
        }
        return paymentType;
    }
    async createPaymentType(dto) {
        const existing = await this.prisma.paymentType.findUnique({
            where: { name: dto.name },
        });
        if (existing) {
            throw new common_1.BadRequestException('Payment type with this name already exists');
        }
        return this.prisma.paymentType.create({
            data: {
                name: dto.name,
                amount: dto.amount ?? 0,
                description: dto.description,
                type: dto.type ?? 'incoming',
                isActive: dto.isActive ?? true,
            },
        });
    }
    async updatePaymentType(id, dto) {
        const paymentType = await this.prisma.paymentType.findUnique({
            where: { id },
        });
        if (!paymentType) {
            throw new common_1.NotFoundException('Payment type not found');
        }
        if (dto.name && dto.name !== paymentType.name) {
            const existing = await this.prisma.paymentType.findUnique({
                where: { name: dto.name },
            });
            if (existing) {
                throw new common_1.BadRequestException('Payment type with this name already exists');
            }
        }
        return this.prisma.paymentType.update({
            where: { id },
            data: dto,
        });
    }
    async deletePaymentType(id) {
        const paymentType = await this.prisma.paymentType.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { payments: true },
                },
            },
        });
        if (!paymentType) {
            throw new common_1.NotFoundException('Payment type not found');
        }
        if (paymentType._count.payments > 0) {
            throw new common_1.BadRequestException('Cannot delete payment type with existing payments. Deactivate it instead.');
        }
        return this.prisma.paymentType.delete({
            where: { id },
        });
    }
    async getPayments(query) {
        const { paymentTypeId, personId, status, search, year, month, page = 1, limit = 50 } = query;
        const skip = (page - 1) * limit;
        const where = {};
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
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 1);
            where.createdAt = {
                gte: startDate,
                lt: endDate,
            };
        }
        else if (year) {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year + 1, 0, 1);
            where.createdAt = {
                gte: startDate,
                lt: endDate,
            };
        }
        else if (month) {
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
    async getPaymentById(id) {
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
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async createPayment(dto) {
        const person = await this.prisma.person.findUnique({
            where: { id: dto.personId },
        });
        if (!person) {
            throw new common_1.NotFoundException('Person not found');
        }
        const paymentType = await this.prisma.paymentType.findUnique({
            where: { id: dto.paymentTypeId },
        });
        if (!paymentType) {
            throw new common_1.NotFoundException('Payment type not found');
        }
        if (!paymentType.isActive) {
            throw new common_1.BadRequestException('Payment type is not active');
        }
        const paymentTypeAmount = paymentType.amount.toNumber();
        if (paymentTypeAmount === 0 && (dto.amount === undefined || dto.amount === null)) {
            throw new common_1.BadRequestException(`Payment type "${paymentType.name}" has a variable amount. You must explicitly provide the amount when creating this payment.`);
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
                paidAt: status === 'paid' ? new Date() : null,
            },
            include: {
                person: true,
                paymentType: true,
            },
        });
    }
    async updatePayment(id, dto) {
        const payment = await this.prisma.otherPayment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (dto.paymentTypeId && dto.paymentTypeId !== payment.paymentTypeId) {
            const paymentType = await this.prisma.paymentType.findUnique({
                where: { id: dto.paymentTypeId },
            });
            if (!paymentType) {
                throw new common_1.NotFoundException('Payment type not found');
            }
            if (!paymentType.isActive) {
                throw new common_1.BadRequestException('Payment type is not active');
            }
        }
        if (dto.personId && dto.personId !== payment.personId) {
            const person = await this.prisma.person.findUnique({
                where: { id: dto.personId },
            });
            if (!person) {
                throw new common_1.NotFoundException('Person not found');
            }
        }
        const updateData = {};
        if (dto.personId !== undefined)
            updateData.personId = dto.personId;
        if (dto.paymentTypeId !== undefined)
            updateData.paymentTypeId = dto.paymentTypeId;
        if (dto.amount !== undefined)
            updateData.amount = dto.amount;
        if (dto.reason !== undefined)
            updateData.reason = dto.reason;
        if (dto.status !== undefined) {
            updateData.status = dto.status;
            if (dto.status === 'paid' && payment.status !== 'paid') {
                updateData.paidAt = new Date();
            }
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
    async recordPayment(dto, receivedBy) {
        const payment = await this.prisma.otherPayment.findUnique({
            where: { id: dto.paymentId },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.status === 'paid') {
            throw new common_1.BadRequestException('Payment is already recorded');
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
    async cancelPayment(id) {
        const payment = await this.prisma.otherPayment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.status === 'paid') {
            throw new common_1.BadRequestException('Cannot cancel a paid payment');
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
    async getPersonPayments(personId) {
        const person = await this.prisma.person.findUnique({
            where: { id: personId },
        });
        if (!person) {
            throw new common_1.NotFoundException('Person not found');
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
    async getPaymentSummary(params) {
        const { paymentTypeId, year, month } = params || {};
        const where = {};
        if (paymentTypeId) {
            where.paymentTypeId = paymentTypeId;
        }
        if (year && month) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 1);
            where.createdAt = { gte: startDate, lt: endDate };
        }
        else if (year) {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year + 1, 0, 1);
            where.createdAt = { gte: startDate, lt: endDate };
        }
        else if (month) {
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
            this.prisma.otherPayment.aggregate({
                where: {
                    ...where,
                    status: 'paid',
                    paymentType: { type: 'incoming' }
                },
                _count: true,
                _sum: { amount: true },
            }),
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map