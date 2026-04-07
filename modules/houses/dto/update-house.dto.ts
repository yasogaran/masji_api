import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateHouseDto } from './create-house.dto';

export class UpdateHouseDto extends PartialType(
  OmitType(CreateHouseDto, ['mahallaId'] as const),
) {}

