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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandaaController = void 0;
const common_1 = require("@nestjs/common");
const sandaa_service_1 = require("./sandaa.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const sandaa_dto_1 = require("./dto/sandaa.dto");
let SandaaController = class SandaaController {
    constructor(sandaaService) {
        this.sandaaService = sandaaService;
    }
    getConfigs(mahallaId) {
        return this.sandaaService.getConfigs(mahallaId);
    }
    getActiveConfig(mahallaId) {
        return this.sandaaService.getActiveConfig(mahallaId);
    }
    createConfig(dto, user) {
        return this.sandaaService.createConfig(dto, user?.id);
    }
    updateConfig(id, dto) {
        return this.sandaaService.updateConfig(id, dto);
    }
    getPayments(query) {
        return this.sandaaService.getPayments(query);
    }
    getPaymentSummary(month, year, mahallaId) {
        return this.sandaaService.getPaymentSummary(Number(month), Number(year), mahallaId);
    }
    getYearlySummary(year, mahallaId) {
        return this.sandaaService.getYearlySummary(Number(year) || new Date().getFullYear(), mahallaId);
    }
    generatePayments(dto, user) {
        return this.sandaaService.generatePayments(dto, user?.id);
    }
    recordPayment(dto, user) {
        return this.sandaaService.recordPayment(dto, user?.id);
    }
    bulkRecordPayments(body, user) {
        return this.sandaaService.bulkRecordPayments(body.paymentIds, user?.id);
    }
    waivePayment(id, body) {
        return this.sandaaService.waivePayment(id, body.reason);
    }
    getEligibleFamilies(mahallaId) {
        return this.sandaaService.getEligibleFamilies(mahallaId);
    }
    getNonEligibleFamilies(mahallaId, page, limit) {
        return this.sandaaService.getNonEligibleFamilies({
            mahallaId,
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 50,
        });
    }
    getFamilyCounts(mahallaId) {
        return this.sandaaService.getFamilyCounts(mahallaId);
    }
    updateFamilyEligibility(dto) {
        return this.sandaaService.updateFamilyEligibility(dto);
    }
    getFamilyPaymentHistory(familyHeadId) {
        return this.sandaaService.getFamilyPaymentHistory(familyHeadId);
    }
    checkPaymentsGenerated(month, year, mahallaId) {
        return this.sandaaService.checkPaymentsGenerated(Number(month), Number(year), mahallaId);
    }
    getPendingPaymentsForFamily(familyHeadId) {
        return this.sandaaService.getPendingPaymentsForFamily(familyHeadId);
    }
    recordMultiplePayments(body, user) {
        return this.sandaaService.recordMultiplePayments(body.paymentIds, user?.id, body.notes);
    }
    getAllConfigsByMahalla() {
        return this.sandaaService.getAllConfigsByMahalla();
    }
    getGenerationStatus(mahallaId) {
        return this.sandaaService.getGenerationStatus(mahallaId);
    }
    generatePaymentsUntilPreviousMonth(body, user) {
        return this.sandaaService.generatePaymentsUntilPreviousMonth(body.mahallaId, user?.id);
    }
    getConsolidatedFamilyPayments(mahallaId, search, page, limit) {
        return this.sandaaService.getConsolidatedFamilyPayments({
            mahallaId,
            search,
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 50,
        });
    }
    recordCustomPayment(body, user) {
        return this.sandaaService.recordCustomPayment(body.familyHeadId, body.amount, user?.id, body.notes);
    }
};
exports.SandaaController = SandaaController;
__decorate([
    (0, common_1.Get)('configs'),
    __param(0, (0, common_1.Query)('mahallaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "getConfigs", null);
__decorate([
    (0, common_1.Get)('configs/active'),
    __param(0, (0, common_1.Query)('mahallaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "getActiveConfig", null);
__decorate([
    (0, common_1.Post)('configs'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sandaa_dto_1.CreateSandaaConfigDto, Object]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "createConfig", null);
__decorate([
    (0, common_1.Put)('configs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sandaa_dto_1.UpdateSandaaConfigDto]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.Get)('payments'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sandaa_dto_1.SandaaPaymentQueryDto]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Get)('payments/summary'),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('mahallaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "getPaymentSummary", null);
__decorate([
    (0, common_1.Get)('payments/yearly-summary'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('mahallaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "getYearlySummary", null);
__decorate([
    (0, common_1.Post)('payments/generate'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sandaa_dto_1.GeneratePaymentsDto, Object]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "generatePayments", null);
__decorate([
    (0, common_1.Post)('payments/record'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sandaa_dto_1.RecordPaymentDto, Object]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Post)('payments/bulk-record'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "bulkRecordPayments", null);
__decorate([
    (0, common_1.Post)('payments/:id/waive'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "waivePayment", null);
__decorate([
    (0, common_1.Get)('families'),
    __param(0, (0, common_1.Query)('mahallaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "getEligibleFamilies", null);
__decorate([
    (0, common_1.Get)('families/non-eligible'),
    __param(0, (0, common_1.Query)('mahallaId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "getNonEligibleFamilies", null);
__decorate([
    (0, common_1.Get)('families/counts'),
    __param(0, (0, common_1.Query)('mahallaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "getFamilyCounts", null);
__decorate([
    (0, common_1.Put)('families/eligibility'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sandaa_dto_1.UpdateFamilyEligibilityDto]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "updateFamilyEligibility", null);
__decorate([
    (0, common_1.Get)('history/:familyHeadId'),
    __param(0, (0, common_1.Param)('familyHeadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "getFamilyPaymentHistory", null);
__decorate([
    (0, common_1.Get)('payments/check-generated'),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('mahallaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "checkPaymentsGenerated", null);
__decorate([
    (0, common_1.Get)('pending/:familyHeadId'),
    __param(0, (0, common_1.Param)('familyHeadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "getPendingPaymentsForFamily", null);
__decorate([
    (0, common_1.Post)('payments/record-multiple'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "recordMultiplePayments", null);
__decorate([
    (0, common_1.Get)('configs/by-mahalla'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "getAllConfigsByMahalla", null);
__decorate([
    (0, common_1.Get)('generation-status'),
    __param(0, (0, common_1.Query)('mahallaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "getGenerationStatus", null);
__decorate([
    (0, common_1.Post)('payments/generate-until-previous'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "generatePaymentsUntilPreviousMonth", null);
__decorate([
    (0, common_1.Get)('families/consolidated'),
    __param(0, (0, common_1.Query)('mahallaId')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "getConsolidatedFamilyPayments", null);
__decorate([
    (0, common_1.Post)('payments/record-custom'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SandaaController.prototype, "recordCustomPayment", null);
exports.SandaaController = SandaaController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('sandaa'),
    __metadata("design:paramtypes", [sandaa_service_1.SandaaService])
], SandaaController);
//# sourceMappingURL=sandaa.controller.js.map