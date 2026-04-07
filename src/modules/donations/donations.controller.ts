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
import { DonationsService } from './donations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreateDonationCategoryDto,
  UpdateDonationCategoryDto,
  CreateDonationDto,
  UpdateDonationDto,
  CreateDistributionDto,
  UpdateDistributionDto,
  DonationQueryDto,
  DistributionQueryDto,
} from './dto/donation.dto';

@UseGuards(JwtAuthGuard)
@Controller('donations')
export class DonationsController {
  constructor(private donationsService: DonationsService) {}

  // ==================== Categories ====================
  @Get('categories')
  getCategories(@Query('includeInactive') includeInactive?: string) {
    return this.donationsService.getCategories(includeInactive === 'true');
  }

  @Get('categories/:id')
  getCategoryById(@Param('id') id: string) {
    return this.donationsService.getCategoryById(id);
  }

  @Post('categories')
  createCategory(@Body() dto: CreateDonationCategoryDto) {
    return this.donationsService.createCategory(dto);
  }

  @Put('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateDonationCategoryDto) {
    return this.donationsService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.donationsService.deleteCategory(id);
  }

  // ==================== Donations (Received) ====================
  @Get()
  getDonations(
    @Query('year') year?: string,
    @Query('type') type?: string,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query: DonationQueryDto = {
      year: year ? parseInt(year) : undefined,
      type,
      categoryId,
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    };
    return this.donationsService.getDonations(query);
  }

  @Get('years')
  getAvailableYears() {
    return this.donationsService.getAvailableYears();
  }

  @Get('summary')
  getDonationsSummary(@Query('year') year?: string) {
    return this.donationsService.getDonationsSummary(year ? parseInt(year) : undefined);
  }

  // ==================== Stock Management ====================
  @Get('stock')
  getAllStock() {
    return this.donationsService.getAllStock();
  }

  @Get('stock/category/:categoryId')
  getStockByCategory(@Param('categoryId') categoryId: string) {
    return this.donationsService.getStockByCategory(categoryId);
  }

  @Get('stock/yearly/:year')
  getYearlyStockSummary(@Param('year') year: string) {
    return this.donationsService.getYearlyStockSummary(parseInt(year));
  }

  @Get(':id')
  getDonationById(@Param('id') id: string) {
    return this.donationsService.getDonationById(id);
  }

  @Post()
  createDonation(@Body() dto: CreateDonationDto, @CurrentUser() user: any) {
    return this.donationsService.createDonation(dto, user?.id);
  }

  @Put(':id')
  updateDonation(@Param('id') id: string, @Body() dto: UpdateDonationDto) {
    return this.donationsService.updateDonation(id, dto);
  }

  @Delete(':id')
  deleteDonation(@Param('id') id: string) {
    return this.donationsService.deleteDonation(id);
  }

  // ==================== Distributions ====================
  @Get('distributions/list')
  getDistributions(
    @Query('year') year?: string,
    @Query('type') type?: string,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query: DistributionQueryDto = {
      year: year ? parseInt(year) : undefined,
      type,
      categoryId,
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    };
    return this.donationsService.getDistributions(query);
  }

  @Get('distributions/summary')
  getDistributionsSummary(@Query('year') year?: string) {
    return this.donationsService.getDistributionsSummary(year ? parseInt(year) : undefined);
  }

  @Get('distributions/:id')
  getDistributionById(@Param('id') id: string) {
    return this.donationsService.getDistributionById(id);
  }

  @Post('distributions')
  createDistribution(@Body() dto: CreateDistributionDto, @CurrentUser() user: any) {
    return this.donationsService.createDistribution(dto, user?.id);
  }

  @Put('distributions/:id')
  updateDistribution(@Param('id') id: string, @Body() dto: UpdateDistributionDto) {
    return this.donationsService.updateDistribution(id, dto);
  }

  @Delete('distributions/:id')
  deleteDistribution(@Param('id') id: string) {
    return this.donationsService.deleteDistribution(id);
  }

  @Post('stock/carry-forward')
  carryForwardStock(
    @Body() dto: { fromYear: number; toYear: number },
    @CurrentUser() user: any,
  ) {
    return this.donationsService.carryForwardStock(dto.fromYear, dto.toYear, user?.id);
  }
}
