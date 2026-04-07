import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
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

@UseGuards(JwtAuthGuard)
@Controller('finance')
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  // ==================== Income Categories ====================
  @Get('income-categories')
  getIncomeCategories(@Query('includeInactive') includeInactive?: string) {
    return this.financeService.getIncomeCategories(includeInactive === 'true');
  }

  @Get('income-categories/:id')
  getIncomeCategoryById(@Param('id') id: string) {
    return this.financeService.getIncomeCategoryById(id);
  }

  @Post('income-categories')
  createIncomeCategory(@Body() dto: CreateIncomeCategoryDto) {
    return this.financeService.createIncomeCategory(dto);
  }

  @Put('income-categories/:id')
  updateIncomeCategory(@Param('id') id: string, @Body() dto: UpdateIncomeCategoryDto) {
    return this.financeService.updateIncomeCategory(id, dto);
  }

  @Delete('income-categories/:id')
  deleteIncomeCategory(@Param('id') id: string) {
    return this.financeService.deleteIncomeCategory(id);
  }

  // ==================== Expense Categories ====================
  @Get('expense-categories')
  getExpenseCategories(@Query('includeInactive') includeInactive?: string) {
    return this.financeService.getExpenseCategories(includeInactive === 'true');
  }

  @Get('expense-categories/:id')
  getExpenseCategoryById(@Param('id') id: string) {
    return this.financeService.getExpenseCategoryById(id);
  }

  @Post('expense-categories')
  createExpenseCategory(@Body() dto: CreateExpenseCategoryDto) {
    return this.financeService.createExpenseCategory(dto);
  }

  @Put('expense-categories/:id')
  updateExpenseCategory(@Param('id') id: string, @Body() dto: UpdateExpenseCategoryDto) {
    return this.financeService.updateExpenseCategory(id, dto);
  }

  @Delete('expense-categories/:id')
  deleteExpenseCategory(@Param('id') id: string) {
    return this.financeService.deleteExpenseCategory(id);
  }

  // ==================== Incomes ====================
  @Get('incomes')
  getIncomes(
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query: FinanceQueryDto = {
      year: year ? parseInt(year) : undefined,
      month: month ? parseInt(month) : undefined,
      categoryId,
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    };
    return this.financeService.getIncomes(query);
  }

  @Get('incomes/:id')
  getIncomeById(@Param('id') id: string) {
    return this.financeService.getIncomeById(id);
  }

  @Post('incomes')
  createIncome(@Body() dto: CreateIncomeDto, @CurrentUser() user: any) {
    return this.financeService.createIncome(dto, user?.id);
  }

  @Put('incomes/:id')
  updateIncome(@Param('id') id: string, @Body() dto: UpdateIncomeDto) {
    return this.financeService.updateIncome(id, dto);
  }

  @Delete('incomes/:id')
  deleteIncome(@Param('id') id: string) {
    return this.financeService.deleteIncome(id);
  }

  // ==================== Expenses ====================
  @Get('expenses')
  getExpenses(
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query: FinanceQueryDto = {
      year: year ? parseInt(year) : undefined,
      month: month ? parseInt(month) : undefined,
      categoryId,
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    };
    return this.financeService.getExpenses(query);
  }

  @Get('expenses/:id')
  getExpenseById(@Param('id') id: string) {
    return this.financeService.getExpenseById(id);
  }

  @Post('expenses')
  createExpense(@Body() dto: CreateExpenseDto, @CurrentUser() user: any) {
    return this.financeService.createExpense(dto, user?.id);
  }

  @Put('expenses/:id')
  updateExpense(@Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.financeService.updateExpense(id, dto);
  }

  @Delete('expenses/:id')
  deleteExpense(@Param('id') id: string) {
    return this.financeService.deleteExpense(id);
  }

  // ==================== Salaries ====================
  @Get('salaries')
  getSalaries(
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('personId') personId?: string,
  ) {
    return this.financeService.getSalaries({
      year: year ? parseInt(year) : undefined,
      month: month ? parseInt(month) : undefined,
      personId,
    });
  }

  // ==================== Reports & Summary ====================
  @Get('summary')
  getFinanceSummary(@Query('year') year?: string, @Query('month') month?: string) {
    return this.financeService.getFinanceSummary(
      year ? parseInt(year) : undefined,
      month ? parseInt(month) : undefined,
    );
  }

  @Get('monthly-report')
  getMonthlyReport(@Query('year') year: string) {
    return this.financeService.getMonthlyReport(parseInt(year) || new Date().getFullYear());
  }

  @Get('years')
  getAvailableYears() {
    return this.financeService.getAvailableYears();
  }

  @Get('recent')
  getRecentTransactions(@Query('limit') limit?: string) {
    return this.financeService.getRecentTransactions(limit ? parseInt(limit) : 10);
  }
}
