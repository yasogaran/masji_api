import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  // Roles
  @Get('roles')
  getRoles() {
    return this.boardService.getRoles();
  }

  @Post('roles')
  createRole(@Body() data: { roleName: string; description?: string; sortOrder?: number }) {
    return this.boardService.createRole(data);
  }

  @Put('roles/:id')
  updateRole(
    @Param('id') id: string,
    @Body() data: { roleName?: string; description?: string; sortOrder?: number; isActive?: boolean },
  ) {
    return this.boardService.updateRole(id, data);
  }

  @Delete('roles/:id')
  deleteRole(@Param('id') id: string) {
    return this.boardService.deleteRole(id);
  }

  // Terms
  @Get('terms')
  getTerms() {
    return this.boardService.getTerms();
  }

  @Get('terms/current')
  getCurrentTerm() {
    return this.boardService.getCurrentTerm();
  }

  @Get('terms/:id')
  getTermById(@Param('id') id: string) {
    return this.boardService.getTermById(id);
  }

  @Post('terms')
  createTerm(@Body() data: { name: string; startDate: string; endDate?: string; isCurrent?: boolean }) {
    return this.boardService.createTerm(data);
  }

  @Put('terms/:id')
  updateTerm(
    @Param('id') id: string,
    @Body() data: { name?: string; startDate?: string; endDate?: string; isCurrent?: boolean },
  ) {
    return this.boardService.updateTerm(id, data);
  }

  @Delete('terms/:id')
  deleteTerm(@Param('id') id: string) {
    return this.boardService.deleteTerm(id);
  }

  // Members
  @Get('terms/:id/members')
  getMembers(@Param('id') id: string) {
    return this.boardService.getMembers(id);
  }

  @Post('members')
  addMember(@Body() data: {
    boardTermId: string;
    personId: string;
    boardRoleId: string;
    mahallaId?: string;
    startDate: string;
    endDate?: string;
  }) {
    return this.boardService.addMember(data);
  }

  @Put('members/:id')
  updateMember(
    @Param('id') id: string,
    @Body() data: { boardRoleId?: string; mahallaId?: string; startDate?: string; endDate?: string },
  ) {
    return this.boardService.updateMember(id, data);
  }

  @Delete('members/:id')
  removeMember(@Param('id') id: string) {
    return this.boardService.removeMember(id);
  }
}

