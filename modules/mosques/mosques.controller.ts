import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MosquesService } from './mosques.service';
import { CreateMosqueDto } from './dto/create-mosque.dto';
import { UpdateMosqueDto } from './dto/update-mosque.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('mosques')
export class MosquesController {
  constructor(private mosquesService: MosquesService) {}

  @Get()
  findAll() {
    return this.mosquesService.findAll();
  }

  @Get('parent')
  getParentMosque() {
    return this.mosquesService.getParentMosque();
  }

  @Get('roles')
  getRoles() {
    return this.mosquesService.getRoles();
  }

  @Post('roles')
  createRole(@Body() data: { roleName: string; description?: string }) {
    return this.mosquesService.createRole(data);
  }

  @Put('roles/:id')
  updateRole(
    @Param('id') id: string,
    @Body() data: { roleName?: string; description?: string; isActive?: boolean },
  ) {
    return this.mosquesService.updateRole(id, data);
  }

  @Delete('roles/:id')
  deleteRole(@Param('id') id: string) {
    return this.mosquesService.deleteRole(id);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.mosquesService.findById(id);
  }

  @Get(':id/assignments')
  getRoleAssignments(@Param('id') id: string) {
    return this.mosquesService.getRoleAssignments(id);
  }

  @Post(':id/assignments')
  addRoleAssignment(
    @Param('id') mosqueId: string,
    @Body() data: { personId: string; mosqueRoleId: string; startDate: string; endDate?: string },
  ) {
    return this.mosquesService.addRoleAssignment({ ...data, mosqueId });
  }

  @Put('assignments/:id')
  updateRoleAssignment(@Param('id') id: string, @Body() data: { endDate?: string }) {
    return this.mosquesService.updateRoleAssignment(id, data);
  }

  @Delete('assignments/:id')
  removeRoleAssignment(@Param('id') id: string) {
    return this.mosquesService.removeRoleAssignment(id);
  }

  @Post()
  create(
    @Body() createMosqueDto: CreateMosqueDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.mosquesService.create(createMosqueDto, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMosqueDto: UpdateMosqueDto) {
    return this.mosquesService.update(id, updateMosqueDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.mosquesService.delete(id);
  }
}
