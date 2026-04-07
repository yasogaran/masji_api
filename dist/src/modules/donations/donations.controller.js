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
exports.DonationsController = void 0;
const common_1 = require("@nestjs/common");
const donations_service_1 = require("./donations.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const donation_dto_1 = require("./dto/donation.dto");
let DonationsController = class DonationsController {
    constructor(donationsService) {
        this.donationsService = donationsService;
    }
    getCategories(includeInactive) {
        return this.donationsService.getCategories(includeInactive === 'true');
    }
    getCategoryById(id) {
        return this.donationsService.getCategoryById(id);
    }
    createCategory(dto) {
        return this.donationsService.createCategory(dto);
    }
    updateCategory(id, dto) {
        return this.donationsService.updateCategory(id, dto);
    }
    deleteCategory(id) {
        return this.donationsService.deleteCategory(id);
    }
    getDonations(year, type, categoryId, search, page, limit) {
        const query = {
            year: year ? parseInt(year) : undefined,
            type,
            categoryId,
            search,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        };
        return this.donationsService.getDonations(query);
    }
    getAvailableYears() {
        return this.donationsService.getAvailableYears();
    }
    getDonationsSummary(year) {
        return this.donationsService.getDonationsSummary(year ? parseInt(year) : undefined);
    }
    getAllStock() {
        return this.donationsService.getAllStock();
    }
    getStockByCategory(categoryId) {
        return this.donationsService.getStockByCategory(categoryId);
    }
    getYearlyStockSummary(year) {
        return this.donationsService.getYearlyStockSummary(parseInt(year));
    }
    getDonationById(id) {
        return this.donationsService.getDonationById(id);
    }
    createDonation(dto, user) {
        return this.donationsService.createDonation(dto, user?.id);
    }
    updateDonation(id, dto) {
        return this.donationsService.updateDonation(id, dto);
    }
    deleteDonation(id) {
        return this.donationsService.deleteDonation(id);
    }
    getDistributions(year, type, categoryId, search, page, limit) {
        const query = {
            year: year ? parseInt(year) : undefined,
            type,
            categoryId,
            search,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        };
        return this.donationsService.getDistributions(query);
    }
    getDistributionsSummary(year) {
        return this.donationsService.getDistributionsSummary(year ? parseInt(year) : undefined);
    }
    getDistributionById(id) {
        return this.donationsService.getDistributionById(id);
    }
    createDistribution(dto, user) {
        return this.donationsService.createDistribution(dto, user?.id);
    }
    updateDistribution(id, dto) {
        return this.donationsService.updateDistribution(id, dto);
    }
    deleteDistribution(id) {
        return this.donationsService.deleteDistribution(id);
    }
    carryForwardStock(dto, user) {
        return this.donationsService.carryForwardStock(dto.fromYear, dto.toYear, user?.id);
    }
};
exports.DonationsController = DonationsController;
__decorate([
    (0, common_1.Get)('categories'),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "getCategoryById", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [donation_dto_1.CreateDonationCategoryDto]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Put)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, donation_dto_1.UpdateDonationCategoryDto]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('categoryId')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "getDonations", null);
__decorate([
    (0, common_1.Get)('years'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "getAvailableYears", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "getDonationsSummary", null);
__decorate([
    (0, common_1.Get)('stock'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "getAllStock", null);
__decorate([
    (0, common_1.Get)('stock/category/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "getStockByCategory", null);
__decorate([
    (0, common_1.Get)('stock/yearly/:year'),
    __param(0, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "getYearlyStockSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "getDonationById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [donation_dto_1.CreateDonationDto, Object]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "createDonation", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, donation_dto_1.UpdateDonationDto]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "updateDonation", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "deleteDonation", null);
__decorate([
    (0, common_1.Get)('distributions/list'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('categoryId')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "getDistributions", null);
__decorate([
    (0, common_1.Get)('distributions/summary'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "getDistributionsSummary", null);
__decorate([
    (0, common_1.Get)('distributions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "getDistributionById", null);
__decorate([
    (0, common_1.Post)('distributions'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [donation_dto_1.CreateDistributionDto, Object]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "createDistribution", null);
__decorate([
    (0, common_1.Put)('distributions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, donation_dto_1.UpdateDistributionDto]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "updateDistribution", null);
__decorate([
    (0, common_1.Delete)('distributions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "deleteDistribution", null);
__decorate([
    (0, common_1.Post)('stock/carry-forward'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "carryForwardStock", null);
exports.DonationsController = DonationsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('donations'),
    __metadata("design:paramtypes", [donations_service_1.DonationsService])
], DonationsController);
//# sourceMappingURL=donations.controller.js.map