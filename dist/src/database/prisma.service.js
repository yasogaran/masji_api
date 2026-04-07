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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super();
    }
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    static async getClientForTenant(dbName, dbHost = 'localhost', dbPort = 3306) {
        const key = `${dbHost}:${dbPort}/${dbName}`;
        if (this.connections.has(key)) {
            return this.connections.get(key);
        }
        const databaseUrl = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${dbHost}:${dbPort}/${dbName}`;
        const client = new client_1.PrismaClient({
            datasources: {
                db: {
                    url: databaseUrl,
                },
            },
        });
        await client.$connect();
        this.connections.set(key, client);
        return client;
    }
    static async closeAllConnections() {
        for (const client of this.connections.values()) {
            await client.$disconnect();
        }
        this.connections.clear();
    }
};
exports.PrismaService = PrismaService;
PrismaService.connections = new Map();
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map