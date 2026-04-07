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
exports.KurbaanController = void 0;
const common_1 = require("@nestjs/common");
const kurbaan_service_1 = require("./kurbaan.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const kurbaan_dto_1 = require("./dto/kurbaan.dto");
let KurbaanController = class KurbaanController {
    constructor(kurbaanService) {
        this.kurbaanService = kurbaanService;
    }
    getPeriods(isActive, page, limit) {
        return this.kurbaanService.getPeriods({
            isActive: isActive !== undefined ? isActive === 'true' : undefined,
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        });
    }
    getActivePeriod() {
        return this.kurbaanService.getActivePeriod();
    }
    getPeriodById(id) {
        return this.kurbaanService.getPeriodById(id);
    }
    getPeriodReport(id) {
        return this.kurbaanService.getPeriodReport(id);
    }
    getParticipantsForCards(id, mahallaId, filterType, page, limit) {
        return this.kurbaanService.getParticipantsForCards(id, mahallaId, filterType, page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined);
    }
    createPeriod(dto, user) {
        return this.kurbaanService.createPeriod(dto, user?.id);
    }
    updatePeriod(id, dto) {
        return this.kurbaanService.updatePeriod(id, dto);
    }
    completePeriod(id) {
        return this.kurbaanService.completePeriod(id);
    }
    deletePeriod(id) {
        return this.kurbaanService.deletePeriod(id);
    }
    getParticipants(kurbaanPeriodId, mahallaId, isDistributed, search, page, limit) {
        const query = {
            kurbaanPeriodId,
            mahallaId,
            isDistributed: isDistributed !== undefined ? isDistributed === 'true' : undefined,
            search,
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        };
        return this.kurbaanService.getParticipants(query);
    }
    getParticipantById(id) {
        return this.kurbaanService.getParticipantById(id);
    }
    createParticipant(dto, user) {
        return this.kurbaanService.createParticipant(dto, user?.id);
    }
    bulkCreateParticipants(dto, user) {
        return this.kurbaanService.bulkCreateParticipants(dto, user?.id);
    }
    registerAllFamilies(dto, user) {
        return this.kurbaanService.registerAllFamilies(dto, user?.id);
    }
    markDistributed(id, dto, user) {
        return this.kurbaanService.markDistributed(id, dto, user?.id);
    }
    markDistributedByQR(qrCode, user) {
        return this.kurbaanService.markDistributedByQR(qrCode, user?.id);
    }
    deleteParticipant(id) {
        return this.kurbaanService.deleteParticipant(id);
    }
};
exports.KurbaanController = KurbaanController;
__decorate([
    (0, common_1.Get)('periods'),
    __param(0, (0, common_1.Query)('isActive')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "getPeriods", null);
__decorate([
    (0, common_1.Get)('periods/active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "getActivePeriod", null);
__decorate([
    (0, common_1.Get)('periods/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "getPeriodById", null);
__decorate([
    (0, common_1.Get)('periods/:id/report'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "getPeriodReport", null);
__decorate([
    (0, common_1.Get)('periods/:id/cards'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('mahallaId')),
    __param(2, (0, common_1.Query)('filterType')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "getParticipantsForCards", null);
__decorate([
    (0, common_1.Post)('periods'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kurbaan_dto_1.CreateKurbaanPeriodDto, Object]),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "createPeriod", null);
__decorate([
    (0, common_1.Put)('periods/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, kurbaan_dto_1.UpdateKurbaanPeriodDto]),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "updatePeriod", null);
__decorate([
    (0, common_1.Post)('periods/:id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "completePeriod", null);
__decorate([
    (0, common_1.Delete)('periods/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "deletePeriod", null);
__decorate([
    (0, common_1.Get)('participants'),
    __param(0, (0, common_1.Query)('kurbaanPeriodId')),
    __param(1, (0, common_1.Query)('mahallaId')),
    __param(2, (0, common_1.Query)('isDistributed')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "getParticipants", null);
__decorate([
    (0, common_1.Get)('participants/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "getParticipantById", null);
__decorate([
    (0, common_1.Post)('participants'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kurbaan_dto_1.CreateKurbaanParticipantDto, Object]),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "createParticipant", null);
__decorate([
    (0, common_1.Post)('participants/bulk'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kurbaan_dto_1.BulkCreateParticipantsDto, Object]),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "bulkCreateParticipants", null);
__decorate([
    (0, common_1.Post)('participants/register-all'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kurbaan_dto_1.RegisterAllFamiliesDto, Object]),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "registerAllFamilies", null);
__decorate([
    (0, common_1.Post)('participants/:id/distribute'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, kurbaan_dto_1.MarkDistributedDto, Object]),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "markDistributed", null);
__decorate([
    (0, common_1.Post)('participants/distribute-by-qr'),
    __param(0, (0, common_1.Body)('qrCode')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "markDistributedByQR", null);
__decorate([
    (0, common_1.Delete)('participants/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KurbaanController.prototype, "deleteParticipant", null);
exports.KurbaanController = KurbaanController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('kurbaan'),
    __metadata("design:paramtypes", [kurbaan_service_1.KurbaanService])
], KurbaanController);
//# sourceMappingURL=kurbaan.controller.js.map