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
import { IssuesService } from './issues.service';
import {
  CreateIssueDto,
  UpdateIssueDto,
  ResolveIssueDto,
  IssueQueryDto,
} from './dto/issues.dto';

@Controller('issues')
export class IssuesController {
  constructor(private issuesService: IssuesService) {}

  @Get()
  findAll(@Query() query: IssueQueryDto) {
    return this.issuesService.findAll(query);
  }

  @Get('summary')
  getSummary() {
    return this.issuesService.getSummary();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.issuesService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateIssueDto) {
    return this.issuesService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIssueDto) {
    return this.issuesService.update(id, dto);
  }

  @Post(':id/resolve')
  resolve(@Param('id') id: string, @Body() dto: ResolveIssueDto) {
    return this.issuesService.resolve(id, dto);
  }

  @Post(':id/reopen')
  reopen(@Param('id') id: string) {
    return this.issuesService.reopen(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.issuesService.delete(id);
  }
}
