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
exports.MosquesController = void 0;
const common_1 = require("@nestjs/common");
const mosques_service_1 = require("./mosques.service");
const create_mosque_dto_1 = require("./dto/create-mosque.dto");
const update_mosque_dto_1 = require("./dto/update-mosque.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let MosquesController = class MosquesController {
    constructor(mosquesService) {
        this.mosquesService = mosquesService;
    }
    findAll() {
        return this.mosquesService.findAll();
    }
    getParentMosque() {
        return this.mosquesService.getParentMosque();
    }
    getRoles() {
        return this.mosquesService.getRoles();
    }
    createRole(data) {
        return this.mosquesService.createRole(data);
    }
    updateRole(id, data) {
        return this.mosquesService.updateRole(id, data);
    }
    deleteRole(id) {
        return this.mosquesService.deleteRole(id);
    }
    findById(id) {
        return this.mosquesService.findById(id);
    }
    getRoleAssignments(id) {
        return this.mosquesService.getRoleAssignments(id);
    }
    addRoleAssignment(mosqueId, data) {
        return this.mosquesService.addRoleAssignment({ ...data, mosqueId });
    }
    updateRoleAssignment(id, data) {
        return this.mosquesService.updateRoleAssignment(id, data);
    }
    removeRoleAssignment(id) {
        return this.mosquesService.removeRoleAssignment(id);
    }
    create(createMosqueDto, userId) {
        return this.mosquesService.create(createMosqueDto, userId);
    }
    update(id, updateMosqueDto) {
        return this.mosquesService.update(id, updateMosqueDto);
    }
    delete(id) {
        return this.mosquesService.delete(id);
    }
};
exports.MosquesController = MosquesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MosquesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('parent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MosquesController.prototype, "getParentMosque", null);
__decorate([
    (0, common_1.Get)('roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MosquesController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Post)('roles'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MosquesController.prototype, "createRole", null);
__decorate([
    (0, common_1.Put)('roles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MosquesController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)('roles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MosquesController.prototype, "deleteRole", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MosquesController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)(':id/assignments'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MosquesController.prototype, "getRoleAssignments", null);
__decorate([
    (0, common_1.Post)(':id/assignments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MosquesController.prototype, "addRoleAssignment", null);
__decorate([
    (0, common_1.Put)('assignments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MosquesController.prototype, "updateRoleAssignment", null);
__decorate([
    (0, common_1.Delete)('assignments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MosquesController.prototype, "removeRoleAssignment", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_mosque_dto_1.CreateMosqueDto, String]),
    __metadata("design:returntype", void 0)
], MosquesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_mosque_dto_1.UpdateMosqueDto]),
    __metadata("design:returntype", void 0)
], MosquesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MosquesController.prototype, "delete", null);
exports.MosquesController = MosquesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('mosques'),
    __metadata("design:paramtypes", [mosques_service_1.MosquesService])
], MosquesController);
//# sourceMappingURL=mosques.controller.js.map