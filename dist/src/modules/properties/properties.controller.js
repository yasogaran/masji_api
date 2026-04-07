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
exports.PropertiesController = void 0;
const common_1 = require("@nestjs/common");
const properties_service_1 = require("./properties.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const properties_dto_1 = require("./dto/properties.dto");
let PropertiesController = class PropertiesController {
    constructor(propertiesService) {
        this.propertiesService = propertiesService;
    }
    findAll(query) {
        return this.propertiesService.findAll(query);
    }
    getSummary() {
        return this.propertiesService.getSummary();
    }
    getAvailableYears() {
        return this.propertiesService.getAvailableYears();
    }
    findById(id) {
        return this.propertiesService.findById(id);
    }
    create(dto) {
        return this.propertiesService.create(dto);
    }
    update(id, dto) {
        return this.propertiesService.update(id, dto);
    }
    delete(id) {
        return this.propertiesService.delete(id);
    }
    getRentals(propertyId, isActive) {
        return this.propertiesService.getRentals({
            propertyId,
            isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        });
    }
    createRental(dto) {
        return this.propertiesService.createRental(dto);
    }
    updateRental(id, dto) {
        return this.propertiesService.updateRental(id, dto);
    }
    endRental(id, endDate) {
        return this.propertiesService.endRental(id, endDate);
    }
    deleteRental(id) {
        return this.propertiesService.deleteRental(id);
    }
    getRentPayments(id) {
        return this.propertiesService.getRentPayments(id);
    }
    getAllRentPayments(status, year, month) {
        return this.propertiesService.getAllRentPayments({
            status,
            year: year ? parseInt(year) : undefined,
            month: month ? parseInt(month) : undefined,
        });
    }
    createRentPayment(dto) {
        return this.propertiesService.createRentPayment(dto);
    }
    markPaymentAsPaid(id, notes) {
        return this.propertiesService.markPaymentAsPaid(id, notes);
    }
    generatePendingPayments(year, month) {
        return this.propertiesService.generatePendingPayments(year, month);
    }
    deleteRentPayment(id) {
        return this.propertiesService.deleteRentPayment(id);
    }
};
exports.PropertiesController = PropertiesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [properties_dto_1.PropertyQueryDto]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('years'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "getAvailableYears", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [properties_dto_1.CreatePropertyDto]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, properties_dto_1.UpdatePropertyDto]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('rentals/list'),
    __param(0, (0, common_1.Query)('propertyId')),
    __param(1, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "getRentals", null);
__decorate([
    (0, common_1.Post)('rentals'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [properties_dto_1.CreatePropertyRentalDto]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "createRental", null);
__decorate([
    (0, common_1.Put)('rentals/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, properties_dto_1.UpdatePropertyRentalDto]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "updateRental", null);
__decorate([
    (0, common_1.Post)('rentals/:id/end'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "endRental", null);
__decorate([
    (0, common_1.Delete)('rentals/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "deleteRental", null);
__decorate([
    (0, common_1.Get)('rentals/:id/payments'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "getRentPayments", null);
__decorate([
    (0, common_1.Get)('payments/all'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "getAllRentPayments", null);
__decorate([
    (0, common_1.Post)('payments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [properties_dto_1.CreateRentPaymentDto]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "createRentPayment", null);
__decorate([
    (0, common_1.Post)('payments/:id/mark-paid'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "markPaymentAsPaid", null);
__decorate([
    (0, common_1.Post)('payments/generate'),
    __param(0, (0, common_1.Body)('year')),
    __param(1, (0, common_1.Body)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "generatePendingPayments", null);
__decorate([
    (0, common_1.Delete)('payments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "deleteRentPayment", null);
exports.PropertiesController = PropertiesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('properties'),
    __metadata("design:paramtypes", [properties_service_1.PropertiesService])
], PropertiesController);
//# sourceMappingURL=properties.controller.js.map