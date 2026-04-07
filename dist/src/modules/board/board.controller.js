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
exports.BoardController = void 0;
const common_1 = require("@nestjs/common");
const board_service_1 = require("./board.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let BoardController = class BoardController {
    constructor(boardService) {
        this.boardService = boardService;
    }
    getRoles() {
        return this.boardService.getRoles();
    }
    createRole(data) {
        return this.boardService.createRole(data);
    }
    updateRole(id, data) {
        return this.boardService.updateRole(id, data);
    }
    deleteRole(id) {
        return this.boardService.deleteRole(id);
    }
    getTerms() {
        return this.boardService.getTerms();
    }
    getCurrentTerm() {
        return this.boardService.getCurrentTerm();
    }
    getTermById(id) {
        return this.boardService.getTermById(id);
    }
    createTerm(data) {
        return this.boardService.createTerm(data);
    }
    updateTerm(id, data) {
        return this.boardService.updateTerm(id, data);
    }
    deleteTerm(id) {
        return this.boardService.deleteTerm(id);
    }
    getMembers(id) {
        return this.boardService.getMembers(id);
    }
    addMember(data) {
        return this.boardService.addMember(data);
    }
    updateMember(id, data) {
        return this.boardService.updateMember(id, data);
    }
    removeMember(id) {
        return this.boardService.removeMember(id);
    }
};
exports.BoardController = BoardController;
__decorate([
    (0, common_1.Get)('roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Post)('roles'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "createRole", null);
__decorate([
    (0, common_1.Put)('roles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)('roles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "deleteRole", null);
__decorate([
    (0, common_1.Get)('terms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "getTerms", null);
__decorate([
    (0, common_1.Get)('terms/current'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "getCurrentTerm", null);
__decorate([
    (0, common_1.Get)('terms/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "getTermById", null);
__decorate([
    (0, common_1.Post)('terms'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "createTerm", null);
__decorate([
    (0, common_1.Put)('terms/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "updateTerm", null);
__decorate([
    (0, common_1.Delete)('terms/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "deleteTerm", null);
__decorate([
    (0, common_1.Get)('terms/:id/members'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Post)('members'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "addMember", null);
__decorate([
    (0, common_1.Put)('members/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "updateMember", null);
__decorate([
    (0, common_1.Delete)('members/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "removeMember", null);
exports.BoardController = BoardController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('board'),
    __metadata("design:paramtypes", [board_service_1.BoardService])
], BoardController);
//# sourceMappingURL=board.controller.js.map