import { FinanceService } from './finance.service';
import { CreateIncomeCategoryDto, UpdateIncomeCategoryDto, CreateExpenseCategoryDto, UpdateExpenseCategoryDto, CreateIncomeDto, UpdateIncomeDto, CreateExpenseDto, UpdateExpenseDto } from './dto/finance.dto';
export declare class FinanceController {
    private financeService;
    constructor(financeService: FinanceService);
    getIncomeCategories(includeInactive?: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
    }[]>;
    getIncomeCategoryById(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
    }>;
    createIncomeCategory(dto: CreateIncomeCategoryDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
    }>;
    updateIncomeCategory(id: string, dto: UpdateIncomeCategoryDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
    }>;
    deleteIncomeCategory(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
    }>;
    getExpenseCategories(includeInactive?: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
    }[]>;
    getExpenseCategoryById(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
    }>;
    createExpenseCategory(dto: CreateExpenseCategoryDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
    }>;
    updateExpenseCategory(id: string, dto: UpdateExpenseCategoryDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
    }>;
    deleteExpenseCategory(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
    }>;
    getIncomes(year?: string, month?: string, categoryId?: string, search?: string, page?: string, limit?: string): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                description: string | null;
                isActive: boolean;
            };
            payer: {
                id: string;
                fullName: string;
                phone: string;
            };
        } & {
            id: string;
            notes: string | null;
            createdAt: Date;
            createdBy: string | null;
            description: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: string | null;
            referenceNo: string | null;
            categoryId: string;
            receiptNumber: string | null;
            sourceType: string | null;
            payerId: string | null;
            payerName: string | null;
            transactionDate: Date;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getIncomeById(id: string): Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
        };
        payer: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string | null;
        referenceNo: string | null;
        categoryId: string;
        receiptNumber: string | null;
        sourceType: string | null;
        payerId: string | null;
        payerName: string | null;
        transactionDate: Date;
    }>;
    createIncome(dto: CreateIncomeDto, user: any): Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
        };
        payer: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string | null;
        referenceNo: string | null;
        categoryId: string;
        receiptNumber: string | null;
        sourceType: string | null;
        payerId: string | null;
        payerName: string | null;
        transactionDate: Date;
    }>;
    updateIncome(id: string, dto: UpdateIncomeDto): Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
        };
        payer: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string | null;
        referenceNo: string | null;
        categoryId: string;
        receiptNumber: string | null;
        sourceType: string | null;
        payerId: string | null;
        payerName: string | null;
        transactionDate: Date;
    }>;
    deleteIncome(id: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string | null;
        referenceNo: string | null;
        categoryId: string;
        receiptNumber: string | null;
        sourceType: string | null;
        payerId: string | null;
        payerName: string | null;
        transactionDate: Date;
    }>;
    getExpenses(year?: string, month?: string, categoryId?: string, search?: string, page?: string, limit?: string): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                description: string | null;
                isActive: boolean;
            };
            payee: {
                id: string;
                fullName: string;
                phone: string;
            };
        } & {
            id: string;
            notes: string | null;
            createdAt: Date;
            createdBy: string | null;
            description: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: string | null;
            referenceNo: string | null;
            categoryId: string;
            approvedBy: string | null;
            transactionDate: Date;
            voucherNumber: string | null;
            payeeType: string | null;
            payeeId: string | null;
            payeeName: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getExpenseById(id: string): Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
        };
        payee: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        description: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string | null;
        referenceNo: string | null;
        categoryId: string;
        approvedBy: string | null;
        transactionDate: Date;
        voucherNumber: string | null;
        payeeType: string | null;
        payeeId: string | null;
        payeeName: string | null;
    }>;
    createExpense(dto: CreateExpenseDto, user: any): Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
        };
        payee: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        description: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string | null;
        referenceNo: string | null;
        categoryId: string;
        approvedBy: string | null;
        transactionDate: Date;
        voucherNumber: string | null;
        payeeType: string | null;
        payeeId: string | null;
        payeeName: string | null;
    }>;
    updateExpense(id: string, dto: UpdateExpenseDto): Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
        };
        payee: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        description: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string | null;
        referenceNo: string | null;
        categoryId: string;
        approvedBy: string | null;
        transactionDate: Date;
        voucherNumber: string | null;
        payeeType: string | null;
        payeeId: string | null;
        payeeName: string | null;
    }>;
    deleteExpense(id: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        description: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string | null;
        referenceNo: string | null;
        categoryId: string;
        approvedBy: string | null;
        transactionDate: Date;
        voucherNumber: string | null;
        payeeType: string | null;
        payeeId: string | null;
        payeeName: string | null;
    }>;
    getSalaries(year?: string, month?: string, personId?: string): Promise<({
        person: {
            id: string;
            fullName: string;
            phone: string;
        };
        expense: {
            id: string;
            notes: string | null;
            createdAt: Date;
            createdBy: string | null;
            description: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: string | null;
            referenceNo: string | null;
            categoryId: string;
            approvedBy: string | null;
            transactionDate: Date;
            voucherNumber: string | null;
            payeeType: string | null;
            payeeId: string | null;
            payeeName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        createdBy: string | null;
        status: string;
        personId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        periodMonth: number;
        periodYear: number;
        paidAt: Date | null;
        paymentMethod: string | null;
        expenseId: string | null;
    })[]>;
    getFinanceSummary(year?: string, month?: string): Promise<{
        totalIncome: number;
        totalExpense: number;
        netBalance: number;
        incomeCount: number;
        expenseCount: number;
        incomeByCategory: {
            category: {
                id: string;
                name: string;
                description: string | null;
                isActive: boolean;
            };
            amount: number;
            count: number;
        }[];
        expenseByCategory: {
            category: {
                id: string;
                name: string;
                description: string | null;
                isActive: boolean;
            };
            amount: number;
            count: number;
        }[];
    }>;
    getMonthlyReport(year: string): Promise<{
        year: number;
        monthlyData: {
            month: number;
            income: number;
            expense: number;
            net: number;
        }[];
        totals: {
            income: number;
            expense: number;
            net: number;
        };
    }>;
    getAvailableYears(): Promise<number[]>;
    getRecentTransactions(limit?: string): Promise<({
        type: "income";
        category: {
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
        };
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string | null;
        referenceNo: string | null;
        categoryId: string;
        receiptNumber: string | null;
        sourceType: string | null;
        payerId: string | null;
        payerName: string | null;
        transactionDate: Date;
    } | {
        type: "expense";
        category: {
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
        };
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        description: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string | null;
        referenceNo: string | null;
        categoryId: string;
        approvedBy: string | null;
        transactionDate: Date;
        voucherNumber: string | null;
        payeeType: string | null;
        payeeId: string | null;
        payeeName: string | null;
    })[]>;
}
