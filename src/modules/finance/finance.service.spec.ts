import { Test, TestingModule } from '@nestjs/testing';
import { FinanceService } from './finance.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('FinanceService', () => {
  let service: FinanceService;
  let prisma: PrismaService;

  const mockPrismaService = {
    incomeCategory: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    expenseCategory: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    income: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    expense: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    salary: {
      findMany: jest.fn(),
    },
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FinanceService>(FinanceService);
    prisma = module.get<PrismaService>(PrismaService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getIncomeCategories', () => {
    it('should return active income categories', async () => {
      const mockCategories = [
        { id: '1', name: 'Donation', isActive: true },
        { id: '2', name: 'Rental Income', isActive: true },
      ];

      mockPrismaService.incomeCategory.findMany.mockResolvedValue(mockCategories);

      const result = await service.getIncomeCategories();

      expect(result).toEqual(mockCategories);
      expect(mockPrismaService.incomeCategory.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
    });

    it('should return all income categories when includeInactive is true', async () => {
      const mockCategories = [
        { id: '1', name: 'Donation', isActive: true },
        { id: '2', name: 'Old Category', isActive: false },
      ];

      mockPrismaService.incomeCategory.findMany.mockResolvedValue(mockCategories);

      const result = await service.getIncomeCategories(true);

      expect(result).toEqual(mockCategories);
      expect(mockPrismaService.incomeCategory.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('getExpenseCategories', () => {
    it('should return active expense categories', async () => {
      const mockCategories = [
        { id: '1', name: 'Salaries', isActive: true },
        { id: '2', name: 'Maintenance', isActive: true },
      ];

      mockPrismaService.expenseCategory.findMany.mockResolvedValue(mockCategories);

      const result = await service.getExpenseCategories();

      expect(result).toEqual(mockCategories);
    });
  });

  describe('getIncomeCategoryById', () => {
    it('should return an income category by id', async () => {
      const mockCategory = { id: '1', name: 'Donation', isActive: true };

      mockPrismaService.incomeCategory.findUnique.mockResolvedValue(mockCategory);

      const result = await service.getIncomeCategoryById('1');

      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException if category not found', async () => {
      mockPrismaService.incomeCategory.findUnique.mockResolvedValue(null);

      await expect(service.getIncomeCategoryById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createIncomeCategory', () => {
    it('should create a new income category', async () => {
      const createDto = { name: 'New Income Category', description: 'Test description' };
      const mockCategory = { id: '1', ...createDto, isActive: true };

      mockPrismaService.incomeCategory.create.mockResolvedValue(mockCategory);

      const result = await service.createIncomeCategory(createDto);

      expect(result).toEqual(mockCategory);
    });
  });

  describe('getIncomes', () => {
    it('should return paginated incomes', async () => {
      const mockIncomes = [
        {
          id: '1',
          amount: 5000,
          transactionDate: new Date(),
          category: { id: '1', name: 'Donation' },
          payer: { id: '1', fullName: 'Test Person', phone: '0771234567' },
        },
      ];

      mockPrismaService.income.findMany.mockResolvedValue(mockIncomes);
      mockPrismaService.income.count.mockResolvedValue(1);

      const result = await service.getIncomes({ page: 1, limit: 20 });

      expect(result.data).toEqual(mockIncomes);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
    });

    it('should filter by year', async () => {
      mockPrismaService.income.findMany.mockResolvedValue([]);
      mockPrismaService.income.count.mockResolvedValue(0);

      await service.getIncomes({ year: 2025, page: 1, limit: 20 });

      expect(mockPrismaService.income.findMany).toHaveBeenCalled();
      const callArgs = mockPrismaService.income.findMany.mock.calls[0][0];
      expect(callArgs.where.transactionDate).toBeDefined();
    });

    it('should filter by year and month', async () => {
      mockPrismaService.income.findMany.mockResolvedValue([]);
      mockPrismaService.income.count.mockResolvedValue(0);

      await service.getIncomes({ year: 2025, month: 6, page: 1, limit: 20 });

      expect(mockPrismaService.income.findMany).toHaveBeenCalled();
      const callArgs = mockPrismaService.income.findMany.mock.calls[0][0];
      expect(callArgs.where.transactionDate).toBeDefined();
    });

    it('should filter by categoryId', async () => {
      mockPrismaService.income.findMany.mockResolvedValue([]);
      mockPrismaService.income.count.mockResolvedValue(0);

      await service.getIncomes({ categoryId: 'cat-1', page: 1, limit: 20 });

      expect(mockPrismaService.income.findMany).toHaveBeenCalled();
      const callArgs = mockPrismaService.income.findMany.mock.calls[0][0];
      expect(callArgs.where.categoryId).toBe('cat-1');
    });
  });

  describe('getIncomeById', () => {
    it('should return an income by id', async () => {
      const mockIncome = {
        id: '1',
        amount: 5000,
        payer: { id: '1', fullName: 'Test Person' },
        category: { id: '1', name: 'Donation' },
      };

      mockPrismaService.income.findUnique.mockResolvedValue(mockIncome);

      const result = await service.getIncomeById('1');

      expect(result).toEqual(mockIncome);
    });

    it('should throw NotFoundException if income not found', async () => {
      mockPrismaService.income.findUnique.mockResolvedValue(null);

      await expect(service.getIncomeById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createIncome', () => {
    it('should create an income record', async () => {
      const createDto = {
        categoryId: '1',
        amount: 5000,
        transactionDate: '2025-01-01',
        description: 'Test income',
      };

      const mockIncome = {
        id: '1',
        ...createDto,
        receiptNumber: 'RCT-2025-00001',
        transactionDate: new Date('2025-01-01'),
        payer: null,
        category: { id: '1', name: 'Donation' },
      };

      mockPrismaService.income.count.mockResolvedValue(0);
      mockPrismaService.income.create.mockResolvedValue(mockIncome);

      const result = await service.createIncome(createDto);

      expect(result).toEqual(mockIncome);
      expect(mockPrismaService.income.create).toHaveBeenCalled();
    });
  });

  describe('deleteIncome', () => {
    it('should delete an income record', async () => {
      const mockIncome = { id: '1', amount: 5000 };

      mockPrismaService.income.findUnique.mockResolvedValue(mockIncome);
      mockPrismaService.income.delete.mockResolvedValue(mockIncome);

      const result = await service.deleteIncome('1');

      expect(result).toEqual(mockIncome);
      expect(mockPrismaService.income.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if income not found', async () => {
      mockPrismaService.income.findUnique.mockResolvedValue(null);

      await expect(service.deleteIncome('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getExpenses', () => {
    it('should return paginated expenses', async () => {
      const mockExpenses = [
        {
          id: '1',
          amount: 3000,
          description: 'Electricity bill',
          transactionDate: new Date(),
          category: { id: '1', name: 'Electricity' },
          payee: { id: '1', fullName: 'Vendor', phone: '0771234567' },
        },
      ];

      mockPrismaService.expense.findMany.mockResolvedValue(mockExpenses);
      mockPrismaService.expense.count.mockResolvedValue(1);

      const result = await service.getExpenses({ page: 1, limit: 20 });

      expect(result.data).toEqual(mockExpenses);
      expect(result.total).toBe(1);
    });
  });

  describe('getExpenseById', () => {
    it('should return an expense by id', async () => {
      const mockExpense = {
        id: '1',
        amount: 3000,
        description: 'Electricity bill',
        payee: null,
        category: { id: '1', name: 'Electricity' },
      };

      mockPrismaService.expense.findUnique.mockResolvedValue(mockExpense);

      const result = await service.getExpenseById('1');

      expect(result).toEqual(mockExpense);
    });

    it('should throw NotFoundException if expense not found', async () => {
      mockPrismaService.expense.findUnique.mockResolvedValue(null);

      await expect(service.getExpenseById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createExpense', () => {
    it('should create an expense record', async () => {
      const createDto = {
        categoryId: '1',
        amount: 3000,
        description: 'Electricity bill',
        transactionDate: '2025-01-01',
      };

      const mockExpense = {
        id: '1',
        ...createDto,
        voucherNumber: 'VCH-2025-00001',
        transactionDate: new Date('2025-01-01'),
        payee: null,
        category: { id: '1', name: 'Electricity' },
      };

      mockPrismaService.expense.count.mockResolvedValue(0);
      mockPrismaService.expense.create.mockResolvedValue(mockExpense);

      const result = await service.createExpense(createDto);

      expect(result).toEqual(mockExpense);
    });
  });

  describe('deleteExpense', () => {
    it('should delete an expense record', async () => {
      const mockExpense = { id: '1', amount: 3000 };

      mockPrismaService.expense.findUnique.mockResolvedValue(mockExpense);
      mockPrismaService.expense.delete.mockResolvedValue(mockExpense);

      const result = await service.deleteExpense('1');

      expect(result).toEqual(mockExpense);
    });
  });

  describe('getSalaries', () => {
    it('should return salaries', async () => {
      const mockSalaries = [
        {
          id: '1',
          amount: 35000,
          periodMonth: 1,
          periodYear: 2025,
          person: { id: '1', fullName: 'Staff Member' },
        },
      ];

      mockPrismaService.salary.findMany.mockResolvedValue(mockSalaries);

      const result = await service.getSalaries({ year: 2025 });

      expect(result).toEqual(mockSalaries);
    });
  });

  describe('getFinanceSummary', () => {
    it('should return finance summary', async () => {
      mockPrismaService.income.aggregate.mockResolvedValue({ _sum: { amount: 100000 }, _count: 50 });
      mockPrismaService.expense.aggregate.mockResolvedValue({ _sum: { amount: 75000 }, _count: 40 });
      mockPrismaService.income.groupBy.mockResolvedValue([]);
      mockPrismaService.expense.groupBy.mockResolvedValue([]);
      mockPrismaService.incomeCategory.findMany.mockResolvedValue([]);
      mockPrismaService.expenseCategory.findMany.mockResolvedValue([]);

      const result = await service.getFinanceSummary(2025);

      expect(result).toBeDefined();
      expect(result.totalIncome).toBe(100000);
      expect(result.totalExpense).toBe(75000);
      expect(result.netBalance).toBe(25000);
    });

    it('should filter by month', async () => {
      mockPrismaService.income.aggregate.mockResolvedValue({ _sum: { amount: 20000 }, _count: 10 });
      mockPrismaService.expense.aggregate.mockResolvedValue({ _sum: { amount: 15000 }, _count: 8 });
      mockPrismaService.income.groupBy.mockResolvedValue([]);
      mockPrismaService.expense.groupBy.mockResolvedValue([]);
      mockPrismaService.incomeCategory.findMany.mockResolvedValue([]);
      mockPrismaService.expenseCategory.findMany.mockResolvedValue([]);

      const result = await service.getFinanceSummary(2025, 6);

      expect(result).toBeDefined();
      expect(result.totalIncome).toBe(20000);
      expect(result.totalExpense).toBe(15000);
    });
  });

  describe('getMonthlyReport', () => {
    it('should return monthly report for a year', async () => {
      mockPrismaService.income.aggregate.mockResolvedValue({ _sum: { amount: 10000 } });
      mockPrismaService.expense.aggregate.mockResolvedValue({ _sum: { amount: 7500 } });

      const result = await service.getMonthlyReport(2025);

      expect(result).toBeDefined();
      expect(result.year).toBe(2025);
      expect(result.monthlyData).toHaveLength(12);
    });
  });

  describe('getAvailableYears', () => {
    it('should return available years', async () => {
      mockPrismaService.$queryRaw.mockResolvedValue([{ year: 2025 }, { year: 2024 }]);

      const result = await service.getAvailableYears();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getRecentTransactions', () => {
    it('should return recent transactions', async () => {
      const mockIncomes = [
        { id: '1', amount: 5000, transactionDate: new Date(), category: { name: 'Donation' } },
      ];
      const mockExpenses = [
        { id: '2', amount: 3000, transactionDate: new Date(), category: { name: 'Electricity' } },
      ];

      mockPrismaService.income.findMany.mockResolvedValue(mockIncomes);
      mockPrismaService.expense.findMany.mockResolvedValue(mockExpenses);

      const result = await service.getRecentTransactions(10);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

