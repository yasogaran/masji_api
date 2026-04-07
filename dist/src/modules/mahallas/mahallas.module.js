"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MahallasModule = void 0;
const common_1 = require("@nestjs/common");
const mahallas_service_1 = require("./mahallas.service");
const mahallas_controller_1 = require("./mahallas.controller");
let MahallasModule = class MahallasModule {
};
exports.MahallasModule = MahallasModule;
exports.MahallasModule = MahallasModule = __decorate([
    (0, common_1.Module)({
        providers: [mahallas_service_1.MahallasService],
        controllers: [mahallas_controller_1.MahallasController],
        exports: [mahallas_service_1.MahallasService],
    })
], MahallasModule);
//# sourceMappingURL=mahallas.module.js.map