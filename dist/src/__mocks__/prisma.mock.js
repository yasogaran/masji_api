"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockPrismaService = void 0;
const createMockPrismaService = () => ({
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    onModuleInit: jest.fn(),
    onModuleDestroy: jest.fn(),
    mahalla: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
    house: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
    person: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
    mosque: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    mosqueRole: {
        findMany: jest.fn(),
    },
    mosqueRoleAssignment: {
        count: jest.fn(),
    },
    memberStatus: {
        findMany: jest.fn(),
    },
    civilStatus: {
        findMany: jest.fn(),
    },
    educationLevel: {
        findMany: jest.fn(),
    },
    occupation: {
        findMany: jest.fn(),
    },
    relationshipType: {
        findMany: jest.fn(),
    },
    boardRole: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    boardTerm: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
    },
    boardMember: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
    family: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
});
exports.createMockPrismaService = createMockPrismaService;
//# sourceMappingURL=prisma.mock.js.map