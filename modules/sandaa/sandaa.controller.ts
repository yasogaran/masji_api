import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SandaaService } from './sandaa.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreateSandaaConfigDto,
  UpdateSandaaConfigDto,
  RecordPaymentDto,
  GeneratePaymentsDto,
  SandaaPaymentQueryDto,
  UpdateFamilyEligibilityDto,
} from './dto/sandaa.dto';

@UseGuards(JwtAuthGuard)
@Controller('sandaa')
export class SandaaController {
  constructor(private sandaaService: SandaaService) {}

  // ============ CONFIG ENDPOINTS ============

  @Get('configs')
  getConfigs(@Query('mahallaId') mahallaId?: string) {
    return this.sandaaService.getConfigs(mahallaId);
  }

  @Get('configs/active')
  getActiveConfig(@Query('mahallaId') mahallaId?: string) {
    return this.sandaaService.getActiveConfig(mahallaId);
  }

  @Post('configs')
  createConfig(@Body() dto: CreateSandaaConfigDto, @CurrentUser() user: any) {
    return this.sandaaService.createConfig(dto, user?.id);
  }

  @Put('configs/:id')
  updateConfig(@Param('id') id: string, @Body() dto: UpdateSandaaConfigDto) {
    return this.sandaaService.updateConfig(id, dto);
  }

  // ============ PAYMENT ENDPOINTS ============

  @Get('payments')
  getPayments(@Query() query: SandaaPaymentQueryDto) {
    return this.sandaaService.getPayments(query);
  }

  @Get('payments/summary')
  getPaymentSummary(
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('mahallaId') mahallaId?: string,
  ) {
    return this.sandaaService.getPaymentSummary(
      Number(month),
      Number(year),
      mahallaId,
    );
  }

  @Get('payments/yearly-summary')
  getYearlySummary(
    @Query('year') year: number,
    @Query('mahallaId') mahallaId?: string,
  ) {
    return this.sandaaService.getYearlySummary(
      Number(year) || new Date().getFullYear(),
      mahallaId,
    );
  }

  @Post('payments/generate')
  generatePayments(@Body() dto: GeneratePaymentsDto, @CurrentUser() user: any) {
    return this.sandaaService.generatePayments(dto, user?.id);
  }

  @Post('payments/record')
  recordPayment(@Body() dto: RecordPaymentDto, @CurrentUser() user: any) {
    return this.sandaaService.recordPayment(dto, user?.id);
  }

  @Post('payments/bulk-record')
  bulkRecordPayments(@Body() body: { paymentIds: string[] }, @CurrentUser() user: any) {
    return this.sandaaService.bulkRecordPayments(body.paymentIds, user?.id);
  }

  @Post('payments/:id/waive')
  waivePayment(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.sandaaService.waivePayment(id, body.reason);
  }

  // ============ ELIGIBILITY ENDPOINTS ============

  @Get('families')
  getEligibleFamilies(@Query('mahallaId') mahallaId?: string) {
    return this.sandaaService.getEligibleFamilies(mahallaId);
  }

  @Get('families/non-eligible')
  getNonEligibleFamilies(
    @Query('mahallaId') mahallaId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.sandaaService.getNonEligibleFamilies({
      mahallaId,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    });
  }

  @Get('families/counts')
  getFamilyCounts(@Query('mahallaId') mahallaId?: string) {
    return this.sandaaService.getFamilyCounts(mahallaId);
  }

  @Put('families/eligibility')
  updateFamilyEligibility(@Body() dto: UpdateFamilyEligibilityDto) {
    return this.sandaaService.updateFamilyEligibility(dto);
  }

  // ============ HISTORY ENDPOINTS ============

  @Get('history/:familyHeadId')
  getFamilyPaymentHistory(@Param('familyHeadId') familyHeadId: string) {
    return this.sandaaService.getFamilyPaymentHistory(familyHeadId);
  }

  // ============ CHECK PAYMENTS GENERATED ============

  @Get('payments/check-generated')
  checkPaymentsGenerated(
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('mahallaId') mahallaId?: string,
  ) {
    return this.sandaaService.checkPaymentsGenerated(
      Number(month),
      Number(year),
      mahallaId,
    );
  }

  // ============ PENDING PAYMENTS FOR FAMILY ============

  @Get('pending/:familyHeadId')
  getPendingPaymentsForFamily(@Param('familyHeadId') familyHeadId: string) {
    return this.sandaaService.getPendingPaymentsForFamily(familyHeadId);
  }

  // ============ RECORD MULTIPLE PAYMENTS ============

  @Post('payments/record-multiple')
  recordMultiplePayments(
    @Body() body: { paymentIds: string[]; notes?: string },
    @CurrentUser() user: any,
  ) {
    return this.sandaaService.recordMultiplePayments(
      body.paymentIds,
      user?.id,
      body.notes,
    );
  }

  // ============ GET ALL CONFIGS BY MAHALLA ============

  @Get('configs/by-mahalla')
  getAllConfigsByMahalla() {
    return this.sandaaService.getAllConfigsByMahalla();
  }

  // ============ GENERATION STATUS ============

  @Get('generation-status')
  getGenerationStatus(@Query('mahallaId') mahallaId?: string) {
    return this.sandaaService.getGenerationStatus(mahallaId);
  }

  // ============ GENERATE UNTIL PREVIOUS MONTH ============

  @Post('payments/generate-until-previous')
  generatePaymentsUntilPreviousMonth(
    @Body() body: { mahallaId?: string },
    @CurrentUser() user: any,
  ) {
    return this.sandaaService.generatePaymentsUntilPreviousMonth(
      body.mahallaId,
      user?.id,
    );
  }

  // ============ CONSOLIDATED FAMILY PAYMENTS ============

  @Get('families/consolidated')
  getConsolidatedFamilyPayments(
    @Query('mahallaId') mahallaId?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.sandaaService.getConsolidatedFamilyPayments({
      mahallaId,
      search,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    });
  }

  // ============ RECORD CUSTOM AMOUNT PAYMENT ============

  @Post('payments/record-custom')
  recordCustomPayment(
    @Body() body: { familyHeadId: string; amount: number; notes?: string },
    @CurrentUser() user: any,
  ) {
    return this.sandaaService.recordCustomPayment(
      body.familyHeadId,
      body.amount,
      user?.id,
      body.notes,
    );
  }
}

