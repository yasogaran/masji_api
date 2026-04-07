import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FamiliesService } from './families.service';
import { UpdateFamilyDto, QueryFamiliesDto } from './dto/families.dto';

/**
 * FamiliesController - Works with Person-based families
 * 
 * In the new schema:
 * - A "family" is implicit: it's defined by the family head
 * - Family heads have familyHeadId = null
 * - Family members have familyHeadId pointing to their family head
 * - To "create" a family, create a person as a Family Head
 * - The family ID is the family head's person ID
 */
@Controller('families')
@UseGuards(JwtAuthGuard)
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Get()
  findAll(@Query() query: QueryFamiliesDto) {
    return this.familiesService.findAll(query);
  }

  @Get('summary')
  getSummary(@Query('mahallaId') mahallaId?: string) {
    return this.familiesService.getSummary(mahallaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.familiesService.findOne(id);
  }

  // Note: Create is removed - families are created implicitly when a person is created as a Family Head
  // Use POST /people with relationshipTypeId = 1 (Family Head) to create a new family

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFamilyDto) {
    return this.familiesService.update(id, dto);
  }

  @Put(':id/eligibility')
  updateEligibility(
    @Param('id') id: string,
    @Body() dto: { isSandaaEligible: boolean; sandaaExemptReason?: string },
  ) {
    return this.familiesService.updateEligibility(
      id,
      dto.isSandaaEligible,
      dto.sandaaExemptReason,
    );
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.familiesService.delete(id);
  }
}
