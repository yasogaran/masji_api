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
exports.SandaaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
let SandaaService = class SandaaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getConfigs(mahallaId) {
        const where = {};
        if (mahallaId) {
            where.mahallaId = mahallaId;
        }
        return this.prisma.sandaaConfig.findMany({
            where,
            include: {
                mahalla: true,
            },
            orderBy: [
                { effectiveFrom: 'desc' },
            ],
        });
    }
    async getActiveConfig(mahallaId) {
        const today = new Date();
        return this.getConfigForDate(mahallaId, today);
    }
    async getConfigForDate(mahallaId, targetDate) {
        const date = targetDate || new Date();
        if (mahallaId) {
            const mahallaConfig = await this.prisma.sandaaConfig.findFirst({
                where: {
                    mahallaId,
                    effectiveFrom: { lte: date },
                    OR: [
                        { effectiveTo: null },
                        { effectiveTo: { gte: date } },
                    ],
                },
                include: { mahalla: true },
                orderBy: { effectiveFrom: 'desc' },
            });
            if (mahallaConfig) {
                return mahallaConfig;
            }
        }
        return this.prisma.sandaaConfig.findFirst({
            where: {
                mahallaId: null,
                effectiveFrom: { lte: date },
                OR: [
                    { effectiveTo: null },
                    { effectiveTo: { gte: date } },
                ],
            },
            orderBy: { effectiveFrom: 'desc' },
        });
    }
    async getConfigForPeriod(mahallaId, month, year) {
        const periodDate = new Date(year, month - 1, 1);
        return this.getConfigForDate(mahallaId, periodDate);
    }
    async createConfig(dto, createdBy) {
        const existingConfig = await this.prisma.sandaaConfig.findFirst({
            where: {
                mahallaId: dto.mahallaId || null,
                effectiveFrom: { lte: new Date(dto.effectiveFrom) },
                OR: [
                    { effectiveTo: null },
                    { effectiveTo: { gte: new Date(dto.effectiveFrom) } },
                ],
            },
        });
        if (existingConfig) {
            await this.prisma.sandaaConfig.update({
                where: { id: existingConfig.id },
                data: { effectiveTo: new Date(dto.effectiveFrom) },
            });
        }
        return this.prisma.sandaaConfig.create({
            data: {
                mahallaId: dto.mahallaId || null,
                amount: dto.amount,
                frequency: dto.frequency || 'monthly',
                whoPays: dto.whoPays || 'family_head',
                effectiveFrom: new Date(dto.effectiveFrom),
                effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : null,
                createdBy,
            },
            include: { mahalla: true },
        });
    }
    async updateConfig(id, dto) {
        const config = await this.prisma.sandaaConfig.findUnique({
            where: { id },
        });
        if (!config) {
            throw new common_1.NotFoundException('Sandaa config not found');
        }
        return this.prisma.sandaaConfig.update({
            where: { id },
            data: {
                amount: dto.amount,
                frequency: dto.frequency,
                effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined,
            },
            include: { mahalla: true },
        });
    }
    async generatePayments(dto, createdBy) {
        const { month, year, mahallaId } = dto;
        const familyHeadWhere = {
            familyHeadId: null,
            isSandaaEligible: true,
        };
        if (mahallaId) {
            familyHeadWhere.house = { mahallaId };
        }
        const familyHeads = await this.prisma.person.findMany({
            where: familyHeadWhere,
            include: {
                house: {
                    include: { mahalla: true },
                },
            },
        });
        if (familyHeads.length === 0) {
            return { created: 0, skipped: 0, message: 'No eligible families found' };
        }
        let created = 0;
        let skipped = 0;
        for (const familyHead of familyHeads) {
            const config = await this.getConfigForPeriod(familyHead.house.mahallaId, month, year);
            if (!config) {
                skipped++;
                continue;
            }
            const existingPayment = await this.prisma.sandaaPayment.findUnique({
                where: {
                    personId_periodMonth_periodYear: {
                        personId: familyHead.id,
                        periodMonth: month,
                        periodYear: year,
                    },
                },
            });
            if (existingPayment) {
                skipped++;
                continue;
            }
            await this.prisma.sandaaPayment.create({
                data: {
                    personId: familyHead.id,
                    periodMonth: month,
                    periodYear: year,
                    amount: config.amount,
                    status: 'pending',
                },
            });
            created++;
        }
        return {
            created,
            skipped,
            message: `Generated ${created} payments, ${skipped} skipped`,
        };
    }
    async getPayments(query) {
        const { mahallaId, familyId, status, month, year, search, page = 1, limit = 50 } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (month) {
            where.periodMonth = month;
        }
        if (year) {
            where.periodYear = year;
        }
        if (mahallaId) {
            where.person = {
                house: { mahallaId },
            };
        }
        if (familyId) {
            where.personId = familyId;
        }
        if (search) {
            where.person = {
                ...where.person,
                OR: [
                    { fullName: { contains: search, mode: 'insensitive' } },
                    { nic: { contains: search } },
                    { phone: { contains: search } },
                ],
            };
        }
        const [payments, total] = await Promise.all([
            this.prisma.sandaaPayment.findMany({
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
                    receivedByUser: {
                        select: { id: true, fullName: true },
                    },
                },
                orderBy: [
                    { person: { house: { mahalla: { title: 'asc' } } } },
                    { person: { fullName: 'asc' } },
                ],
            }),
            this.prisma.sandaaPayment.count({ where }),
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
    async getPaymentSummary(month, year, mahallaId) {
        const where = {
            periodMonth: month,
            periodYear: year,
        };
        if (mahallaId) {
            where.person = {
                house: { mahallaId },
            };
        }
        const [pending, paid, partial, total] = await Promise.all([
            this.prisma.sandaaPayment.count({ where: { ...where, status: 'pending' } }),
            this.prisma.sandaaPayment.count({ where: { ...where, status: 'paid' } }),
            this.prisma.sandaaPayment.count({ where: { ...where, status: 'partial' } }),
            this.prisma.sandaaPayment.aggregate({
                where,
                _sum: { amount: true, paidAmount: true },
            }),
        ]);
        const expectedAmount = total._sum.amount || new library_1.Decimal(0);
        const collectedAmount = total._sum.paidAmount || new library_1.Decimal(0);
        return {
            pending,
            paid,
            partial,
            totalFamilies: pending + paid + partial,
            expectedAmount: expectedAmount.toNumber(),
            collectedAmount: collectedAmount.toNumber(),
            outstandingAmount: expectedAmount.minus(collectedAmount).toNumber(),
            collectionRate: expectedAmount.gt(0)
                ? collectedAmount.div(expectedAmount).mul(100).toNumber().toFixed(1)
                : 0,
        };
    }
    async getYearlySummary(year, mahallaId) {
        const where = {
            periodYear: year,
        };
        if (mahallaId) {
            where.person = {
                house: { mahallaId },
            };
        }
        const result = await this.prisma.sandaaPayment.aggregate({
            where,
            _sum: { amount: true, paidAmount: true },
            _count: true,
        });
        const paidResult = await this.prisma.sandaaPayment.aggregate({
            where: { ...where, status: 'paid' },
            _sum: { paidAmount: true },
            _count: true,
        });
        const expectedAmount = result._sum.amount || new library_1.Decimal(0);
        const collectedAmount = result._sum.paidAmount || new library_1.Decimal(0);
        return {
            year,
            totalPayments: result._count,
            paidPayments: paidResult._count,
            expectedAmount: expectedAmount.toNumber(),
            collectedAmount: collectedAmount.toNumber(),
            outstandingAmount: expectedAmount.minus(collectedAmount).toNumber(),
            collectionRate: expectedAmount.gt(0)
                ? collectedAmount.div(expectedAmount).mul(100).toNumber().toFixed(1)
                : '0',
        };
    }
    async recordPayment(dto, receivedBy) {
        const payment = await this.prisma.sandaaPayment.findUnique({
            where: { id: dto.paymentId },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        const paidAmount = dto.paidAmount ?? payment.amount.toNumber();
        const status = paidAmount >= payment.amount.toNumber() ? 'paid' : 'partial';
        return this.prisma.sandaaPayment.update({
            where: { id: dto.paymentId },
            data: {
                paidAmount,
                paidAt: new Date(),
                status,
                receivedBy,
                notes: dto.notes,
            },
            include: {
                person: {
                    include: {
                        house: { include: { mahalla: true } },
                    },
                },
            },
        });
    }
    async bulkRecordPayments(paymentIds, receivedBy) {
        const results = [];
        for (const paymentId of paymentIds) {
            try {
                const result = await this.recordPayment({ paymentId }, receivedBy);
                results.push({ id: paymentId, success: true, data: result });
            }
            catch (error) {
                results.push({ id: paymentId, success: false, error: error.message });
            }
        }
        return {
            total: paymentIds.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            results,
        };
    }
    async waivePayment(paymentId, reason) {
        const payment = await this.prisma.sandaaPayment.findUnique({
            where: { id: paymentId },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return this.prisma.sandaaPayment.update({
            where: { id: paymentId },
            data: {
                status: 'waived',
                notes: reason,
            },
            include: {
                person: {
                    include: {
                        house: { include: { mahalla: true } },
                    },
                },
            },
        });
    }
    async updateFamilyEligibility(dto) {
        const familyHead = await this.prisma.person.findUnique({
            where: { id: dto.familyId },
        });
        if (!familyHead) {
            throw new common_1.NotFoundException('Family not found');
        }
        if (familyHead.familyHeadId !== null) {
            throw new common_1.BadRequestException('This person is not a family head');
        }
        return this.prisma.person.update({
            where: { id: dto.familyId },
            data: {
                isSandaaEligible: dto.isSandaaEligible,
                sandaaExemptReason: dto.isSandaaEligible ? null : dto.sandaaExemptReason,
            },
            include: {
                house: { include: { mahalla: true } },
                familyMembers: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
    }
    async getEligibleFamilies(mahallaId) {
        const where = {
            familyHeadId: null,
            isSandaaEligible: true,
        };
        if (mahallaId) {
            where.house = { mahallaId };
        }
        const familyHeads = await this.prisma.person.findMany({
            where,
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
            orderBy: [
                { house: { mahalla: { title: 'asc' } } },
                { house: { houseNumber: 'asc' } },
            ],
        });
        return familyHeads.map(head => ({
            id: head.id,
            familyHead: {
                id: head.id,
                fullName: head.fullName,
                phone: head.phone,
            },
            house: head.house,
            members: head.familyMembers,
            isSandaaEligible: head.isSandaaEligible,
        }));
    }
    async getFamilyPaymentHistory(familyHeadId) {
        const payments = await this.prisma.sandaaPayment.findMany({
            where: { personId: familyHeadId },
            orderBy: [
                { periodYear: 'desc' },
                { periodMonth: 'desc' },
            ],
            include: {
                receivedByUser: {
                    select: { id: true, fullName: true },
                },
            },
        });
        const person = await this.prisma.person.findUnique({
            where: { id: familyHeadId },
            include: {
                house: { include: { mahalla: true } },
                familyMembers: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
        return {
            person,
            payments,
            summary: {
                totalPayments: payments.length,
                totalPaid: payments.filter(p => p.status === 'paid').length,
                totalPending: payments.filter(p => p.status === 'pending').length,
                totalWaived: payments.filter(p => p.status === 'waived').length,
            },
        };
    }
    async checkPaymentsGenerated(month, year, mahallaId) {
        const where = {
            periodMonth: month,
            periodYear: year,
        };
        if (mahallaId) {
            where.person = {
                house: { mahallaId },
            };
        }
        const count = await this.prisma.sandaaPayment.count({ where });
        const familyHeadWhere = {
            familyHeadId: null,
            isSandaaEligible: true,
        };
        if (mahallaId) {
            familyHeadWhere.house = { mahallaId };
        }
        const totalEligible = await this.prisma.person.count({ where: familyHeadWhere });
        return {
            isGenerated: count > 0,
            generatedCount: count,
            totalEligible,
            allGenerated: count >= totalEligible,
        };
    }
    async getPendingPaymentsForFamily(familyHeadId) {
        const person = await this.prisma.person.findUnique({
            where: { id: familyHeadId },
            include: {
                house: { include: { mahalla: true } },
            },
        });
        if (!person) {
            throw new common_1.NotFoundException('Person not found');
        }
        const pendingPayments = await this.prisma.sandaaPayment.findMany({
            where: {
                personId: familyHeadId,
                status: 'pending',
            },
            orderBy: [
                { periodYear: 'asc' },
                { periodMonth: 'asc' },
            ],
        });
        const totalPendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount.toNumber(), 0);
        return {
            person: {
                id: person.id,
                fullName: person.fullName,
                phone: person.phone,
                house: person.house,
            },
            pendingPayments,
            summary: {
                pendingMonths: pendingPayments.length,
                totalAmount: totalPendingAmount,
                oldestPending: pendingPayments.length > 0 ? {
                    month: pendingPayments[0].periodMonth,
                    year: pendingPayments[0].periodYear,
                } : null,
            },
        };
    }
    async recordMultiplePayments(paymentIds, receivedBy, notes) {
        const results = [];
        for (const paymentId of paymentIds) {
            try {
                const payment = await this.prisma.sandaaPayment.findUnique({
                    where: { id: paymentId },
                });
                if (!payment) {
                    results.push({ id: paymentId, success: false, error: 'Payment not found' });
                    continue;
                }
                const updated = await this.prisma.sandaaPayment.update({
                    where: { id: paymentId },
                    data: {
                        paidAmount: payment.amount,
                        paidAt: new Date(),
                        status: 'paid',
                        receivedBy,
                        notes,
                    },
                });
                results.push({ id: paymentId, success: true, data: updated });
            }
            catch (error) {
                results.push({ id: paymentId, success: false, error: error.message });
            }
        }
        return {
            total: paymentIds.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            results,
        };
    }
    async getAllConfigsByMahalla() {
        const mahallas = await this.prisma.mahalla.findMany({
            where: { isActive: true },
            orderBy: { title: 'asc' },
        });
        const today = new Date();
        const configs = [];
        const globalConfig = await this.prisma.sandaaConfig.findFirst({
            where: {
                mahallaId: null,
                effectiveFrom: { lte: today },
                OR: [
                    { effectiveTo: null },
                    { effectiveTo: { gte: today } },
                ],
            },
            orderBy: { effectiveFrom: 'desc' },
        });
        const pendingGlobalConfig = await this.prisma.sandaaConfig.findFirst({
            where: {
                mahallaId: null,
                effectiveFrom: { gt: today },
            },
            orderBy: { effectiveFrom: 'asc' },
        });
        configs.push({
            mahallaId: null,
            mahallaTitle: 'Default (All Mahallas)',
            config: globalConfig,
            pendingConfig: pendingGlobalConfig,
        });
        for (const mahalla of mahallas) {
            const mahallaConfig = await this.prisma.sandaaConfig.findFirst({
                where: {
                    mahallaId: mahalla.id,
                    effectiveFrom: { lte: today },
                    OR: [
                        { effectiveTo: null },
                        { effectiveTo: { gte: today } },
                    ],
                },
                orderBy: { effectiveFrom: 'desc' },
            });
            const pendingMahallaConfig = await this.prisma.sandaaConfig.findFirst({
                where: {
                    mahallaId: mahalla.id,
                    effectiveFrom: { gt: today },
                },
                orderBy: { effectiveFrom: 'asc' },
            });
            configs.push({
                mahallaId: mahalla.id,
                mahallaTitle: mahalla.title,
                config: mahallaConfig || globalConfig,
                pendingConfig: pendingMahallaConfig || (mahallaConfig ? null : pendingGlobalConfig),
                isUsingGlobal: !mahallaConfig,
            });
        }
        return configs;
    }
    async getGenerationStatus(mahallaId) {
        const where = {};
        if (mahallaId) {
            where.person = { house: { mahallaId } };
        }
        const latestPayment = await this.prisma.sandaaPayment.findFirst({
            where,
            orderBy: [
                { periodYear: 'desc' },
                { periodMonth: 'desc' },
            ],
        });
        const earliestPayment = await this.prisma.sandaaPayment.findFirst({
            where,
            orderBy: [
                { periodYear: 'asc' },
                { periodMonth: 'asc' },
            ],
        });
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
        const isGeneratedUntilPreviousMonth = latestPayment
            ? (latestPayment.periodYear > previousYear) ||
                (latestPayment.periodYear === previousYear && latestPayment.periodMonth >= previousMonth)
            : false;
        return {
            generatedUntil: latestPayment ? {
                month: latestPayment.periodMonth,
                year: latestPayment.periodYear,
            } : null,
            generatedFrom: earliestPayment ? {
                month: earliestPayment.periodMonth,
                year: earliestPayment.periodYear,
            } : null,
            previousMonth: { month: previousMonth, year: previousYear },
            currentMonth: { month: currentMonth, year: currentYear },
            isGeneratedUntilPreviousMonth,
            canGenerate: !isGeneratedUntilPreviousMonth,
        };
    }
    async generatePaymentsUntilPreviousMonth(mahallaId, createdBy) {
        const status = await this.getGenerationStatus(mahallaId);
        if (status.isGeneratedUntilPreviousMonth) {
            return {
                created: 0,
                skipped: 0,
                message: `Payments already generated until ${status.generatedUntil?.month}/${status.generatedUntil?.year}`,
            };
        }
        let startMonth;
        let startYear;
        if (status.generatedUntil) {
            if (status.generatedUntil.month === 12) {
                startMonth = 1;
                startYear = status.generatedUntil.year + 1;
            }
            else {
                startMonth = status.generatedUntil.month + 1;
                startYear = status.generatedUntil.year;
            }
        }
        else {
            const config = await this.getActiveConfig(mahallaId);
            if (config) {
                const effectiveDate = new Date(config.effectiveFrom);
                startMonth = effectiveDate.getMonth() + 1;
                startYear = effectiveDate.getFullYear();
            }
            else {
                startMonth = 1;
                startYear = new Date().getFullYear();
            }
        }
        const endMonth = status.previousMonth.month;
        const endYear = status.previousMonth.year;
        let totalCreated = 0;
        let totalSkipped = 0;
        const monthsGenerated = [];
        let currentGenMonth = startMonth;
        let currentGenYear = startYear;
        while (currentGenYear < endYear ||
            (currentGenYear === endYear && currentGenMonth <= endMonth)) {
            const result = await this.generatePayments({ month: currentGenMonth, year: currentGenYear, mahallaId }, createdBy);
            totalCreated += result.created;
            totalSkipped += result.skipped;
            if (result.created > 0) {
                monthsGenerated.push(`${currentGenMonth}/${currentGenYear}`);
            }
            if (currentGenMonth === 12) {
                currentGenMonth = 1;
                currentGenYear++;
            }
            else {
                currentGenMonth++;
            }
        }
        return {
            created: totalCreated,
            skipped: totalSkipped,
            monthsGenerated,
            generatedUntil: { month: endMonth, year: endYear },
            message: `Generated ${totalCreated} payments for ${monthsGenerated.length} month(s)`,
        };
    }
    async getConsolidatedFamilyPayments(query) {
        const { mahallaId, search, page = 1, limit = 50 } = query;
        const skip = (page - 1) * limit;
        const familyHeadWhere = {
            familyHeadId: null,
            isSandaaEligible: true,
        };
        if (mahallaId) {
            familyHeadWhere.house = { mahallaId };
        }
        if (search) {
            familyHeadWhere.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { nic: { contains: search } },
                { phone: { contains: search } },
            ];
        }
        const [familyHeads, totalFamilies] = await Promise.all([
            this.prisma.person.findMany({
                where: familyHeadWhere,
                include: {
                    house: {
                        include: { mahalla: true },
                    },
                },
                orderBy: [
                    { house: { mahalla: { title: 'asc' } } },
                    { house: { houseNumber: 'asc' } },
                ],
                skip,
                take: limit,
            }),
            this.prisma.person.count({ where: familyHeadWhere }),
        ]);
        const consolidatedData = await Promise.all(familyHeads.map(async (head) => {
            const payments = await this.prisma.sandaaPayment.findMany({
                where: { personId: head.id },
                orderBy: [
                    { periodYear: 'asc' },
                    { periodMonth: 'asc' },
                ],
            });
            const outstandingPayments = payments.filter(p => p.status === 'pending' || p.status === 'partial');
            const fullyPaidPayments = payments.filter(p => p.status === 'paid');
            const totalPendingAmount = outstandingPayments.reduce((sum, p) => {
                const owed = p.amount.toNumber() - (p.paidAmount?.toNumber() || 0);
                return sum + owed;
            }, 0);
            const totalPaidAmount = payments.reduce((sum, p) => sum + (p.paidAmount?.toNumber() || 0), 0);
            let status = 'none';
            if (payments.length === 0) {
                status = 'none';
            }
            else if (outstandingPayments.length === 0) {
                status = 'paid';
            }
            else if (totalPaidAmount === 0) {
                status = 'pending';
            }
            else {
                status = 'partial';
            }
            return {
                family: {
                    id: head.id,
                    familyHead: {
                        id: head.id,
                        fullName: head.fullName,
                        phone: head.phone,
                    },
                    house: head.house,
                    isSandaaEligible: head.isSandaaEligible,
                },
                payments: {
                    total: payments.length,
                    pending: outstandingPayments.length,
                    paid: fullyPaidPayments.length,
                    pendingPaymentIds: outstandingPayments.map(p => p.id),
                },
                amounts: {
                    totalPending: totalPendingAmount,
                    totalPaid: totalPaidAmount,
                },
                status,
                pendingMonths: outstandingPayments.map(p => ({
                    id: p.id,
                    month: p.periodMonth,
                    year: p.periodYear,
                    amount: p.amount.toNumber() - (p.paidAmount?.toNumber() || 0),
                })),
                lastPaidDate: fullyPaidPayments.length > 0
                    ? fullyPaidPayments[fullyPaidPayments.length - 1].paidAt
                    : null,
            };
        }));
        const allFamilyHeadIds = await this.prisma.person.findMany({
            where: familyHeadWhere,
            select: { id: true },
        });
        const allOutstandingPayments = await this.prisma.sandaaPayment.findMany({
            where: {
                personId: { in: allFamilyHeadIds.map(f => f.id) },
                status: { in: ['pending', 'partial'] },
            },
            select: {
                personId: true,
                amount: true,
                paidAmount: true,
            },
        });
        const allPaidPayments = await this.prisma.sandaaPayment.findMany({
            where: {
                personId: { in: allFamilyHeadIds.map(f => f.id) },
            },
            select: {
                personId: true,
                paidAmount: true,
            },
        });
        const familyPaymentMap = new Map();
        for (const head of allFamilyHeadIds) {
            familyPaymentMap.set(head.id, { hasOutstanding: false, totalPending: 0, totalPaid: 0 });
        }
        for (const payment of allOutstandingPayments) {
            const existing = familyPaymentMap.get(payment.personId);
            if (existing) {
                existing.hasOutstanding = true;
                existing.totalPending += payment.amount.toNumber() - (payment.paidAmount?.toNumber() || 0);
            }
        }
        for (const payment of allPaidPayments) {
            const existing = familyPaymentMap.get(payment.personId);
            if (existing) {
                existing.totalPaid += payment.paidAmount?.toNumber() || 0;
            }
        }
        let allPaid = 0;
        let somePending = 0;
        let totalPendingAmount = 0;
        let totalPaidAmount = 0;
        for (const [_, data] of familyPaymentMap) {
            if (data.hasOutstanding) {
                somePending++;
            }
            else {
                allPaid++;
            }
            totalPendingAmount += data.totalPending;
            totalPaidAmount += data.totalPaid;
        }
        const summary = {
            totalFamilies,
            allPaid,
            somePending,
            totalPendingAmount,
            totalPaidAmount,
        };
        return {
            data: consolidatedData,
            summary,
            meta: {
                page,
                limit,
                total: totalFamilies,
                totalPages: Math.ceil(totalFamilies / limit),
            },
        };
    }
    async recordCustomPayment(familyHeadId, amount, receivedBy, notes) {
        const outstandingPayments = await this.prisma.sandaaPayment.findMany({
            where: {
                personId: familyHeadId,
                status: { in: ['pending', 'partial'] },
            },
            orderBy: [
                { periodYear: 'asc' },
                { periodMonth: 'asc' },
            ],
        });
        if (outstandingPayments.length === 0) {
            throw new common_1.BadRequestException('No pending payments found for this family');
        }
        let remainingAmount = amount;
        const paidPayments = [];
        const now = new Date();
        for (const payment of outstandingPayments) {
            if (remainingAmount <= 0)
                break;
            const totalAmount = payment.amount.toNumber();
            const alreadyPaid = payment.paidAmount?.toNumber() || 0;
            const outstandingAmount = totalAmount - alreadyPaid;
            if (remainingAmount >= outstandingAmount) {
                const updated = await this.prisma.sandaaPayment.update({
                    where: { id: payment.id },
                    data: {
                        paidAmount: totalAmount,
                        paidAt: now,
                        status: 'paid',
                        receivedBy,
                        notes,
                    },
                });
                paidPayments.push({
                    ...updated,
                    paidFull: true,
                    amountApplied: outstandingAmount,
                });
                remainingAmount -= outstandingAmount;
            }
            else {
                const newPaidAmount = alreadyPaid + remainingAmount;
                const updated = await this.prisma.sandaaPayment.update({
                    where: { id: payment.id },
                    data: {
                        paidAmount: newPaidAmount,
                        paidAt: now,
                        status: 'partial',
                        receivedBy,
                        notes,
                    },
                });
                paidPayments.push({
                    ...updated,
                    paidFull: false,
                    amountApplied: remainingAmount,
                });
                remainingAmount = 0;
            }
        }
        const newPendingPayments = await this.prisma.sandaaPayment.findMany({
            where: {
                personId: familyHeadId,
                status: { in: ['pending', 'partial'] },
            },
            orderBy: [
                { periodYear: 'asc' },
                { periodMonth: 'asc' },
            ],
        });
        const newTotalPending = newPendingPayments.reduce((sum, p) => {
            const owed = p.amount.toNumber() - (p.paidAmount?.toNumber() || 0);
            return sum + owed;
        }, 0);
        return {
            amountPaid: amount,
            paymentsAffected: paidPayments.length,
            paidPayments,
            remainingPendingMonths: newPendingPayments.length,
            remainingPendingAmount: newTotalPending,
        };
    }
    async getNonEligibleFamilies(query) {
        const { mahallaId, page = 1, limit = 50 } = query;
        const skip = (page - 1) * limit;
        const familyHeadWhere = {
            familyHeadId: null,
            isSandaaEligible: false,
        };
        if (mahallaId) {
            familyHeadWhere.house = { mahallaId };
        }
        const [familyHeads, totalFamilies] = await Promise.all([
            this.prisma.person.findMany({
                where: familyHeadWhere,
                include: {
                    house: {
                        include: { mahalla: true },
                    },
                },
                orderBy: [
                    { house: { mahalla: { title: 'asc' } } },
                    { house: { houseNumber: 'asc' } },
                ],
                skip,
                take: limit,
            }),
            this.prisma.person.count({ where: familyHeadWhere }),
        ]);
        return {
            data: familyHeads.map(head => ({
                id: head.id,
                name: `${head.fullName} Family`,
                familyHead: {
                    id: head.id,
                    fullName: head.fullName,
                    phone: head.phone,
                },
                house: head.house,
                sandaaExemptReason: head.sandaaExemptReason,
            })),
            meta: {
                page,
                limit,
                total: totalFamilies,
                totalPages: Math.ceil(totalFamilies / limit),
            },
        };
    }
    async getFamilyCounts(mahallaId) {
        const baseWhere = {
            familyHeadId: null,
        };
        if (mahallaId) {
            baseWhere.house = { mahallaId };
        }
        const [totalFamilies, eligibleFamilies] = await Promise.all([
            this.prisma.person.count({ where: baseWhere }),
            this.prisma.person.count({ where: { ...baseWhere, isSandaaEligible: true } }),
        ]);
        return {
            totalFamilies,
            eligibleFamilies,
            nonEligibleFamilies: totalFamilies - eligibleFamilies,
        };
    }
};
exports.SandaaService = SandaaService;
exports.SandaaService = SandaaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SandaaService);
//# sourceMappingURL=sandaa.service.js.map