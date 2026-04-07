"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const people_module_1 = require("./modules/people/people.module");
const mahallas_module_1 = require("./modules/mahallas/mahallas.module");
const houses_module_1 = require("./modules/houses/houses.module");
const mosques_module_1 = require("./modules/mosques/mosques.module");
const sandaa_module_1 = require("./modules/sandaa/sandaa.module");
const payments_module_1 = require("./modules/payments/payments.module");
const zakath_module_1 = require("./modules/zakath/zakath.module");
const kurbaan_module_1 = require("./modules/kurbaan/kurbaan.module");
const donations_module_1 = require("./modules/donations/donations.module");
const finance_module_1 = require("./modules/finance/finance.module");
const board_module_1 = require("./modules/board/board.module");
const issues_module_1 = require("./modules/issues/issues.module");
const meetings_module_1 = require("./modules/meetings/meetings.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const properties_module_1 = require("./modules/properties/properties.module");
const reports_module_1 = require("./modules/reports/reports.module");
const families_module_1 = require("./modules/families/families.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', '..', 'public'),
                exclude: ['/api/(.*)'],
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            people_module_1.PeopleModule,
            mahallas_module_1.MahallasModule,
            houses_module_1.HousesModule,
            mosques_module_1.MosquesModule,
            families_module_1.FamiliesModule,
            sandaa_module_1.SandaaModule,
            payments_module_1.PaymentsModule,
            zakath_module_1.ZakathModule,
            kurbaan_module_1.KurbaanModule,
            donations_module_1.DonationsModule,
            finance_module_1.FinanceModule,
            board_module_1.BoardModule,
            issues_module_1.IssuesModule,
            meetings_module_1.MeetingsModule,
            inventory_module_1.InventoryModule,
            properties_module_1.PropertiesModule,
            reports_module_1.ReportsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map