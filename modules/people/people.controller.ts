import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('people')
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('mahallaId') mahallaId?: string,
    @Query('houseId') houseId?: string,
    @Query('status') status?: number,
  ) {
    return this.peopleService.findAll({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
      search,
      mahallaId,
      houseId,
      status: status ? +status : undefined,
    });
  }

  @Get('lookups')
  getLookups() {
    return this.peopleService.getLookups();
  }

  @Get('family-heads')
  getFamilyHeads(@Query('mahallaId') mahallaId?: string) {
    return this.peopleService.getFamilyHeads(mahallaId);
  }

  @Get('by-nic/:nic')
  findByNic(@Param('nic') nic: string) {
    return this.peopleService.findByNic(nic);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.peopleService.findById(id);
  }

  @Post()
  create(
    @Body() createPersonDto: CreatePersonDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.peopleService.create(createPersonDto, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.peopleService.update(id, updatePersonDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.peopleService.delete(id);
  }
}
