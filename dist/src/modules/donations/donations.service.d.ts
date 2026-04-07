import { PrismaService } from '../../prisma/prisma.service';
import { CreateDonationCategoryDto, UpdateDonationCategoryDto, CreateDonationDto, UpdateDonationDto, CreateDistributionDto, UpdateDistributionDto, DonationQueryDto, DistributionQueryDto } from './dto/donation.dto';
export declare class DonationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getCategories(includeInactive?: boolean): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        type: string;
    }[]>;
    getCategoryById(id: string): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        type: string;
    }>;
    createCategory(dto: CreateDonationCategoryDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        type: string;
    }>;
    updateCategory(id: string, dto: UpdateDonationCategoryDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        type: string;
    }>;
    deleteCategory(id: string): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        type: string;
    }>;
    getDonations(query: DonationQueryDto): Promise<{
        data: ({
            donor: {
                id: string;
                fullName: string;
                phone: string;
            };
            category: {
                id: string;
                name: string;
                isActive: boolean;
                type: string;
            };
        } & {
            id: string;
            notes: string | null;
            createdAt: Date;
            createdBy: string | null;
            amount: import("@prisma/client/runtime/library").Decimal | null;
            donorName: string | null;
            donorPhone: string | null;
            donorId: string | null;
            categoryId: string;
            donationType: string;
            itemDescription: string | null;
            quantity: number | null;
            unit: string | null;
            estimatedValue: import("@prisma/client/runtime/library").Decimal | null;
            donationDate: Date;
            isCarryForward: boolean;
            carryFromYear: number | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getDonationById(id: string): Promise<{
        donor: {
            id: string;
            fullName: string;
            phone: string;
        };
        category: {
            id: string;
            name: string;
            isActive: boolean;
            type: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        amount: import("@prisma/client/runtime/library").Decimal | null;
        donorName: string | null;
        donorPhone: string | null;
        donorId: string | null;
        categoryId: string;
        donationType: string;
        itemDescription: string | null;
        quantity: number | null;
        unit: string | null;
        estimatedValue: import("@prisma/client/runtime/library").Decimal | null;
        donationDate: Date;
        isCarryForward: boolean;
        carryFromYear: number | null;
    }>;
    createDonation(dto: CreateDonationDto, createdBy?: string): Promise<{
        donor: {
            id: string;
            fullName: string;
            phone: string;
        };
        category: {
            id: string;
            name: string;
            isActive: boolean;
            type: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        amount: import("@prisma/client/runtime/library").Decimal | null;
        donorName: string | null;
        donorPhone: string | null;
        donorId: string | null;
        categoryId: string;
        donationType: string;
        itemDescription: string | null;
        quantity: number | null;
        unit: string | null;
        estimatedValue: import("@prisma/client/runtime/library").Decimal | null;
        donationDate: Date;
        isCarryForward: boolean;
        carryFromYear: number | null;
    }>;
    updateDonation(id: string, dto: UpdateDonationDto): Promise<{
        donor: {
            id: string;
            fullName: string;
            phone: string;
        };
        category: {
            id: string;
            name: string;
            isActive: boolean;
            type: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        amount: import("@prisma/client/runtime/library").Decimal | null;
        donorName: string | null;
        donorPhone: string | null;
        donorId: string | null;
        categoryId: string;
        donationType: string;
        itemDescription: string | null;
        quantity: number | null;
        unit: string | null;
        estimatedValue: import("@prisma/client/runtime/library").Decimal | null;
        donationDate: Date;
        isCarryForward: boolean;
        carryFromYear: number | null;
    }>;
    deleteDonation(id: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        amount: import("@prisma/client/runtime/library").Decimal | null;
        donorName: string | null;
        donorPhone: string | null;
        donorId: string | null;
        categoryId: string;
        donationType: string;
        itemDescription: string | null;
        quantity: number | null;
        unit: string | null;
        estimatedValue: import("@prisma/client/runtime/library").Decimal | null;
        donationDate: Date;
        isCarryForward: boolean;
        carryFromYear: number | null;
    }>;
    getDistributions(query: DistributionQueryDto): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                isActive: boolean;
                type: string;
            };
            recipient: {
                id: string;
                fullName: string;
                phone: string;
            };
        } & {
            id: string;
            notes: string | null;
            createdAt: Date;
            createdBy: string | null;
            amount: import("@prisma/client/runtime/library").Decimal | null;
            reason: string | null;
            categoryId: string;
            itemDescription: string | null;
            quantity: number | null;
            unit: string | null;
            recipientId: string | null;
            recipientName: string | null;
            recipientPhone: string | null;
            recipientAddress: string | null;
            distributionType: string;
            distributionDate: Date;
            approvedBy: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getDistributionById(id: string): Promise<{
        category: {
            id: string;
            name: string;
            isActive: boolean;
            type: string;
        };
        recipient: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        amount: import("@prisma/client/runtime/library").Decimal | null;
        reason: string | null;
        categoryId: string;
        itemDescription: string | null;
        quantity: number | null;
        unit: string | null;
        recipientId: string | null;
        recipientName: string | null;
        recipientPhone: string | null;
        recipientAddress: string | null;
        distributionType: string;
        distributionDate: Date;
        approvedBy: string | null;
    }>;
    createDistribution(dto: CreateDistributionDto, createdBy?: string): Promise<{
        category: {
            id: string;
            name: string;
            isActive: boolean;
            type: string;
        };
        recipient: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        amount: import("@prisma/client/runtime/library").Decimal | null;
        reason: string | null;
        categoryId: string;
        itemDescription: string | null;
        quantity: number | null;
        unit: string | null;
        recipientId: string | null;
        recipientName: string | null;
        recipientPhone: string | null;
        recipientAddress: string | null;
        distributionType: string;
        distributionDate: Date;
        approvedBy: string | null;
    }>;
    updateDistribution(id: string, dto: UpdateDistributionDto): Promise<{
        category: {
            id: string;
            name: string;
            isActive: boolean;
            type: string;
        };
        recipient: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        amount: import("@prisma/client/runtime/library").Decimal | null;
        reason: string | null;
        categoryId: string;
        itemDescription: string | null;
        quantity: number | null;
        unit: string | null;
        recipientId: string | null;
        recipientName: string | null;
        recipientPhone: string | null;
        recipientAddress: string | null;
        distributionType: string;
        distributionDate: Date;
        approvedBy: string | null;
    }>;
    deleteDistribution(id: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        amount: import("@prisma/client/runtime/library").Decimal | null;
        reason: string | null;
        categoryId: string;
        itemDescription: string | null;
        quantity: number | null;
        unit: string | null;
        recipientId: string | null;
        recipientName: string | null;
        recipientPhone: string | null;
        recipientAddress: string | null;
        distributionType: string;
        distributionDate: Date;
        approvedBy: string | null;
    }>;
    getDonationsSummary(year?: number): Promise<{
        totalMoneyReceived: number;
        totalGoodsValue: number;
        moneyDonationsCount: number;
        goodsDonationsCount: number;
        byCategory: {
            category: {
                id: string;
                name: string;
                isActive: boolean;
                type: string;
            };
            moneyAmount: number;
            goodsValue: number;
            count: number;
        }[];
        monthlyData: {
            month: number;
            money_amount: number;
            goods_value: number;
            count: number;
        }[];
    }>;
    getDistributionsSummary(year?: number): Promise<{
        totalMoneyDistributed: number;
        moneyDistributionsCount: number;
        goodsDistributionsCount: number;
        byCategory: {
            category: {
                id: string;
                name: string;
                isActive: boolean;
                type: string;
            };
            amount: number;
            count: number;
        }[];
    }>;
    getAvailableYears(): Promise<number[]>;
    getStockByCategory(categoryId: string): Promise<{
        categoryId: string;
        categoryName: string;
        categoryType: string;
        totalMoneyReceived: number;
        totalMoneyDistributed: number;
        availableMoney: number;
        totalGoodsReceived: number;
        totalGoodsDistributed: number;
        availableQuantity: number;
        totalGoodsValue: number;
        unit: string;
    }>;
    getAllStock(): Promise<{
        categories: {
            categoryId: string;
            categoryName: string;
            categoryType: string;
            totalMoneyReceived: number;
            totalMoneyDistributed: number;
            availableMoney: number;
            totalGoodsReceived: number;
            totalGoodsDistributed: number;
            availableQuantity: number;
            totalGoodsValue: number;
            unit: string;
        }[];
        totals: {
            totalMoneyReceived: number;
            totalMoneyDistributed: number;
            availableMoney: number;
            totalGoodsValue: number;
        };
    }>;
    carryForwardStock(fromYear: number, toYear: number, createdBy?: string): Promise<{
        message: string;
        entriesCreated: number;
        entries: {
            category: string;
            type: any;
            amount: any;
            quantity: any;
            unit: any;
        }[];
    }>;
    getYearlyStockSummary(year: number): Promise<{
        year: number;
        carryForward: {
            money: number;
            goodsValue: number;
            entries: {
                category: string;
                type: string;
                amount: number;
                quantity: number;
                unit: string;
                fromYear: number;
            }[];
        };
        regularDonations: {
            totalMoney: number;
            totalGoodsValue: number;
            count: number;
        };
        distributions: {
            totalMoney: number;
            count: number;
        };
        totalAvailable: {
            money: number;
        };
    }>;
}
