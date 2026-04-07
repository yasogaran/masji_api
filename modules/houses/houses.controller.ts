import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { HousesService } from './houses.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('houses')
export class HousesController {
  constructor(private housesService: HousesService) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('mahallaId') mahallaId?: string,
    @Query('search') search?: string,
  ) {
    return this.housesService.findAll({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
      mahallaId,
      search,
    });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.housesService.findById(id);
  }

  @Get(':id/members')
  getHouseMembers(@Param('id') id: string) {
    return this.housesService.getHouseMembers(id);
  }

  @Post()
  create(
    @Body() createHouseDto: CreateHouseDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.housesService.create(createHouseDto, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateHouseDto: UpdateHouseDto) {
    return this.housesService.update(id, updateHouseDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.housesService.delete(id);
  }
}
