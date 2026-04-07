"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandaaModule = void 0;
const common_1 = require("@nestjs/common");
const sandaa_service_1 = require("./sandaa.service");
const sandaa_controller_1 = require("./sandaa.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
let SandaaModule = class SandaaModule {
};
exports.SandaaModule = SandaaModule;
exports.SandaaModule = SandaaModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [sandaa_controller_1.SandaaController],
        providers: [sandaa_service_1.SandaaService],
        exports: [sandaa_service_1.SandaaService],
    })
], SandaaModule);
//# sourceMappingURL=sandaa.module.js.map