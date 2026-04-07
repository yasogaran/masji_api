import { PropertiesService } from './properties.service';
import { CreatePropertyDto, UpdatePropertyDto, CreatePropertyRentalDto, UpdatePropertyRentalDto, CreateRentPaymentDto, PropertyQueryDto } from './dto/properties.dto';
export declare class PropertiesController {
    private propertiesService;
    constructor(propertiesService: PropertiesService);
    findAll(query: PropertyQueryDto): Promise<{
        hasActiveRental: boolean;
        currentTenant: string;
        monthlyRent: import("@prisma/client/runtime/library").Decimal;
        rentals: ({
            rentPayments: {
                id: string;
                notes: string | null;
                createdAt: Date;
                status: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                periodMonth: number;
                periodYear: number;
                paidAt: Date | null;
                propertyRentalId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            isActive: boolean;
            startDate: Date;
            endDate: Date | null;
            propertyId: string;
            tenantName: string;
            tenantContact: string | null;
            monthlyRent: import("@prisma/client/runtime/library").Decimal;
        })[];
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        address: string | null;
        propertyType: string | null;
    }[]>;
    getSummary(): Promise<{
        totalProperties: number;
        activeRentals: number;
        vacantProperties: number;
        monthlyIncome: number;
        collectedThisYear: number;
        recentPayments: ({
            propertyRental: {
                property: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    description: string | null;
                    isActive: boolean;
                    address: string | null;
                    propertyType: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                isActive: boolean;
                startDate: Date;
                endDate: Date | null;
                propertyId: string;
                tenantName: string;
                tenantContact: string | null;
                monthlyRent: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            notes: string | null;
            createdAt: Date;
            status: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            periodMonth: number;
            periodYear: number;
            paidAt: Date | null;
            propertyRentalId: string;
        })[];
        propertyTypes: {
            type: string;
            count: number;
        }[];
    }>;
    getAvailableYears(): Promise<number[]>;
    findById(id: string): Promise<{
        rentals: ({
            rentPayments: {
                id: string;
                notes: string | null;
                createdAt: Date;
                status: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                periodMonth: number;
                periodYear: number;
                paidAt: Date | null;
                propertyRentalId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            isActive: boolean;
            startDate: Date;
            endDate: Date | null;
            propertyId: string;
            tenantName: string;
            tenantContact: string | null;
            monthlyRent: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        address: string | null;
        propertyType: string | null;
    }>;
    create(dto: CreatePropertyDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        address: string | null;
        propertyType: string | null;
    }>;
    update(id: string, dto: UpdatePropertyDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        address: string | null;
        propertyType: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        address: string | null;
        propertyType: string | null;
    }>;
    getRentals(propertyId?: string, isActive?: string): Promise<({
        property: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            address: string | null;
            propertyType: string | null;
        };
        rentPayments: {
            id: string;
            notes: string | null;
            createdAt: Date;
            status: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            periodMonth: number;
            periodYear: number;
            paidAt: Date | null;
            propertyRentalId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        isActive: boolean;
        startDate: Date;
        endDate: Date | null;
        propertyId: string;
        tenantName: string;
        tenantContact: string | null;
        monthlyRent: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    createRental(dto: CreatePropertyRentalDto): Promise<{
        property: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            address: string | null;
            propertyType: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        isActive: boolean;
        startDate: Date;
        endDate: Date | null;
        propertyId: string;
        tenantName: string;
        tenantContact: string | null;
        monthlyRent: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateRental(id: string, dto: UpdatePropertyRentalDto): Promise<{
        property: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            address: string | null;
            propertyType: string | null;
        };
        rentPayments: {
            id: string;
            notes: string | null;
            createdAt: Date;
            status: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            periodMonth: number;
            periodYear: number;
            paidAt: Date | null;
            propertyRentalId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        isActive: boolean;
        startDate: Date;
        endDate: Date | null;
        propertyId: string;
        tenantName: string;
        tenantContact: string | null;
        monthlyRent: import("@prisma/client/runtime/library").Decimal;
    }>;
    endRental(id: string, endDate: string): Promise<{
        property: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            address: string | null;
            propertyType: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        isActive: boolean;
        startDate: Date;
        endDate: Date | null;
        propertyId: string;
        tenantName: string;
        tenantContact: string | null;
        monthlyRent: import("@prisma/client/runtime/library").Decimal;
    }>;
    deleteRental(id: string): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        startDate: Date;
        endDate: Date | null;
        propertyId: string;
        tenantName: string;
        tenantContact: string | null;
        monthlyRent: import("@prisma/client/runtime/library").Decimal;
    }>;
    getRentPayments(id: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        status: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        periodMonth: number;
        periodYear: number;
        paidAt: Date | null;
        propertyRentalId: string;
    }[]>;
    getAllRentPayments(status?: string, year?: string, month?: string): Promise<({
        propertyRental: {
            property: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                isActive: boolean;
                address: string | null;
                propertyType: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            isActive: boolean;
            startDate: Date;
            endDate: Date | null;
            propertyId: string;
            tenantName: string;
            tenantContact: string | null;
            monthlyRent: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        status: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        periodMonth: number;
        periodYear: number;
        paidAt: Date | null;
        propertyRentalId: string;
    })[]>;
    createRentPayment(dto: CreateRentPaymentDto): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        status: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        periodMonth: number;
        periodYear: number;
        paidAt: Date | null;
        propertyRentalId: string;
    }>;
    markPaymentAsPaid(id: string, notes?: string): Promise<{
        propertyRental: {
            property: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                isActive: boolean;
                address: string | null;
                propertyType: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            isActive: boolean;
            startDate: Date;
            endDate: Date | null;
            propertyId: string;
            tenantName: string;
            tenantContact: string | null;
            monthlyRent: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        status: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        periodMonth: number;
        periodYear: number;
        paidAt: Date | null;
        propertyRentalId: string;
    }>;
    generatePendingPayments(year: number, month: number): Promise<{
        message: string;
        payments: any[];
    }>;
    deleteRentPayment(id: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        status: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        periodMonth: number;
        periodYear: number;
        paidAt: Date | null;
        propertyRentalId: string;
    }>;
}
