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
exports.ZakathController = void 0;
const common_1 = require("@nestjs/common");
const zakath_service_1 = require("./zakath.service");
const zakath_dto_1 = require("./dto/zakath.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ZakathController = class ZakathController {
    constructor(zakathService) {
        this.zakathService = zakathService;
    }
    async getCategories() {
        return this.zakathService.getCategories();
    }
    async getAllCategories() {
        return this.zakathService.getAllCategories();
    }
    async getCategoryById(id) {
        return this.zakathService.getCategoryById(id);
    }
    async createCategory(dto) {
        return this.zakathService.createCategory(dto);
    }
    async updateCategory(id, dto) {
        return this.zakathService.updateCategory(id, dto);
    }
    async deleteCategory(id) {
        return this.zakathService.deleteCategory(id);
    }
    async getPeriods(query) {
        return this.zakathService.getPeriods(query);
    }
    async getActivePeriod() {
        return this.zakathService.getActivePeriod();
    }
    async getPeriodById(id) {
        return this.zakathService.getPeriodById(id);
    }
    async createPeriod(dto, user) {
        return this.zakathService.createPeriod(dto, user?.id);
    }
    async updatePeriod(id, dto) {
        return this.zakathService.updatePeriod(id, dto);
    }
    async completeCycle(id, dto, user) {
        return this.zakathService.completeCycle(id, user?.id);
    }
    async deletePeriod(id) {
        return this.zakathService.deletePeriod(id);
    }
    async getCollections(query) {
        return this.zakathService.getCollections(query);
    }
    async getCollectionById(id) {
        return this.zakathService.getCollectionById(id);
    }
    async createCollection(dto, user) {
        return this.zakathService.createCollection(dto, user?.id);
    }
    async updateCollection(id, dto) {
        return this.zakathService.updateCollection(id, dto);
    }
    async deleteCollection(id) {
        return this.zakathService.deleteCollection(id);
    }
    async getRequests(query) {
        return this.zakathService.getRequests(query);
    }
    async getRequestById(id) {
        return this.zakathService.getRequestById(id);
    }
    async createRequest(dto) {
        return this.zakathService.createRequest(dto);
    }
    async updateRequest(id, dto) {
        return this.zakathService.updateRequest(id, dto);
    }
    async approveRequest(id, dto, user) {
        return this.zakathService.approveRequest(id, dto, user?.id);
    }
    async rejectRequest(id, dto, user) {
        return this.zakathService.rejectRequest(id, dto, user?.id);
    }
    async deleteRequest(id) {
        return this.zakathService.deleteRequest(id);
    }
    async createDistribution(dto, user) {
        return this.zakathService.createDistribution(dto, user?.id);
    }
    async getDistributionById(id) {
        return this.zakathService.getDistributionById(id);
    }
    async getPeriodReport(id) {
        return this.zakathService.getPeriodReport(id);
    }
    async getOverallReport() {
        return this.zakathService.getOverallReport();
    }
};
exports.ZakathController = ZakathController;
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('categories/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "getCategoryById", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zakath_dto_1.CreateZakathCategoryDto]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Put)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, zakath_dto_1.UpdateZakathCategoryDto]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('periods'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zakath_dto_1.ZakathPeriodQueryDto]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "getPeriods", null);
__decorate([
    (0, common_1.Get)('periods/active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "getActivePeriod", null);
__decorate([
    (0, common_1.Get)('periods/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "getPeriodById", null);
__decorate([
    (0, common_1.Post)('periods'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zakath_dto_1.CreateZakathPeriodDto, Object]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "createPeriod", null);
__decorate([
    (0, common_1.Put)('periods/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, zakath_dto_1.UpdateZakathPeriodDto]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "updatePeriod", null);
__decorate([
    (0, common_1.Post)('periods/:id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, zakath_dto_1.CompleteCycleDto, Object]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "completeCycle", null);
__decorate([
    (0, common_1.Delete)('periods/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "deletePeriod", null);
__decorate([
    (0, common_1.Get)('collections'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zakath_dto_1.ZakathCollectionQueryDto]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "getCollections", null);
__decorate([
    (0, common_1.Get)('collections/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "getCollectionById", null);
__decorate([
    (0, common_1.Post)('collections'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zakath_dto_1.CreateZakathCollectionDto, Object]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "createCollection", null);
__decorate([
    (0, common_1.Put)('collections/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, zakath_dto_1.UpdateZakathCollectionDto]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "updateCollection", null);
__decorate([
    (0, common_1.Delete)('collections/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "deleteCollection", null);
__decorate([
    (0, common_1.Get)('requests'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zakath_dto_1.ZakathRequestQueryDto]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "getRequests", null);
__decorate([
    (0, common_1.Get)('requests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "getRequestById", null);
__decorate([
    (0, common_1.Post)('requests'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zakath_dto_1.CreateZakathRequestDto]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "createRequest", null);
__decorate([
    (0, common_1.Put)('requests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, zakath_dto_1.UpdateZakathRequestDto]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "updateRequest", null);
__decorate([
    (0, common_1.Post)('requests/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, zakath_dto_1.ApproveRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "approveRequest", null);
__decorate([
    (0, common_1.Post)('requests/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, zakath_dto_1.RejectRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "rejectRequest", null);
__decorate([
    (0, common_1.Delete)('requests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "deleteRequest", null);
__decorate([
    (0, common_1.Post)('distributions'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zakath_dto_1.CreateZakathDistributionDto, Object]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "createDistribution", null);
__decorate([
    (0, common_1.Get)('distributions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "getDistributionById", null);
__decorate([
    (0, common_1.Get)('reports/period/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "getPeriodReport", null);
__decorate([
    (0, common_1.Get)('reports/overall'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ZakathController.prototype, "getOverallReport", null);
exports.ZakathController = ZakathController = __decorate([
    (0, common_1.Controller)('zakath'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [zakath_service_1.ZakathService])
], ZakathController);
//# sourceMappingURL=zakath.controller.js.map