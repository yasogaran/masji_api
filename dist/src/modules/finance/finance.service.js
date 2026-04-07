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
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FinanceService = class FinanceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getIncomeCategories(includeInactive = false) {
        return this.prisma.incomeCategory.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    async getIncomeCategoryById(id) {
        const category = await this.prisma.incomeCategory.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Income category not found');
        return category;
    }
    async createIncomeCategory(dto) {
        return this.prisma.incomeCategory.create({
            data: {
                name: dto.name,
                description: dto.description,
                isActive: dto.isActive ?? true,
            },
        });
    }
    async updateIncomeCategory(id, dto) {
        await this.getIncomeCategoryById(id);
        return this.prisma.incomeCategory.update({
            where: { id },
            data: dto,
        });
    }
    async deleteIncomeCategory(id) {
        await this.getIncomeCategoryById(id);
        return this.prisma.incomeCategory.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async getExpenseCategories(includeInactive = false) {
        return this.prisma.expenseCategory.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    async getExpenseCategoryById(id) {
        const category = await this.prisma.expenseCategory.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Expense category not found');
        return category;
    }
    async createExpenseCategory(dto) {
        return this.prisma.expenseCategory.create({
            data: {
                name: dto.name,
                description: dto.description,
                isActive: dto.isActive ?? true,
            },
        });
    }
    async updateExpenseCategory(id, dto) {
        await this.getExpenseCategoryById(id);
        return this.prisma.expenseCategory.update({
            where: { id },
            data: dto,
        });
    }
    async deleteExpenseCategory(id) {
        await this.getExpenseCategoryById(id);
        return this.prisma.expenseCategory.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async getIncomes(query) {
        const { year, month, categoryId, search, page = 1, limit = 20 } = query;
        const where = {};
        if (year) {
            if (month) {
                const startDate = new Date(year, month - 1, 1);
                const endDate = new Date(year, month, 0);
                where.transactionDate = { gte: startDate, lte: endDate };
            }
            else {
                const startDate = new Date(year, 0, 1);
                const endDate = new Date(year, 11, 31);
                where.transactionDate = { gte: startDate, lte: endDate };
            }
        }
        if (categoryId)
            where.categoryId = categoryId;
        if (search) {
            where.OR = [
                { payerName: { contains: search, mode: 'insensitive' } },
                { payer: { fullName: { contains: search, mode: 'insensitive' } } },
                { description: { contains: search, mode: 'insensitive' } },
                { receiptNumber: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [incomes, total] = await Promise.all([
            this.prisma.income.findMany({
                where,
                include: {
                    category: true,
                    payer: { select: { id: true, fullName: true, phone: true } },
                },
                orderBy: { transactionDate: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.income.count({ where }),
        ]);
        return {
            data: incomes,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getIncomeById(id) {
        const income = await this.prisma.income.findUnique({
            where: { id },
            include: {
                category: true,
                payer: { select: { id: true, fullName: true, phone: true } },
            },
        });
        if (!income)
            throw new common_1.NotFoundException('Income record not found');
        return income;
    }
    async createIncome(dto, createdBy) {
        const receiptNumber = dto.receiptNumber || await this.generateReceiptNumber();
        return this.prisma.income.create({
            data: {
                receiptNumber,
                categoryId: dto.categoryId,
                amount: dto.amount,
                sourceType: dto.sourceType,
                payerId: dto.payerId,
                payerName: dto.payerName,
                description: dto.description,
                transactionDate: new Date(dto.transactionDate),
                paymentMethod: dto.paymentMethod || 'cash',
                referenceNo: dto.referenceNo,
                notes: dto.notes,
                createdBy,
            },
            include: {
                category: true,
                payer: { select: { id: true, fullName: true, phone: true } },
            },
        });
    }
    async updateIncome(id, dto) {
        await this.getIncomeById(id);
        return this.prisma.income.update({
            where: { id },
            data: {
                ...dto,
                transactionDate: dto.transactionDate ? new Date(dto.transactionDate) : undefined,
            },
            include: {
                category: true,
                payer: { select: { id: true, fullName: true, phone: true } },
            },
        });
    }
    async deleteIncome(id) {
        await this.getIncomeById(id);
        return this.prisma.income.delete({ where: { id } });
    }
    async generateReceiptNumber() {
        const today = new Date();
        const year = today.getFullYear();
        const count = await this.prisma.income.count({
            where: {
                createdAt: {
                    gte: new Date(year, 0, 1),
                    lte: new Date(year, 11, 31),
                },
            },
        });
        return `RCT-${year}-${String(count + 1).padStart(5, '0')}`;
    }
    async getExpenses(query) {
        const { year, month, categoryId, search, page = 1, limit = 20 } = query;
        const where = {};
        if (year) {
            if (month) {
                const startDate = new Date(year, month - 1, 1);
                const endDate = new Date(year, month, 0);
                where.transactionDate = { gte: startDate, lte: endDate };
            }
            else {
                const startDate = new Date(year, 0, 1);
                const endDate = new Date(year, 11, 31);
                where.transactionDate = { gte: startDate, lte: endDate };
            }
        }
        if (categoryId)
            where.categoryId = categoryId;
        if (search) {
            where.OR = [
                { payeeName: { contains: search, mode: 'insensitive' } },
                { payee: { fullName: { contains: search, mode: 'insensitive' } } },
                { description: { contains: search, mode: 'insensitive' } },
                { voucherNumber: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [expenses, total] = await Promise.all([
            this.prisma.expense.findMany({
                where,
                include: {
                    category: true,
                    payee: { select: { id: true, fullName: true, phone: true } },
                },
                orderBy: { transactionDate: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.expense.count({ where }),
        ]);
        return {
            data: expenses,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getExpenseById(id) {
        const expense = await this.prisma.expense.findUnique({
            where: { id },
            include: {
                category: true,
                payee: { select: { id: true, fullName: true, phone: true } },
            },
        });
        if (!expense)
            throw new common_1.NotFoundException('Expense record not found');
        return expense;
    }
    async createExpense(dto, createdBy) {
        const voucherNumber = dto.voucherNumber || await this.generateVoucherNumber();
        return this.prisma.expense.create({
            data: {
                voucherNumber,
                categoryId: dto.categoryId,
                amount: dto.amount,
                payeeType: dto.payeeType,
                payeeId: dto.payeeId,
                payeeName: dto.payeeName,
                description: dto.description,
                transactionDate: new Date(dto.transactionDate),
                paymentMethod: dto.paymentMethod || 'cash',
                referenceNo: dto.referenceNo,
                approvedBy: dto.approvedBy,
                notes: dto.notes,
                createdBy,
            },
            include: {
                category: true,
                payee: { select: { id: true, fullName: true, phone: true } },
            },
        });
    }
    async updateExpense(id, dto) {
        await this.getExpenseById(id);
        return this.prisma.expense.update({
            where: { id },
            data: {
                ...dto,
                transactionDate: dto.transactionDate ? new Date(dto.transactionDate) : undefined,
            },
            include: {
                category: true,
                payee: { select: { id: true, fullName: true, phone: true } },
            },
        });
    }
    async deleteExpense(id) {
        await this.getExpenseById(id);
        return this.prisma.expense.delete({ where: { id } });
    }
    async generateVoucherNumber() {
        const today = new Date();
        const year = today.getFullYear();
        const count = await this.prisma.expense.count({
            where: {
                createdAt: {
                    gte: new Date(year, 0, 1),
                    lte: new Date(year, 11, 31),
                },
            },
        });
        return `VCH-${year}-${String(count + 1).padStart(5, '0')}`;
    }
    async getSalaries(params) {
        const { year, month, personId } = params;
        const where = {};
        if (year)
            where.periodYear = year;
        if (month)
            where.periodMonth = month;
        if (personId)
            where.personId = personId;
        return this.prisma.salary.findMany({
            where,
            include: {
                person: { select: { id: true, fullName: true, phone: true } },
                expense: true,
            },
            orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
        });
    }
    async getFinanceSummary(year, month) {
        const where = {};
        if (year) {
            if (month) {
                const startDate = new Date(year, month - 1, 1);
                const endDate = new Date(year, month, 0);
                where.transactionDate = { gte: startDate, lte: endDate };
            }
            else {
                const startDate = new Date(year, 0, 1);
                const endDate = new Date(year, 11, 31);
                where.transactionDate = { gte: startDate, lte: endDate };
            }
        }
        const [totalIncome, totalExpense, incomeByCategory, expenseByCategory] = await Promise.all([
            this.prisma.income.aggregate({
                where,
                _sum: { amount: true },
                _count: true,
            }),
            this.prisma.expense.aggregate({
                where,
                _sum: { amount: true },
                _count: true,
            }),
            this.prisma.income.groupBy({
                by: ['categoryId'],
                where,
                _sum: { amount: true },
                _count: true,
            }),
            this.prisma.expense.groupBy({
                by: ['categoryId'],
                where,
                _sum: { amount: true },
                _count: true,
            }),
        ]);
        const incomeCategoryIds = incomeByCategory.map(c => c.categoryId);
        const expenseCategoryIds = expenseByCategory.map(c => c.categoryId);
        const [incomeCategories, expenseCategories] = await Promise.all([
            this.prisma.incomeCategory.findMany({ where: { id: { in: incomeCategoryIds } } }),
            this.prisma.expenseCategory.findMany({ where: { id: { in: expenseCategoryIds } } }),
        ]);
        const incomeCategoryMap = new Map(incomeCategories.map(c => [c.id, c]));
        const expenseCategoryMap = new Map(expenseCategories.map(c => [c.id, c]));
        return {
            totalIncome: Number(totalIncome._sum.amount) || 0,
            totalExpense: Number(totalExpense._sum.amount) || 0,
            netBalance: (Number(totalIncome._sum.amount) || 0) - (Number(totalExpense._sum.amount) || 0),
            incomeCount: totalIncome._count,
            expenseCount: totalExpense._count,
            incomeByCategory: incomeByCategory.map(c => ({
                category: incomeCategoryMap.get(c.categoryId),
                amount: Number(c._sum.amount) || 0,
                count: c._count,
            })),
            expenseByCategory: expenseByCategory.map(c => ({
                category: expenseCategoryMap.get(c.categoryId),
                amount: Number(c._sum.amount) || 0,
                count: c._count,
            })),
        };
    }
    async getMonthlyReport(year) {
        const monthlyData = await Promise.all(Array.from({ length: 12 }, (_, i) => i + 1).map(async (month) => {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            const where = { transactionDate: { gte: startDate, lte: endDate } };
            const [income, expense] = await Promise.all([
                this.prisma.income.aggregate({
                    where,
                    _sum: { amount: true },
                }),
                this.prisma.expense.aggregate({
                    where,
                    _sum: { amount: true },
                }),
            ]);
            return {
                month,
                income: Number(income._sum.amount) || 0,
                expense: Number(expense._sum.amount) || 0,
                net: (Number(income._sum.amount) || 0) - (Number(expense._sum.amount) || 0),
            };
        }));
        return {
            year,
            monthlyData,
            totals: {
                income: monthlyData.reduce((sum, m) => sum + m.income, 0),
                expense: monthlyData.reduce((sum, m) => sum + m.expense, 0),
                net: monthlyData.reduce((sum, m) => sum + m.net, 0),
            },
        };
    }
    async getAvailableYears() {
        const [incomeYears, expenseYears] = await Promise.all([
            this.prisma.$queryRaw `
        SELECT DISTINCT CAST(YEAR(transaction_date) AS SIGNED) as year
        FROM incomes
        ORDER BY year DESC
      `,
            this.prisma.$queryRaw `
        SELECT DISTINCT CAST(YEAR(transaction_date) AS SIGNED) as year
        FROM expenses
        ORDER BY year DESC
      `,
        ]);
        const years = new Set([
            ...incomeYears.map(y => y.year),
            ...expenseYears.map(y => y.year),
        ]);
        return Array.from(years).sort((a, b) => b - a);
    }
    async getRecentTransactions(limit = 10) {
        const [recentIncomes, recentExpenses] = await Promise.all([
            this.prisma.income.findMany({
                include: { category: true },
                orderBy: { transactionDate: 'desc' },
                take: limit,
            }),
            this.prisma.expense.findMany({
                include: { category: true },
                orderBy: { transactionDate: 'desc' },
                take: limit,
            }),
        ]);
        const transactions = [
            ...recentIncomes.map(i => ({ ...i, type: 'income' })),
            ...recentExpenses.map(e => ({ ...e, type: 'expense' })),
        ].sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()).slice(0, limit);
        return transactions;
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map