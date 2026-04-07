import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ZakathService } from './zakath.service';
import {
  CreateZakathCategoryDto,
  UpdateZakathCategoryDto,
  CreateZakathPeriodDto,
  UpdateZakathPeriodDto,
  CreateZakathCollectionDto,
  UpdateZakathCollectionDto,
  CreateZakathRequestDto,
  UpdateZakathRequestDto,
  ApproveRequestDto,
  RejectRequestDto,
  CreateZakathDistributionDto,
  ZakathPeriodQueryDto,
  ZakathCollectionQueryDto,
  ZakathRequestQueryDto,
  CompleteCycleDto,
} from './dto/zakath.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('zakath')
@UseGuards(JwtAuthGuard)
export class ZakathController {
  constructor(private readonly zakathService: ZakathService) {}

  // ==================== Categories ====================
  @Get('categories')
  async getCategories() {
    return this.zakathService.getCategories();
  }

  @Get('categories/all')
  async getAllCategories() {
    return this.zakathService.getAllCategories();
  }

  @Get('categories/:id')
  async getCategoryById(@Param('id') id: string) {
    return this.zakathService.getCategoryById(id);
  }

  @Post('categories')
  async createCategory(@Body() dto: CreateZakathCategoryDto) {
    return this.zakathService.createCategory(dto);
  }

  @Put('categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateZakathCategoryDto,
  ) {
    return this.zakathService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.zakathService.deleteCategory(id);
  }

  // ==================== Periods/Cycles ====================
  @Get('periods')
  async getPeriods(@Query() query: ZakathPeriodQueryDto) {
    return this.zakathService.getPeriods(query);
  }

  @Get('periods/active')
  async getActivePeriod() {
    return this.zakathService.getActivePeriod();
  }

  @Get('periods/:id')
  async getPeriodById(@Param('id') id: string) {
    return this.zakathService.getPeriodById(id);
  }

  @Post('periods')
  async createPeriod(
    @Body() dto: CreateZakathPeriodDto,
    @CurrentUser() user: any,
  ) {
    return this.zakathService.createPeriod(dto, user?.id);
  }

  @Put('periods/:id')
  async updatePeriod(
    @Param('id') id: string,
    @Body() dto: UpdateZakathPeriodDto,
  ) {
    return this.zakathService.updatePeriod(id, dto);
  }

  @Post('periods/:id/complete')
  async completeCycle(
    @Param('id') id: string,
    @Body() dto: CompleteCycleDto,
    @CurrentUser() user: any,
  ) {
    return this.zakathService.completeCycle(id, user?.id);
  }

  @Delete('periods/:id')
  async deletePeriod(@Param('id') id: string) {
    return this.zakathService.deletePeriod(id);
  }

  // ==================== Collections ====================
  @Get('collections')
  async getCollections(@Query() query: ZakathCollectionQueryDto) {
    return this.zakathService.getCollections(query);
  }

  @Get('collections/:id')
  async getCollectionById(@Param('id') id: string) {
    return this.zakathService.getCollectionById(id);
  }

  @Post('collections')
  async createCollection(
    @Body() dto: CreateZakathCollectionDto,
    @CurrentUser() user: any,
  ) {
    return this.zakathService.createCollection(dto, user?.id);
  }

  @Put('collections/:id')
  async updateCollection(
    @Param('id') id: string,
    @Body() dto: UpdateZakathCollectionDto,
  ) {
    return this.zakathService.updateCollection(id, dto);
  }

  @Delete('collections/:id')
  async deleteCollection(@Param('id') id: string) {
    return this.zakathService.deleteCollection(id);
  }

  // ==================== Requests ====================
  @Get('requests')
  async getRequests(@Query() query: ZakathRequestQueryDto) {
    return this.zakathService.getRequests(query);
  }

  @Get('requests/:id')
  async getRequestById(@Param('id') id: string) {
    return this.zakathService.getRequestById(id);
  }

  @Post('requests')
  async createRequest(@Body() dto: CreateZakathRequestDto) {
    return this.zakathService.createRequest(dto);
  }

  @Put('requests/:id')
  async updateRequest(
    @Param('id') id: string,
    @Body() dto: UpdateZakathRequestDto,
  ) {
    return this.zakathService.updateRequest(id, dto);
  }

  @Post('requests/:id/approve')
  async approveRequest(
    @Param('id') id: string,
    @Body() dto: ApproveRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.zakathService.approveRequest(id, dto, user?.id);
  }

  @Post('requests/:id/reject')
  async rejectRequest(
    @Param('id') id: string,
    @Body() dto: RejectRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.zakathService.rejectRequest(id, dto, user?.id);
  }

  @Delete('requests/:id')
  async deleteRequest(@Param('id') id: string) {
    return this.zakathService.deleteRequest(id);
  }

  // ==================== Distributions ====================
  @Post('distributions')
  async createDistribution(
    @Body() dto: CreateZakathDistributionDto,
    @CurrentUser() user: any,
  ) {
    return this.zakathService.createDistribution(dto, user?.id);
  }

  @Get('distributions/:id')
  async getDistributionById(@Param('id') id: string) {
    return this.zakathService.getDistributionById(id);
  }

  // ==================== Reports ====================
  @Get('reports/period/:id')
  async getPeriodReport(@Param('id') id: string) {
    return this.zakathService.getPeriodReport(id);
  }

  @Get('reports/overall')
  async getOverallReport() {
    return this.zakathService.getOverallReport();
  }
}
