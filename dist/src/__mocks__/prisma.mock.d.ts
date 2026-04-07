import { PrismaService } from '../prisma/prisma.service';
export type MockPrismaService = {
    [K in keyof PrismaService]: jest.Mock;
} & {
    mahalla: {
        findMany: jest.Mock;
        findUnique: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
        count: jest.Mock;
    };
    house: {
        findMany: jest.Mock;
        findUnique: jest.Mock;
        findFirst: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
        count: jest.Mock;
    };
    person: {
        findMany: jest.Mock;
        findUnique: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
        count: jest.Mock;
    };
    mosque: {
        findMany: jest.Mock;
        findUnique: jest.Mock;
        findFirst: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
        count: jest.Mock;
    };
    mosqueRole: {
        findMany: jest.Mock;
    };
    mosqueRoleAssignment: {
        count: jest.Mock;
    };
    memberStatus: {
        findMany: jest.Mock;
    };
    civilStatus: {
        findMany: jest.Mock;
    };
    educationLevel: {
        findMany: jest.Mock;
    };
    occupation: {
        findMany: jest.Mock;
    };
    relationshipType: {
        findMany: jest.Mock;
    };
    boardRole: {
        findMany: jest.Mock;
        findUnique: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
    };
    boardTerm: {
        findMany: jest.Mock;
        findUnique: jest.Mock;
        findFirst: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        updateMany: jest.Mock;
        delete: jest.Mock;
    };
    boardMember: {
        findMany: jest.Mock;
        findFirst: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
        count: jest.Mock;
    };
    family: {
        findMany: jest.Mock;
        findFirst: jest.Mock;
        findUnique: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
        count: jest.Mock;
    };
};
export declare const createMockPrismaService: () => MockPrismaService;
