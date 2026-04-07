import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { KurbaanService } from './kurbaan.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreateKurbaanPeriodDto,
  UpdateKurbaanPeriodDto,
  CreateKurbaanParticipantDto,
  BulkCreateParticipantsDto,
  RegisterAllFamiliesDto,
  MarkDistributedDto,
  KurbaanParticipantQueryDto,
} from './dto/kurbaan.dto';

@UseGuards(JwtAuthGuard)
@Controller('kurbaan')
export class KurbaanController {
  constructor(private kurbaanService: KurbaanService) {}

  // ==================
  // PERIOD ENDPOINTS
  // ==================

  @Get('periods')
  getPeriods(
    @Query('isActive') isActive?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.kurbaanService.getPeriods({
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get('periods/active')
  getActivePeriod() {
    return this.kurbaanService.getActivePeriod();
  }

  @Get('periods/:id')
  getPeriodById(@Param('id') id: string) {
    return this.kurbaanService.getPeriodById(id);
  }

  @Get('periods/:id/report')
  getPeriodReport(@Param('id') id: string) {
    return this.kurbaanService.getPeriodReport(id);
  }

  @Get('periods/:id/cards')
  getParticipantsForCards(
    @Param('id') id: string,
    @Query('mahallaId') mahallaId?: string,
    @Query('filterType') filterType?: string, // 'external' or undefined for all/mahalla
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.kurbaanService.getParticipantsForCards(
      id, 
      mahallaId, 
      filterType,
      page ? parseInt(page) : undefined,
      limit ? parseInt(limit) : undefined,
    );
  }

  @Post('periods')
  createPeriod(
    @Body() dto: CreateKurbaanPeriodDto,
    @CurrentUser() user: any,
  ) {
    return this.kurbaanService.createPeriod(dto, user?.id);
  }

  @Put('periods/:id')
  updatePeriod(@Param('id') id: string, @Body() dto: UpdateKurbaanPeriodDto) {
    return this.kurbaanService.updatePeriod(id, dto);
  }

  @Post('periods/:id/complete')
  completePeriod(@Param('id') id: string) {
    return this.kurbaanService.completePeriod(id);
  }

  @Delete('periods/:id')
  deletePeriod(@Param('id') id: string) {
    return this.kurbaanService.deletePeriod(id);
  }

  // ========================
  // PARTICIPANT ENDPOINTS
  // ========================

  @Get('participants')
  getParticipants(
    @Query('kurbaanPeriodId') kurbaanPeriodId?: string,
    @Query('mahallaId') mahallaId?: string,
    @Query('isDistributed') isDistributed?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query: KurbaanParticipantQueryDto = {
      kurbaanPeriodId,
      mahallaId,
      isDistributed: isDistributed !== undefined ? isDistributed === 'true' : undefined,
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    };
    return this.kurbaanService.getParticipants(query);
  }

  @Get('participants/:id')
  getParticipantById(@Param('id') id: string) {
    return this.kurbaanService.getParticipantById(id);
  }

  @Post('participants')
  createParticipant(
    @Body() dto: CreateKurbaanParticipantDto,
    @CurrentUser() user: any,
  ) {
    return this.kurbaanService.createParticipant(dto, user?.id);
  }

  @Post('participants/bulk')
  bulkCreateParticipants(
    @Body() dto: BulkCreateParticipantsDto,
    @CurrentUser() user: any,
  ) {
    return this.kurbaanService.bulkCreateParticipants(dto, user?.id);
  }

  @Post('participants/register-all')
  registerAllFamilies(
    @Body() dto: RegisterAllFamiliesDto,
    @CurrentUser() user: any,
  ) {
    return this.kurbaanService.registerAllFamilies(dto, user?.id);
  }

  @Post('participants/:id/distribute')
  markDistributed(
    @Param('id') id: string,
    @Body() dto: MarkDistributedDto,
    @CurrentUser() user: any,
  ) {
    return this.kurbaanService.markDistributed(id, dto, user?.id);
  }

  @Post('participants/distribute-by-qr')
  markDistributedByQR(@Body('qrCode') qrCode: string, @CurrentUser() user: any) {
    return this.kurbaanService.markDistributedByQR(qrCode, user?.id);
  }

  @Delete('participants/:id')
  deleteParticipant(@Param('id') id: string) {
    return this.kurbaanService.deleteParticipant(id);
  }
}
