import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateIncomeCategoryDto,
  UpdateIncomeCategoryDto,
  CreateExpenseCategoryDto,
  UpdateExpenseCategoryDto,
  CreateIncomeDto,
  UpdateIncomeDto,
  CreateExpenseDto,
  UpdateExpenseDto,
  FinanceQueryDto,
} from './dto/finance.dto';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  // ==================== Income Categories ====================
  async getIncomeCategories(includeInactive = false) {
    return this.prisma.incomeCategory.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async getIncomeCategoryById(id: string) {
    const category = await this.prisma.incomeCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Income category not found');
    return category;
  }

  async createIncomeCategory(dto: CreateIncomeCategoryDto) {
    return this.prisma.incomeCategory.create({
      data: {
        name: dto.name,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async updateIncomeCategory(id: string, dto: UpdateIncomeCategoryDto) {
    await this.getIncomeCategoryById(id);
    return this.prisma.incomeCategory.update({
      where: { id },
      data: dto,
    });
  }

  async deleteIncomeCategory(id: string) {
    await this.getIncomeCategoryById(id);
    return this.prisma.incomeCategory.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ==================== Expense Categories ====================
  async getExpenseCategories(includeInactive = false) {
    return this.prisma.expenseCategory.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async getExpenseCategoryById(id: string) {
    const category = await this.prisma.expenseCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Expense category not found');
    return category;
  }

  async createExpenseCategory(dto: CreateExpenseCategoryDto) {
    return this.prisma.expenseCategory.create({
      data: {
        name: dto.name,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async updateExpenseCategory(id: string, dto: UpdateExpenseCategoryDto) {
    await this.getExpenseCategoryById(id);
    return this.prisma.expenseCategory.update({
      where: { id },
      data: dto,
    });
  }

  async deleteExpenseCategory(id: string) {
    await this.getExpenseCategoryById(id);
    return this.prisma.expenseCategory.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ==================== Income ====================
  async getIncomes(query: FinanceQueryDto) {
    const { year, month, categoryId, search, page = 1, limit = 20 } = query;
    const where: any = {};

    if (year) {
      if (month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        where.transactionDate = { gte: startDate, lte: endDate };
      } else {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        where.transactionDate = { gte: startDate, lte: endDate };
      }
    }
    if (categoryId) where.categoryId = categoryId;
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

  async getIncomeById(id: string) {
    const income = await this.prisma.income.findUnique({
      where: { id },
      include: {
        category: true,
        payer: { select: { id: true, fullName: true, phone: true } },
      },
    });
    if (!income) throw new NotFoundException('Income record not found');
    return income;
  }

  async createIncome(dto: CreateIncomeDto, createdBy?: string) {
    // Generate receipt number if not provided
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

  async updateIncome(id: string, dto: UpdateIncomeDto) {
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

  async deleteIncome(id: string) {
    await this.getIncomeById(id);
    return this.prisma.income.delete({ where: { id } });
  }

  private async generateReceiptNumber(): Promise<string> {
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

  // ==================== Expenses ====================
  async getExpenses(query: FinanceQueryDto) {
    const { year, month, categoryId, search, page = 1, limit = 20 } = query;
    const where: any = {};

    if (year) {
      if (month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        where.transactionDate = { gte: startDate, lte: endDate };
      } else {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        where.transactionDate = { gte: startDate, lte: endDate };
      }
    }
    if (categoryId) where.categoryId = categoryId;
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

  async getExpenseById(id: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: {
        category: true,
        payee: { select: { id: true, fullName: true, phone: true } },
      },
    });
    if (!expense) throw new NotFoundException('Expense record not found');
    return expense;
  }

  async createExpense(dto: CreateExpenseDto, createdBy?: string) {
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

  async updateExpense(id: string, dto: UpdateExpenseDto) {
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

  async deleteExpense(id: string) {
    await this.getExpenseById(id);
    return this.prisma.expense.delete({ where: { id } });
  }

  private async generateVoucherNumber(): Promise<string> {
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

  // ==================== Salaries ====================
  async getSalaries(params: { year?: number; month?: number; personId?: string }) {
    const { year, month, personId } = params;
    const where: any = {};
    if (year) where.periodYear = year;
    if (month) where.periodMonth = month;
    if (personId) where.personId = personId;

    return this.prisma.salary.findMany({
      where,
      include: {
        person: { select: { id: true, fullName: true, phone: true } },
        expense: true,
      },
      orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
    });
  }

  // ==================== Reports & Summary ====================
  async getFinanceSummary(year?: number, month?: number) {
    const where: any = {};
    if (year) {
      if (month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        where.transactionDate = { gte: startDate, lte: endDate };
      } else {
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

    // Get category details
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

  async getMonthlyReport(year: number) {
    const monthlyData = await Promise.all(
      Array.from({ length: 12 }, (_, i) => i + 1).map(async (month) => {
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
      })
    );

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
      this.prisma.$queryRaw<{ year: number }[]>`
        SELECT DISTINCT CAST(YEAR(transaction_date) AS SIGNED) as year
        FROM incomes
        ORDER BY year DESC
      `,
      this.prisma.$queryRaw<{ year: number }[]>`
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

    // Combine and sort
    const transactions = [
      ...recentIncomes.map(i => ({ ...i, type: 'income' as const })),
      ...recentExpenses.map(e => ({ ...e, type: 'expense' as const })),
    ].sort((a, b) => 
      new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
    ).slice(0, limit);

    return transactions;
  }
}
