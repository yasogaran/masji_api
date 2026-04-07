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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const payment_dto_1 = require("./dto/payment.dto");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    getPaymentTypes(includeInactive) {
        return this.paymentsService.getPaymentTypes(includeInactive === 'true');
    }
    getPaymentTypeById(id) {
        return this.paymentsService.getPaymentTypeById(id);
    }
    createPaymentType(dto) {
        return this.paymentsService.createPaymentType(dto);
    }
    updatePaymentType(id, dto) {
        return this.paymentsService.updatePaymentType(id, dto);
    }
    deletePaymentType(id) {
        return this.paymentsService.deletePaymentType(id);
    }
    getPayments(query) {
        return this.paymentsService.getPayments(query);
    }
    getPaymentSummary(paymentTypeId, year, month) {
        return this.paymentsService.getPaymentSummary({
            paymentTypeId,
            year: year ? parseInt(year) : undefined,
            month: month ? parseInt(month) : undefined,
        });
    }
    getPaymentById(id) {
        return this.paymentsService.getPaymentById(id);
    }
    createPayment(dto) {
        return this.paymentsService.createPayment(dto);
    }
    updatePayment(id, dto) {
        return this.paymentsService.updatePayment(id, dto);
    }
    recordPayment(id, body, user) {
        return this.paymentsService.recordPayment({ paymentId: id, ...body }, user?.id);
    }
    cancelPayment(id) {
        return this.paymentsService.cancelPayment(id);
    }
    getPersonPayments(personId) {
        return this.paymentsService.getPersonPayments(personId);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)('types'),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getPaymentTypes", null);
__decorate([
    (0, common_1.Get)('types/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getPaymentTypeById", null);
__decorate([
    (0, common_1.Post)('types'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.CreatePaymentTypeDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "createPaymentType", null);
__decorate([
    (0, common_1.Put)('types/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payment_dto_1.UpdatePaymentTypeDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "updatePaymentType", null);
__decorate([
    (0, common_1.Delete)('types/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "deletePaymentType", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.OtherPaymentQueryDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Query)('paymentTypeId')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getPaymentSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getPaymentById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.CreateOtherPaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payment_dto_1.UpdateOtherPaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "updatePayment", null);
__decorate([
    (0, common_1.Post)(':id/record'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "cancelPayment", null);
__decorate([
    (0, common_1.Get)('person/:personId'),
    __param(0, (0, common_1.Param)('personId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getPersonPayments", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map