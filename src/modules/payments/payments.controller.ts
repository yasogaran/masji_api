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
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreatePaymentTypeDto,
  UpdatePaymentTypeDto,
  CreateOtherPaymentDto,
  UpdateOtherPaymentDto,
  RecordOtherPaymentDto,
  OtherPaymentQueryDto,
} from './dto/payment.dto';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // ============ PAYMENT TYPE ENDPOINTS ============

  @Get('types')
  getPaymentTypes(@Query('includeInactive') includeInactive?: string) {
    return this.paymentsService.getPaymentTypes(includeInactive === 'true');
  }

  @Get('types/:id')
  getPaymentTypeById(@Param('id') id: string) {
    return this.paymentsService.getPaymentTypeById(id);
  }

  @Post('types')
  createPaymentType(@Body() dto: CreatePaymentTypeDto) {
    return this.paymentsService.createPaymentType(dto);
  }

  @Put('types/:id')
  updatePaymentType(@Param('id') id: string, @Body() dto: UpdatePaymentTypeDto) {
    return this.paymentsService.updatePaymentType(id, dto);
  }

  @Delete('types/:id')
  deletePaymentType(@Param('id') id: string) {
    return this.paymentsService.deletePaymentType(id);
  }

  // ============ OTHER PAYMENT ENDPOINTS ============

  @Get()
  getPayments(@Query() query: OtherPaymentQueryDto) {
    return this.paymentsService.getPayments(query);
  }

  @Get('summary')
  getPaymentSummary(
    @Query('paymentTypeId') paymentTypeId?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.paymentsService.getPaymentSummary({
      paymentTypeId,
      year: year ? parseInt(year) : undefined,
      month: month ? parseInt(month) : undefined,
    });
  }

  @Get(':id')
  getPaymentById(@Param('id') id: string) {
    return this.paymentsService.getPaymentById(id);
  }

  @Post()
  createPayment(@Body() dto: CreateOtherPaymentDto) {
    return this.paymentsService.createPayment(dto);
  }

  @Put(':id')
  updatePayment(@Param('id') id: string, @Body() dto: UpdateOtherPaymentDto) {
    return this.paymentsService.updatePayment(id, dto);
  }

  @Post(':id/record')
  recordPayment(
    @Param('id') id: string,
    @Body() body: { notes?: string },
    @CurrentUser() user: any,
  ) {
    return this.paymentsService.recordPayment(
      { paymentId: id, ...body },
      user?.id,
    );
  }

  @Post(':id/cancel')
  cancelPayment(@Param('id') id: string) {
    return this.paymentsService.cancelPayment(id);
  }

  // ============ PERSON PAYMENTS ============

  @Get('person/:personId')
  getPersonPayments(@Param('personId') personId: string) {
    return this.paymentsService.getPersonPayments(personId);
  }
}
