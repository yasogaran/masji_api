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
exports.UpdateFamilyEligibilityDto = exports.SandaaPaymentQueryDto = exports.GeneratePaymentsDto = exports.BulkRecordPaymentsDto = exports.RecordPaymentDto = exports.UpdateSandaaConfigDto = exports.CreateSandaaConfigDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateSandaaConfigDto {
    constructor() {
        this.frequency = 'monthly';
        this.whoPays = 'family_head';
    }
}
exports.CreateSandaaConfigDto = CreateSandaaConfigDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSandaaConfigDto.prototype, "mahallaId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSandaaConfigDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['monthly', 'annually']),
    __metadata("design:type", String)
], CreateSandaaConfigDto.prototype, "frequency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['family_head', 'all_adults']),
    __metadata("design:type", String)
], CreateSandaaConfigDto.prototype, "whoPays", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSandaaConfigDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSandaaConfigDto.prototype, "effectiveTo", void 0);
class UpdateSandaaConfigDto {
}
exports.UpdateSandaaConfigDto = UpdateSandaaConfigDto;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSandaaConfigDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['monthly', 'annually']),
    __metadata("design:type", String)
], UpdateSandaaConfigDto.prototype, "frequency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateSandaaConfigDto.prototype, "effectiveTo", void 0);
class RecordPaymentDto {
}
exports.RecordPaymentDto = RecordPaymentDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RecordPaymentDto.prototype, "paymentId", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RecordPaymentDto.prototype, "paidAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordPaymentDto.prototype, "notes", void 0);
class BulkRecordPaymentsDto {
}
exports.BulkRecordPaymentsDto = BulkRecordPaymentsDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], BulkRecordPaymentsDto.prototype, "payments", void 0);
class GeneratePaymentsDto {
}
exports.GeneratePaymentsDto = GeneratePaymentsDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], GeneratePaymentsDto.prototype, "month", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    __metadata("design:type", Number)
], GeneratePaymentsDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GeneratePaymentsDto.prototype, "mahallaId", void 0);
class SandaaPaymentQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 50;
    }
}
exports.SandaaPaymentQueryDto = SandaaPaymentQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SandaaPaymentQueryDto.prototype, "mahallaId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SandaaPaymentQueryDto.prototype, "familyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['pending', 'paid', 'partial', 'waived']),
    __metadata("design:type", String)
], SandaaPaymentQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], SandaaPaymentQueryDto.prototype, "month", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    __metadata("design:type", Number)
], SandaaPaymentQueryDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SandaaPaymentQueryDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SandaaPaymentQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SandaaPaymentQueryDto.prototype, "limit", void 0);
class UpdateFamilyEligibilityDto {
}
exports.UpdateFamilyEligibilityDto = UpdateFamilyEligibilityDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateFamilyEligibilityDto.prototype, "familyId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFamilyEligibilityDto.prototype, "isSandaaEligible", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFamilyEligibilityDto.prototype, "sandaaExemptReason", void 0);
//# sourceMappingURL=sandaa.dto.js.map