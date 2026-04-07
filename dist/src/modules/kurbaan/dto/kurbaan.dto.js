"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KurbaanReportDto = exports.KurbaanParticipantQueryDto = exports.MarkDistributedDto = exports.RegisterAllFamiliesDto = exports.BulkCreateParticipantsDto = exports.CreateKurbaanParticipantDto = exports.KurbaanPeriodQueryDto = exports.UpdateKurbaanPeriodDto = exports.CreateKurbaanPeriodDto = void 0;
const class_validator_1 = require("class-validator");
class CreateKurbaanPeriodDto {
}
exports.CreateKurbaanPeriodDto = CreateKurbaanPeriodDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKurbaanPeriodDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateKurbaanPeriodDto.prototype, "hijriYear", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateKurbaanPeriodDto.prototype, "gregorianDate", void 0);
class UpdateKurbaanPeriodDto {
}
exports.UpdateKurbaanPeriodDto = UpdateKurbaanPeriodDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKurbaanPeriodDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateKurbaanPeriodDto.prototype, "hijriYear", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateKurbaanPeriodDto.prototype, "gregorianDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateKurbaanPeriodDto.prototype, "isActive", void 0);
class KurbaanPeriodQueryDto {
}
exports.KurbaanPeriodQueryDto = KurbaanPeriodQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], KurbaanPeriodQueryDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], KurbaanPeriodQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], KurbaanPeriodQueryDto.prototype, "limit", void 0);
class CreateKurbaanParticipantDto {
}
exports.CreateKurbaanParticipantDto = CreateKurbaanParticipantDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateKurbaanParticipantDto.prototype, "kurbaanPeriodId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateKurbaanParticipantDto.prototype, "familyHeadId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateKurbaanParticipantDto.prototype, "isExternal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKurbaanParticipantDto.prototype, "externalName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKurbaanParticipantDto.prototype, "externalPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKurbaanParticipantDto.prototype, "externalAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateKurbaanParticipantDto.prototype, "externalPeopleCount", void 0);
class BulkCreateParticipantsDto {
}
exports.BulkCreateParticipantsDto = BulkCreateParticipantsDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BulkCreateParticipantsDto.prototype, "kurbaanPeriodId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], BulkCreateParticipantsDto.prototype, "familyHeadIds", void 0);
class RegisterAllFamiliesDto {
}
exports.RegisterAllFamiliesDto = RegisterAllFamiliesDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RegisterAllFamiliesDto.prototype, "kurbaanPeriodId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RegisterAllFamiliesDto.prototype, "mahallaId", void 0);
class MarkDistributedDto {
}
exports.MarkDistributedDto = MarkDistributedDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MarkDistributedDto.prototype, "notes", void 0);
class KurbaanParticipantQueryDto {
}
exports.KurbaanParticipantQueryDto = KurbaanParticipantQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], KurbaanParticipantQueryDto.prototype, "kurbaanPeriodId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], KurbaanParticipantQueryDto.prototype, "mahallaId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], KurbaanParticipantQueryDto.prototype, "isDistributed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KurbaanParticipantQueryDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], KurbaanParticipantQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], KurbaanParticipantQueryDto.prototype, "limit", void 0);
class KurbaanReportDto {
}
exports.KurbaanReportDto = KurbaanReportDto;
//# sourceMappingURL=kurbaan.dto.js.map