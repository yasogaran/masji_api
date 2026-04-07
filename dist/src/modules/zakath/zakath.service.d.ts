import { PrismaService } from '../../prisma/prisma.service';
import { CreateZakathCategoryDto, UpdateZakathCategoryDto, CreateZakathPeriodDto, UpdateZakathPeriodDto, CreateZakathCollectionDto, UpdateZakathCollectionDto, CreateZakathRequestDto, UpdateZakathRequestDto, ApproveRequestDto, RejectRequestDto, CreateZakathDistributionDto, ZakathPeriodQueryDto, ZakathCollectionQueryDto, ZakathRequestQueryDto } from './dto/zakath.dto';
export declare class ZakathService {
    private prisma;
    constructor(prisma: PrismaService);
    getCategories(): Promise<{
        id: string;
        name: string;
        description: string | null;
        sortOrder: number;
        isActive: boolean;
        nameArabic: string | null;
    }[]>;
    getAllCategories(): Promise<{
        id: string;
        name: string;
        description: string | null;
        sortOrder: number;
        isActive: boolean;
        nameArabic: string | null;
    }[]>;
    getCategoryById(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        sortOrder: number;
        isActive: boolean;
        nameArabic: string | null;
    }>;
    createCategory(dto: CreateZakathCategoryDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        sortOrder: number;
        isActive: boolean;
        nameArabic: string | null;
    }>;
    updateCategory(id: string, dto: UpdateZakathCategoryDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        sortOrder: number;
        isActive: boolean;
        nameArabic: string | null;
    }>;
    deleteCategory(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        sortOrder: number;
        isActive: boolean;
        nameArabic: string | null;
    }>;
    getPeriods(query: ZakathPeriodQueryDto): Promise<{
        data: ({
            _count: {
                requests: number;
                collections: number;
            };
        } & {
            id: string;
            createdAt: Date;
            createdBy: string | null;
            name: string;
            status: string;
            isActive: boolean;
            hijriMonth: number | null;
            hijriYear: number;
            gregorianStart: Date | null;
            gregorianEnd: Date | null;
            totalCollected: import("@prisma/client/runtime/library").Decimal | null;
            totalDistributed: import("@prisma/client/runtime/library").Decimal | null;
            completedAt: Date | null;
            completedBy: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getActivePeriod(): Promise<{
        id: string;
        createdAt: Date;
        createdBy: string | null;
        name: string;
        status: string;
        isActive: boolean;
        hijriMonth: number | null;
        hijriYear: number;
        gregorianStart: Date | null;
        gregorianEnd: Date | null;
        totalCollected: import("@prisma/client/runtime/library").Decimal | null;
        totalDistributed: import("@prisma/client/runtime/library").Decimal | null;
        completedAt: Date | null;
        completedBy: string | null;
    }>;
    getPeriodById(id: string): Promise<{
        _count: {
            requests: number;
            collections: number;
        };
    } & {
        id: string;
        createdAt: Date;
        createdBy: string | null;
        name: string;
        status: string;
        isActive: boolean;
        hijriMonth: number | null;
        hijriYear: number;
        gregorianStart: Date | null;
        gregorianEnd: Date | null;
        totalCollected: import("@prisma/client/runtime/library").Decimal | null;
        totalDistributed: import("@prisma/client/runtime/library").Decimal | null;
        completedAt: Date | null;
        completedBy: string | null;
    }>;
    createPeriod(dto: CreateZakathPeriodDto, createdBy?: string): Promise<{
        id: string;
        createdAt: Date;
        createdBy: string | null;
        name: string;
        status: string;
        isActive: boolean;
        hijriMonth: number | null;
        hijriYear: number;
        gregorianStart: Date | null;
        gregorianEnd: Date | null;
        totalCollected: import("@prisma/client/runtime/library").Decimal | null;
        totalDistributed: import("@prisma/client/runtime/library").Decimal | null;
        completedAt: Date | null;
        completedBy: string | null;
    }>;
    updatePeriod(id: string, dto: UpdateZakathPeriodDto): Promise<{
        id: string;
        createdAt: Date;
        createdBy: string | null;
        name: string;
        status: string;
        isActive: boolean;
        hijriMonth: number | null;
        hijriYear: number;
        gregorianStart: Date | null;
        gregorianEnd: Date | null;
        totalCollected: import("@prisma/client/runtime/library").Decimal | null;
        totalDistributed: import("@prisma/client/runtime/library").Decimal | null;
        completedAt: Date | null;
        completedBy: string | null;
    }>;
    completeCycle(id: string, completedBy?: string): Promise<{
        id: string;
        createdAt: Date;
        createdBy: string | null;
        name: string;
        status: string;
        isActive: boolean;
        hijriMonth: number | null;
        hijriYear: number;
        gregorianStart: Date | null;
        gregorianEnd: Date | null;
        totalCollected: import("@prisma/client/runtime/library").Decimal | null;
        totalDistributed: import("@prisma/client/runtime/library").Decimal | null;
        completedAt: Date | null;
        completedBy: string | null;
    }>;
    deletePeriod(id: string): Promise<{
        id: string;
        createdAt: Date;
        createdBy: string | null;
        name: string;
        status: string;
        isActive: boolean;
        hijriMonth: number | null;
        hijriYear: number;
        gregorianStart: Date | null;
        gregorianEnd: Date | null;
        totalCollected: import("@prisma/client/runtime/library").Decimal | null;
        totalDistributed: import("@prisma/client/runtime/library").Decimal | null;
        completedAt: Date | null;
        completedBy: string | null;
    }>;
    getCollections(query: ZakathCollectionQueryDto): Promise<{
        data: ({
            zakathPeriod: {
                id: string;
                name: string;
            };
            donor: {
                id: string;
                fullName: string;
                phone: string;
                house: {
                    mahalla: {
                        title: string;
                    };
                    houseNumber: number;
                };
            };
        } & {
            id: string;
            notes: string | null;
            createdAt: Date;
            createdBy: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            donorName: string | null;
            donorPhone: string | null;
            collectionDate: Date;
            paymentMethod: string | null;
            referenceNo: string | null;
            zakathPeriodId: string;
            donorId: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getCollectionById(id: string): Promise<{
        zakathPeriod: {
            id: string;
            createdAt: Date;
            createdBy: string | null;
            name: string;
            status: string;
            isActive: boolean;
            hijriMonth: number | null;
            hijriYear: number;
            gregorianStart: Date | null;
            gregorianEnd: Date | null;
            totalCollected: import("@prisma/client/runtime/library").Decimal | null;
            totalDistributed: import("@prisma/client/runtime/library").Decimal | null;
            completedAt: Date | null;
            completedBy: string | null;
        };
        donor: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        donorName: string | null;
        donorPhone: string | null;
        collectionDate: Date;
        paymentMethod: string | null;
        referenceNo: string | null;
        zakathPeriodId: string;
        donorId: string | null;
    }>;
    createCollection(dto: CreateZakathCollectionDto, createdBy?: string): Promise<{
        donor: {
            id: string;
            fullName: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        donorName: string | null;
        donorPhone: string | null;
        collectionDate: Date;
        paymentMethod: string | null;
        referenceNo: string | null;
        zakathPeriodId: string;
        donorId: string | null;
    }>;
    updateCollection(id: string, dto: UpdateZakathCollectionDto): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        donorName: string | null;
        donorPhone: string | null;
        collectionDate: Date;
        paymentMethod: string | null;
        referenceNo: string | null;
        zakathPeriodId: string;
        donorId: string | null;
    }>;
    deleteCollection(id: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        donorName: string | null;
        donorPhone: string | null;
        collectionDate: Date;
        paymentMethod: string | null;
        referenceNo: string | null;
        zakathPeriodId: string;
        donorId: string | null;
    }>;
    getRequests(query: ZakathRequestQueryDto): Promise<{
        data: ({
            distributions: {
                id: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                distributedAt: Date;
            }[];
            zakathPeriod: {
                id: string;
                name: string;
            };
            requester: {
                id: string;
                fullName: string;
                phone: string;
                house: {
                    mahalla: {
                        title: string;
                    };
                    houseNumber: number;
                };
            };
            category: {
                id: string;
                name: string;
                nameArabic: string;
            };
        } & {
            id: string;
            notes: string | null;
            createdAt: Date;
            status: string;
            reason: string;
            zakathPeriodId: string;
            amountRequested: import("@prisma/client/runtime/library").Decimal;
            supportingDocs: string | null;
            amountApproved: import("@prisma/client/runtime/library").Decimal | null;
            decisionDate: Date | null;
            decisionNotes: string | null;
            decidedBy: string | null;
            isExternal: boolean;
            externalName: string | null;
            externalPhone: string | null;
            externalNic: string | null;
            externalAddress: string | null;
            requesterId: string | null;
            categoryId: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getRequestById(id: string): Promise<{
        distributions: ({
            distributedByUser: {
                id: string;
                fullName: string;
            };
        } & {
            id: string;
            notes: string | null;
            createdAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            distributedAt: Date;
            zakathRequestId: string;
            distributedBy: string | null;
        })[];
        zakathPeriod: {
            id: string;
            createdAt: Date;
            createdBy: string | null;
            name: string;
            status: string;
            isActive: boolean;
            hijriMonth: number | null;
            hijriYear: number;
            gregorianStart: Date | null;
            gregorianEnd: Date | null;
            totalCollected: import("@prisma/client/runtime/library").Decimal | null;
            totalDistributed: import("@prisma/client/runtime/library").Decimal | null;
            completedAt: Date | null;
            completedBy: string | null;
        };
        requester: {
            id: string;
            fullName: string;
            phone: string;
            house: {
                mahalla: {
                    title: string;
                };
                houseNumber: number;
            };
        };
        category: {
            id: string;
            name: string;
            description: string | null;
            sortOrder: number;
            isActive: boolean;
            nameArabic: string | null;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        status: string;
        reason: string;
        zakathPeriodId: string;
        amountRequested: import("@prisma/client/runtime/library").Decimal;
        supportingDocs: string | null;
        amountApproved: import("@prisma/client/runtime/library").Decimal | null;
        decisionDate: Date | null;
        decisionNotes: string | null;
        decidedBy: string | null;
        isExternal: boolean;
        externalName: string | null;
        externalPhone: string | null;
        externalNic: string | null;
        externalAddress: string | null;
        requesterId: string | null;
        categoryId: string;
    }>;
    createRequest(dto: CreateZakathRequestDto): Promise<{
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        status: string;
        reason: string;
        zakathPeriodId: string;
        amountRequested: import("@prisma/client/runtime/library").Decimal;
        supportingDocs: string | null;
        amountApproved: import("@prisma/client/runtime/library").Decimal | null;
        decisionDate: Date | null;
        decisionNotes: string | null;
        decidedBy: string | null;
        isExternal: boolean;
        externalName: string | null;
        externalPhone: string | null;
        externalNic: string | null;
        externalAddress: string | null;
        requesterId: string | null;
        categoryId: string;
    }>;
    updateRequest(id: string, dto: UpdateZakathRequestDto): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        status: string;
        reason: string;
        zakathPeriodId: string;
        amountRequested: import("@prisma/client/runtime/library").Decimal;
        supportingDocs: string | null;
        amountApproved: import("@prisma/client/runtime/library").Decimal | null;
        decisionDate: Date | null;
        decisionNotes: string | null;
        decidedBy: string | null;
        isExternal: boolean;
        externalName: string | null;
        externalPhone: string | null;
        externalNic: string | null;
        externalAddress: string | null;
        requesterId: string | null;
        categoryId: string;
    }>;
    approveRequest(id: string, dto: ApproveRequestDto, decidedBy?: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        status: string;
        reason: string;
        zakathPeriodId: string;
        amountRequested: import("@prisma/client/runtime/library").Decimal;
        supportingDocs: string | null;
        amountApproved: import("@prisma/client/runtime/library").Decimal | null;
        decisionDate: Date | null;
        decisionNotes: string | null;
        decidedBy: string | null;
        isExternal: boolean;
        externalName: string | null;
        externalPhone: string | null;
        externalNic: string | null;
        externalAddress: string | null;
        requesterId: string | null;
        categoryId: string;
    }>;
    rejectRequest(id: string, dto: RejectRequestDto, decidedBy?: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        status: string;
        reason: string;
        zakathPeriodId: string;
        amountRequested: import("@prisma/client/runtime/library").Decimal;
        supportingDocs: string | null;
        amountApproved: import("@prisma/client/runtime/library").Decimal | null;
        decisionDate: Date | null;
        decisionNotes: string | null;
        decidedBy: string | null;
        isExternal: boolean;
        externalName: string | null;
        externalPhone: string | null;
        externalNic: string | null;
        externalAddress: string | null;
        requesterId: string | null;
        categoryId: string;
    }>;
    deleteRequest(id: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        status: string;
        reason: string;
        zakathPeriodId: string;
        amountRequested: import("@prisma/client/runtime/library").Decimal;
        supportingDocs: string | null;
        amountApproved: import("@prisma/client/runtime/library").Decimal | null;
        decisionDate: Date | null;
        decisionNotes: string | null;
        decidedBy: string | null;
        isExternal: boolean;
        externalName: string | null;
        externalPhone: string | null;
        externalNic: string | null;
        externalAddress: string | null;
        requesterId: string | null;
        categoryId: string;
    }>;
    createDistribution(dto: CreateZakathDistributionDto, distributedBy?: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        distributedAt: Date;
        zakathRequestId: string;
        distributedBy: string | null;
    }>;
    getDistributionById(id: string): Promise<{
        zakathRequest: {
            requester: {
                id: string;
                fullName: string;
            };
            category: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            notes: string | null;
            createdAt: Date;
            status: string;
            reason: string;
            zakathPeriodId: string;
            amountRequested: import("@prisma/client/runtime/library").Decimal;
            supportingDocs: string | null;
            amountApproved: import("@prisma/client/runtime/library").Decimal | null;
            decisionDate: Date | null;
            decisionNotes: string | null;
            decidedBy: string | null;
            isExternal: boolean;
            externalName: string | null;
            externalPhone: string | null;
            externalNic: string | null;
            externalAddress: string | null;
            requesterId: string | null;
            categoryId: string;
        };
        distributedByUser: {
            id: string;
            fullName: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        distributedAt: Date;
        zakathRequestId: string;
        distributedBy: string | null;
    }>;
    getPeriodReport(periodId: string): Promise<{
        period: {
            _count: {
                requests: number;
                collections: number;
            };
        } & {
            id: string;
            createdAt: Date;
            createdBy: string | null;
            name: string;
            status: string;
            isActive: boolean;
            hijriMonth: number | null;
            hijriYear: number;
            gregorianStart: Date | null;
            gregorianEnd: Date | null;
            totalCollected: import("@prisma/client/runtime/library").Decimal | null;
            totalDistributed: import("@prisma/client/runtime/library").Decimal | null;
            completedAt: Date | null;
            completedBy: string | null;
        };
        summary: {
            totalCollected: number | import("@prisma/client/runtime/library").Decimal;
            collectionsCount: number;
            totalDistributed: number | import("@prisma/client/runtime/library").Decimal;
            distributionsCount: number;
            balance: number;
        };
        requestsByStatus: {
            status: string;
            count: number;
            amountRequested: import("@prisma/client/runtime/library").Decimal;
            amountApproved: import("@prisma/client/runtime/library").Decimal;
        }[];
        distributionsByCategory: {
            category: {
                id: string;
                name: string;
                description: string | null;
                sortOrder: number;
                isActive: boolean;
                nameArabic: string | null;
            };
            categoryId: string;
            _count: number;
            _sum: {
                amountApproved: import("@prisma/client/runtime/library").Decimal;
            };
        }[];
        topDonors: {
            donorName: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            count: number;
        }[];
    }>;
    getOverallReport(): Promise<{
        overall: {
            totalCollected: number | import("@prisma/client/runtime/library").Decimal;
            totalCollectionsCount: number;
            totalDistributed: number | import("@prisma/client/runtime/library").Decimal;
            totalDistributionsCount: number;
        };
        periodsSummary: {
            id: string;
            _count: {
                requests: number;
                collections: number;
            };
            name: string;
            status: string;
            hijriYear: number;
            totalCollected: import("@prisma/client/runtime/library").Decimal;
            totalDistributed: import("@prisma/client/runtime/library").Decimal;
        }[];
        categoryWiseDistribution: {
            category: {
                id: string;
                name: string;
                description: string | null;
                sortOrder: number;
                isActive: boolean;
                nameArabic: string | null;
            };
            totalDistributed: import("@prisma/client/runtime/library").Decimal;
            recipientsCount: number;
        }[];
    }>;
}
