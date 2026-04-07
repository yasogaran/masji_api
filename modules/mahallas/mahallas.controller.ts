import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MahallasService } from './mahallas.service';
import { CreateMahallaDto } from './dto/create-mahalla.dto';
import { UpdateMahallaDto } from './dto/update-mahalla.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('mahallas')
export class MahallasController {
  constructor(private mahallasService: MahallasService) {}

  @Get()
  findAll() {
    return this.mahallasService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.mahallasService.findById(id);
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.mahallasService.getStats(id);
  }

  @Get(':id/families')
  getFamilies(@Param('id') id: string) {
    return this.mahallasService.getFamilies(id);
  }

  @Post()
  create(
    @Body() createMahallaDto: CreateMahallaDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.mahallasService.create(createMahallaDto, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMahallaDto: UpdateMahallaDto) {
    return this.mahallasService.update(id, updateMahallaDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.mahallasService.delete(id);
  }
}
