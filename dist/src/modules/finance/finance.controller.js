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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const finance_service_1 = require("./finance.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const finance_dto_1 = require("./dto/finance.dto");
let FinanceController = class FinanceController {
    constructor(financeService) {
        this.financeService = financeService;
    }
    getIncomeCategories(includeInactive) {
        return this.financeService.getIncomeCategories(includeInactive === 'true');
    }
    getIncomeCategoryById(id) {
        return this.financeService.getIncomeCategoryById(id);
    }
    createIncomeCategory(dto) {
        return this.financeService.createIncomeCategory(dto);
    }
    updateIncomeCategory(id, dto) {
        return this.financeService.updateIncomeCategory(id, dto);
    }
    deleteIncomeCategory(id) {
        return this.financeService.deleteIncomeCategory(id);
    }
    getExpenseCategories(includeInactive) {
        return this.financeService.getExpenseCategories(includeInactive === 'true');
    }
    getExpenseCategoryById(id) {
        return this.financeService.getExpenseCategoryById(id);
    }
    createExpenseCategory(dto) {
        return this.financeService.createExpenseCategory(dto);
    }
    updateExpenseCategory(id, dto) {
        return this.financeService.updateExpenseCategory(id, dto);
    }
    deleteExpenseCategory(id) {
        return this.financeService.deleteExpenseCategory(id);
    }
    getIncomes(year, month, categoryId, search, page, limit) {
        const query = {
            year: year ? parseInt(year) : undefined,
            month: month ? parseInt(month) : undefined,
            categoryId,
            search,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        };
        return this.financeService.getIncomes(query);
    }
    getIncomeById(id) {
        return this.financeService.getIncomeById(id);
    }
    createIncome(dto, user) {
        return this.financeService.createIncome(dto, user?.id);
    }
    updateIncome(id, dto) {
        return this.financeService.updateIncome(id, dto);
    }
    deleteIncome(id) {
        return this.financeService.deleteIncome(id);
    }
    getExpenses(year, month, categoryId, search, page, limit) {
        const query = {
            year: year ? parseInt(year) : undefined,
            month: month ? parseInt(month) : undefined,
            categoryId,
            search,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        };
        return this.financeService.getExpenses(query);
    }
    getExpenseById(id) {
        return this.financeService.getExpenseById(id);
    }
    createExpense(dto, user) {
        return this.financeService.createExpense(dto, user?.id);
    }
    updateExpense(id, dto) {
        return this.financeService.updateExpense(id, dto);
    }
    deleteExpense(id) {
        return this.financeService.deleteExpense(id);
    }
    getSalaries(year, month, personId) {
        return this.financeService.getSalaries({
            year: year ? parseInt(year) : undefined,
            month: month ? parseInt(month) : undefined,
            personId,
        });
    }
    getFinanceSummary(year, month) {
        return this.financeService.getFinanceSummary(year ? parseInt(year) : undefined, month ? parseInt(month) : undefined);
    }
    getMonthlyReport(year) {
        return this.financeService.getMonthlyReport(parseInt(year) || new Date().getFullYear());
    }
    getAvailableYears() {
        return this.financeService.getAvailableYears();
    }
    getRecentTransactions(limit) {
        return this.financeService.getRecentTransactions(limit ? parseInt(limit) : 10);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)('income-categories'),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getIncomeCategories", null);
__decorate([
    (0, common_1.Get)('income-categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getIncomeCategoryById", null);
__decorate([
    (0, common_1.Post)('income-categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [finance_dto_1.CreateIncomeCategoryDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createIncomeCategory", null);
__decorate([
    (0, common_1.Put)('income-categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, finance_dto_1.UpdateIncomeCategoryDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateIncomeCategory", null);
__decorate([
    (0, common_1.Delete)('income-categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "deleteIncomeCategory", null);
__decorate([
    (0, common_1.Get)('expense-categories'),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getExpenseCategories", null);
__decorate([
    (0, common_1.Get)('expense-categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getExpenseCategoryById", null);
__decorate([
    (0, common_1.Post)('expense-categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [finance_dto_1.CreateExpenseCategoryDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createExpenseCategory", null);
__decorate([
    (0, common_1.Put)('expense-categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, finance_dto_1.UpdateExpenseCategoryDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateExpenseCategory", null);
__decorate([
    (0, common_1.Delete)('expense-categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "deleteExpenseCategory", null);
__decorate([
    (0, common_1.Get)('incomes'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('categoryId')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getIncomes", null);
__decorate([
    (0, common_1.Get)('incomes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getIncomeById", null);
__decorate([
    (0, common_1.Post)('incomes'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [finance_dto_1.CreateIncomeDto, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createIncome", null);
__decorate([
    (0, common_1.Put)('incomes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, finance_dto_1.UpdateIncomeDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateIncome", null);
__decorate([
    (0, common_1.Delete)('incomes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "deleteIncome", null);
__decorate([
    (0, common_1.Get)('expenses'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('categoryId')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getExpenses", null);
__decorate([
    (0, common_1.Get)('expenses/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getExpenseById", null);
__decorate([
    (0, common_1.Post)('expenses'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [finance_dto_1.CreateExpenseDto, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Put)('expenses/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, finance_dto_1.UpdateExpenseDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateExpense", null);
__decorate([
    (0, common_1.Delete)('expenses/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "deleteExpense", null);
__decorate([
    (0, common_1.Get)('salaries'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('personId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getSalaries", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getFinanceSummary", null);
__decorate([
    (0, common_1.Get)('monthly-report'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getMonthlyReport", null);
__decorate([
    (0, common_1.Get)('years'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getAvailableYears", null);
__decorate([
    (0, common_1.Get)('recent'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getRecentTransactions", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('finance'),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map