export declare enum PaymentMethod {
    CASH = "cash",
    BANK_TRANSFER = "bank_transfer",
    CHEQUE = "cheque",
    ONLINE = "online"
}
export declare class CreateIncomeCategoryDto {
    name: string;
    description?: string;
    isActive?: boolean;
}
export declare class UpdateIncomeCategoryDto {
    name?: string;
    description?: string;
    isActive?: boolean;
}
export declare class CreateExpenseCategoryDto {
    name: string;
    description?: string;
    isActive?: boolean;
}
export declare class UpdateExpenseCategoryDto {
    name?: string;
    description?: string;
    isActive?: boolean;
}
export declare class CreateIncomeDto {
    receiptNumber?: string;
    categoryId: string;
    amount: number;
    sourceType?: string;
    payerId?: string;
    payerName?: string;
    description?: string;
    transactionDate: string;
    paymentMethod?: PaymentMethod;
    referenceNo?: string;
    notes?: string;
}
export declare class UpdateIncomeDto {
    receiptNumber?: string;
    categoryId?: string;
    amount?: number;
    sourceType?: string;
    payerId?: string;
    payerName?: string;
    description?: string;
    transactionDate?: string;
    paymentMethod?: PaymentMethod;
    referenceNo?: string;
    notes?: string;
}
export declare class CreateExpenseDto {
    voucherNumber?: string;
    categoryId: string;
    amount: number;
    payeeType?: string;
    payeeId?: string;
    payeeName?: string;
    description: string;
    transactionDate: string;
    paymentMethod?: PaymentMethod;
    referenceNo?: string;
    approvedBy?: string;
    notes?: string;
}
export declare class UpdateExpenseDto {
    voucherNumber?: string;
    categoryId?: string;
    amount?: number;
    payeeType?: string;
    payeeId?: string;
    payeeName?: string;
    description?: string;
    transactionDate?: string;
    paymentMethod?: PaymentMethod;
    referenceNo?: string;
    approvedBy?: string;
    notes?: string;
}
export declare class FinanceQueryDto {
    year?: number;
    month?: number;
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
}
export declare class FinanceReportDto {
    year?: number;
    month?: number;
}
