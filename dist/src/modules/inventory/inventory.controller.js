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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const inventory_dto_1 = require("./dto/inventory.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    findAll(query) {
        return this.inventoryService.findAll(query);
    }
    getSummary() {
        return this.inventoryService.getSummary();
    }
    findById(id) {
        return this.inventoryService.findById(id);
    }
    create(dto) {
        return this.inventoryService.create(dto);
    }
    update(id, dto) {
        return this.inventoryService.update(id, dto);
    }
    delete(id) {
        return this.inventoryService.delete(id);
    }
    adjustQuantity(id, dto, user) {
        return this.inventoryService.adjustQuantity(id, dto, user?.userId);
    }
    getTransactionHistory(id) {
        return this.inventoryService.getTransactionHistory(id);
    }
    getRentals(itemId, status) {
        return this.inventoryService.getRentals({ itemId, status });
    }
    getRentalPayments(status, year, month) {
        return this.inventoryService.getRentalPayments({
            status,
            year: year ? parseInt(year) : undefined,
            month: month ? parseInt(month) : undefined,
        });
    }
    createRental(dto) {
        return this.inventoryService.createRental(dto);
    }
    returnRental(id, dto) {
        return this.inventoryService.returnRental(id, dto);
    }
    recordRentalPayment(id, dto) {
        return this.inventoryService.recordRentalPayment(id, dto);
    }
    deleteRental(id) {
        return this.inventoryService.deleteRental(id);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_dto_1.InventoryQueryDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_dto_1.CreateInventoryItemDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_dto_1.UpdateInventoryItemDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/adjust'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_dto_1.AdjustQuantityDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "adjustQuantity", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getTransactionHistory", null);
__decorate([
    (0, common_1.Get)('rentals/list'),
    __param(0, (0, common_1.Query)('itemId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getRentals", null);
__decorate([
    (0, common_1.Get)('rentals/payments'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getRentalPayments", null);
__decorate([
    (0, common_1.Post)('rentals'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_dto_1.CreateRentalDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createRental", null);
__decorate([
    (0, common_1.Post)('rentals/:id/return'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_dto_1.ReturnRentalDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "returnRental", null);
__decorate([
    (0, common_1.Post)('rentals/:id/payment'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "recordRentalPayment", null);
__decorate([
    (0, common_1.Delete)('rentals/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "deleteRental", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map