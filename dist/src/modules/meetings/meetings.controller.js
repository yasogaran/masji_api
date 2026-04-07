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
exports.MeetingsController = void 0;
const common_1 = require("@nestjs/common");
const meetings_service_1 = require("./meetings.service");
const meetings_dto_1 = require("./dto/meetings.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let MeetingsController = class MeetingsController {
    constructor(meetingsService) {
        this.meetingsService = meetingsService;
    }
    findAll(query) {
        return this.meetingsService.findAll(query);
    }
    getSummary() {
        return this.meetingsService.getSummary();
    }
    getCalendarMeetings(year, month) {
        return this.meetingsService.getCalendarMeetings(parseInt(year), parseInt(month));
    }
    findById(id) {
        return this.meetingsService.findById(id);
    }
    create(dto, user) {
        return this.meetingsService.create(dto, user?.id);
    }
    update(id, dto) {
        return this.meetingsService.update(id, dto);
    }
    delete(id) {
        return this.meetingsService.delete(id);
    }
    addDecision(id, dto) {
        return this.meetingsService.addDecision(id, dto);
    }
    updateDecision(decisionId, dto) {
        return this.meetingsService.updateDecision(decisionId, dto);
    }
    removeDecision(decisionId) {
        return this.meetingsService.removeDecision(decisionId);
    }
};
exports.MeetingsController = MeetingsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [meetings_dto_1.MeetingQueryDto]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('calendar/:year/:month'),
    __param(0, (0, common_1.Param)('year')),
    __param(1, (0, common_1.Param)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "getCalendarMeetings", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [meetings_dto_1.CreateMeetingDto, Object]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, meetings_dto_1.UpdateMeetingDto]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/decisions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, meetings_dto_1.CreateDecisionDto]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "addDecision", null);
__decorate([
    (0, common_1.Put)('decisions/:decisionId'),
    __param(0, (0, common_1.Param)('decisionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, meetings_dto_1.CreateDecisionDto]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "updateDecision", null);
__decorate([
    (0, common_1.Delete)('decisions/:decisionId'),
    __param(0, (0, common_1.Param)('decisionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MeetingsController.prototype, "removeDecision", null);
exports.MeetingsController = MeetingsController = __decorate([
    (0, common_1.Controller)('meetings'),
    __metadata("design:paramtypes", [meetings_service_1.MeetingsService])
], MeetingsController);
//# sourceMappingURL=meetings.controller.js.map