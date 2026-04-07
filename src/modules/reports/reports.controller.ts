import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.reportsService.getDashboardStats();
  }

  @Get('payments/summary')
  getPaymentSummary(@Query('year') year: number) {
    return this.reportsService.getPaymentSummary(+year || new Date().getFullYear());
  }

  @Get('financial/summary')
  getFinancialSummary(@Query('year') year: number) {
    return this.reportsService.getFinancialSummary(+year || new Date().getFullYear());
  }

  @Get('charts')
  getChartData() {
    return this.reportsService.getChartData();
  }

  @Get('top-contributors')
  getTopContributors(@Query('limit') limit?: number) {
    return this.reportsService.getTopContributors(+limit || 10);
  }

  @Get('upcoming-meetings')
  getUpcomingMeetings(@Query('limit') limit?: number) {
    return this.reportsService.getUpcomingMeetings(+limit || 5);
  }

  @Get('recent-issues')
  getRecentIssues(@Query('limit') limit?: number) {
    return this.reportsService.getRecentIssues(+limit || 5);
  }
}
