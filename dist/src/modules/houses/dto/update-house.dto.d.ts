import { CreateHouseDto } from './create-house.dto';
declare const UpdateHouseDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<CreateHouseDto, "mahallaId">>>;
export declare class UpdateHouseDto extends UpdateHouseDto_base {
}
export {};
