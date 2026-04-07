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
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  CreateRentalDto,
  ReturnRentalDto,
  InventoryQueryDto,
  AdjustQuantityDto,
} from './dto/inventory.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  // ==================== Items ====================
  @Get()
  findAll(@Query() query: InventoryQueryDto) {
    return this.inventoryService.findAll(query);
  }

  @Get('summary')
  getSummary() {
    return this.inventoryService.getSummary();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.inventoryService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateInventoryItemDto) {
    return this.inventoryService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInventoryItemDto) {
    return this.inventoryService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.inventoryService.delete(id);
  }

  // ==================== Quantity Adjustments ====================
  @Post(':id/adjust')
  adjustQuantity(
    @Param('id') id: string,
    @Body() dto: AdjustQuantityDto,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.adjustQuantity(id, dto, user?.userId);
  }

  @Get(':id/history')
  getTransactionHistory(@Param('id') id: string) {
    return this.inventoryService.getTransactionHistory(id);
  }

  // ==================== Rentals ====================
  @Get('rentals/list')
  getRentals(
    @Query('itemId') itemId?: string,
    @Query('status') status?: string,
  ) {
    return this.inventoryService.getRentals({ itemId, status });
  }

  @Get('rentals/payments')
  getRentalPayments(
    @Query('status') status?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.inventoryService.getRentalPayments({
      status,
      year: year ? parseInt(year) : undefined,
      month: month ? parseInt(month) : undefined,
    });
  }

  @Post('rentals')
  createRental(@Body() dto: CreateRentalDto) {
    return this.inventoryService.createRental(dto);
  }

  @Post('rentals/:id/return')
  returnRental(@Param('id') id: string, @Body() dto: ReturnRentalDto) {
    return this.inventoryService.returnRental(id, dto);
  }

  @Post('rentals/:id/payment')
  recordRentalPayment(
    @Param('id') id: string,
    @Body() dto: { amount: number; notes?: string },
  ) {
    return this.inventoryService.recordRentalPayment(id, dto);
  }

  @Delete('rentals/:id')
  deleteRental(@Param('id') id: string) {
    return this.inventoryService.deleteRental(id);
  }
}
