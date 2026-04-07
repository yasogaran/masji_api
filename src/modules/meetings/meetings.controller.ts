import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import {
  CreateMeetingDto,
  UpdateMeetingDto,
  CreateDecisionDto,
  MeetingQueryDto,
} from './dto/meetings.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('meetings')
export class MeetingsController {
  constructor(private meetingsService: MeetingsService) {}

  @Get()
  findAll(@Query() query: MeetingQueryDto) {
    return this.meetingsService.findAll(query);
  }

  @Get('summary')
  getSummary() {
    return this.meetingsService.getSummary();
  }

  @Get('calendar/:year/:month')
  getCalendarMeetings(
    @Param('year') year: string,
    @Param('month') month: string,
  ) {
    return this.meetingsService.getCalendarMeetings(
      parseInt(year),
      parseInt(month),
    );
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.meetingsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateMeetingDto, @CurrentUser() user: any) {
    return this.meetingsService.create(dto, user?.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMeetingDto) {
    return this.meetingsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.meetingsService.delete(id);
  }

  // ==================== Decisions ====================
  @Post(':id/decisions')
  addDecision(@Param('id') id: string, @Body() dto: CreateDecisionDto) {
    return this.meetingsService.addDecision(id, dto);
  }

  @Put('decisions/:decisionId')
  updateDecision(
    @Param('decisionId') decisionId: string,
    @Body() dto: CreateDecisionDto,
  ) {
    return this.meetingsService.updateDecision(decisionId, dto);
  }

  @Delete('decisions/:decisionId')
  removeDecision(@Param('decisionId') decisionId: string) {
    return this.meetingsService.removeDecision(decisionId);
  }
}
