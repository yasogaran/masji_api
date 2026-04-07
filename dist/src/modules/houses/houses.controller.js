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
exports.HousesController = void 0;
const common_1 = require("@nestjs/common");
const houses_service_1 = require("./houses.service");
const create_house_dto_1 = require("./dto/create-house.dto");
const update_house_dto_1 = require("./dto/update-house.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let HousesController = class HousesController {
    constructor(housesService) {
        this.housesService = housesService;
    }
    findAll(page, limit, mahallaId, search) {
        return this.housesService.findAll({
            page: page ? +page : 1,
            limit: limit ? +limit : 20,
            mahallaId,
            search,
        });
    }
    findById(id) {
        return this.housesService.findById(id);
    }
    getHouseMembers(id) {
        return this.housesService.getHouseMembers(id);
    }
    create(createHouseDto, userId) {
        return this.housesService.create(createHouseDto, userId);
    }
    update(id, updateHouseDto) {
        return this.housesService.update(id, updateHouseDto);
    }
    delete(id) {
        return this.housesService.delete(id);
    }
};
exports.HousesController = HousesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('mahallaId')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", void 0)
], HousesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HousesController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)(':id/members'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HousesController.prototype, "getHouseMembers", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_house_dto_1.CreateHouseDto, String]),
    __metadata("design:returntype", void 0)
], HousesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_house_dto_1.UpdateHouseDto]),
    __metadata("design:returntype", void 0)
], HousesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HousesController.prototype, "delete", null);
exports.HousesController = HousesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('houses'),
    __metadata("design:paramtypes", [houses_service_1.HousesService])
], HousesController);
//# sourceMappingURL=houses.controller.js.map