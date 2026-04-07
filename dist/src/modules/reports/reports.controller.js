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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getDashboardStats() {
        return this.reportsService.getDashboardStats();
    }
    getPaymentSummary(year) {
        return this.reportsService.getPaymentSummary(+year || new Date().getFullYear());
    }
    getFinancialSummary(year) {
        return this.reportsService.getFinancialSummary(+year || new Date().getFullYear());
    }
    getChartData() {
        return this.reportsService.getChartData();
    }
    getTopContributors(limit) {
        return this.reportsService.getTopContributors(+limit || 10);
    }
    getUpcomingMeetings(limit) {
        return this.reportsService.getUpcomingMeetings(+limit || 5);
    }
    getRecentIssues(limit) {
        return this.reportsService.getRecentIssues(+limit || 5);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('payments/summary'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getPaymentSummary", null);
__decorate([
    (0, common_1.Get)('financial/summary'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getFinancialSummary", null);
__decorate([
    (0, common_1.Get)('charts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getChartData", null);
__decorate([
    (0, common_1.Get)('top-contributors'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getTopContributors", null);
__decorate([
    (0, common_1.Get)('upcoming-meetings'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getUpcomingMeetings", null);
__decorate([
    (0, common_1.Get)('recent-issues'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getRecentIssues", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map