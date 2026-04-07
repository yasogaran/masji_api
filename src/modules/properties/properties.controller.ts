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
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CreatePropertyDto,
  UpdatePropertyDto,
  CreatePropertyRentalDto,
  UpdatePropertyRentalDto,
  CreateRentPaymentDto,
  PropertyQueryDto,
} from './dto/properties.dto';

@UseGuards(JwtAuthGuard)
@Controller('properties')
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}

  // ==================== Properties ====================
  @Get()
  findAll(@Query() query: PropertyQueryDto) {
    return this.propertiesService.findAll(query);
  }

  @Get('summary')
  getSummary() {
    return this.propertiesService.getSummary();
  }

  @Get('years')
  getAvailableYears() {
    return this.propertiesService.getAvailableYears();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.propertiesService.findById(id);
  }

  @Post()
  create(@Body() dto: CreatePropertyDto) {
    return this.propertiesService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePropertyDto) {
    return this.propertiesService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.propertiesService.delete(id);
  }

  // ==================== Rentals ====================
  @Get('rentals/list')
  getRentals(
    @Query('propertyId') propertyId?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.propertiesService.getRentals({
      propertyId,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Post('rentals')
  createRental(@Body() dto: CreatePropertyRentalDto) {
    return this.propertiesService.createRental(dto);
  }

  @Put('rentals/:id')
  updateRental(@Param('id') id: string, @Body() dto: UpdatePropertyRentalDto) {
    return this.propertiesService.updateRental(id, dto);
  }

  @Post('rentals/:id/end')
  endRental(@Param('id') id: string, @Body('endDate') endDate: string) {
    return this.propertiesService.endRental(id, endDate);
  }

  @Delete('rentals/:id')
  deleteRental(@Param('id') id: string) {
    return this.propertiesService.deleteRental(id);
  }

  // ==================== Rent Payments ====================
  @Get('rentals/:id/payments')
  getRentPayments(@Param('id') id: string) {
    return this.propertiesService.getRentPayments(id);
  }

  @Get('payments/all')
  getAllRentPayments(
    @Query('status') status?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.propertiesService.getAllRentPayments({
      status,
      year: year ? parseInt(year) : undefined,
      month: month ? parseInt(month) : undefined,
    });
  }

  @Post('payments')
  createRentPayment(@Body() dto: CreateRentPaymentDto) {
    return this.propertiesService.createRentPayment(dto);
  }

  @Post('payments/:id/mark-paid')
  markPaymentAsPaid(
    @Param('id') id: string,
    @Body('notes') notes?: string,
  ) {
    return this.propertiesService.markPaymentAsPaid(id, notes);
  }

  @Post('payments/generate')
  generatePendingPayments(
    @Body('year') year: number,
    @Body('month') month: number,
  ) {
    return this.propertiesService.generatePendingPayments(year, month);
  }

  @Delete('payments/:id')
  deleteRentPayment(@Param('id') id: string) {
    return this.propertiesService.deleteRentPayment(id);
  }
}
