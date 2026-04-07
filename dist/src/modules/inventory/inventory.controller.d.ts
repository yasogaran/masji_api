import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto, UpdateInventoryItemDto, CreateRentalDto, ReturnRentalDto, InventoryQueryDto, AdjustQuantityDto } from './dto/inventory.dto';
export declare class InventoryController {
    private inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(query: InventoryQueryDto): Promise<{
        rentedQuantity: number;
        availableQuantity: number;
        rentals: ({
            rentedToPerson: {
                id: string;
                fullName: string;
                phone: string;
            };
        } & {
            id: string;
            createdAt: Date;
            status: string;
            quantity: number;
            rentedToName: string | null;
            rentalDate: Date;
            returnDate: Date | null;
            expectedReturn: Date | null;
            rentalAmount: import("@prisma/client/runtime/library").Decimal | null;
            paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
            paymentStatus: string | null;
            paymentPaidAt: Date | null;
            paymentNotes: string | null;
            inventoryItemId: string;
            rentedTo: string | null;
        })[];
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        location: string | null;
        isActive: boolean;
        quantity: number;
        isRentable: boolean;
        rentalPrice: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    getSummary(): Promise<{
        totalItems: number;
        totalQuantity: number;
        rentableItems: number;
        activeRentals: number;
        overdueRentals: number;
        recentRentals: ({
            inventoryItem: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                location: string | null;
                isActive: boolean;
                quantity: number;
                isRentable: boolean;
                rentalPrice: import("@prisma/client/runtime/library").Decimal | null;
            };
            rentedToPerson: {
                id: string;
                fullName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            status: string;
            quantity: number;
            rentedToName: string | null;
            rentalDate: Date;
            returnDate: Date | null;
            expectedReturn: Date | null;
            rentalAmount: import("@prisma/client/runtime/library").Decimal | null;
            paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
            paymentStatus: string | null;
            paymentPaidAt: Date | null;
            paymentNotes: string | null;
            inventoryItemId: string;
            rentedTo: string | null;
        })[];
    }>;
    findById(id: string): Promise<{
        rentedQuantity: number;
        availableQuantity: number;
        rentals: ({
            rentedToPerson: {
                id: string;
                fullName: string;
                phone: string;
            };
        } & {
            id: string;
            createdAt: Date;
            status: string;
            quantity: number;
            rentedToName: string | null;
            rentalDate: Date;
            returnDate: Date | null;
            expectedReturn: Date | null;
            rentalAmount: import("@prisma/client/runtime/library").Decimal | null;
            paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
            paymentStatus: string | null;
            paymentPaidAt: Date | null;
            paymentNotes: string | null;
            inventoryItemId: string;
            rentedTo: string | null;
        })[];
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        location: string | null;
        isActive: boolean;
        quantity: number;
        isRentable: boolean;
        rentalPrice: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    create(dto: CreateInventoryItemDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        location: string | null;
        isActive: boolean;
        quantity: number;
        isRentable: boolean;
        rentalPrice: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    update(id: string, dto: UpdateInventoryItemDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        location: string | null;
        isActive: boolean;
        quantity: number;
        isRentable: boolean;
        rentalPrice: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        location: string | null;
        isActive: boolean;
        quantity: number;
        isRentable: boolean;
        rentalPrice: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    adjustQuantity(id: string, dto: AdjustQuantityDto, user: any): Promise<{
        transaction: {
            createdByUser: {
                person: {
                    fullName: string;
                };
                id: string;
            };
        } & {
            id: string;
            notes: string | null;
            createdAt: Date;
            createdBy: string | null;
            type: string;
            reason: string;
            quantity: number;
            inventoryItemId: string;
            previousQty: number;
            newQty: number;
        };
        item: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            location: string | null;
            isActive: boolean;
            quantity: number;
            isRentable: boolean;
            rentalPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
        previousQty: number;
        newQty: number;
    }>;
    getTransactionHistory(id: string): Promise<({
        createdByUser: {
            person: {
                fullName: string;
            };
            id: string;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        createdBy: string | null;
        type: string;
        reason: string;
        quantity: number;
        inventoryItemId: string;
        previousQty: number;
        newQty: number;
    })[]>;
    getRentals(itemId?: string, status?: string): Promise<({
        inventoryItem: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            location: string | null;
            isActive: boolean;
            quantity: number;
            isRentable: boolean;
            rentalPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
        rentedToPerson: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        quantity: number;
        rentedToName: string | null;
        rentalDate: Date;
        returnDate: Date | null;
        expectedReturn: Date | null;
        rentalAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentStatus: string | null;
        paymentPaidAt: Date | null;
        paymentNotes: string | null;
        inventoryItemId: string;
        rentedTo: string | null;
    })[]>;
    getRentalPayments(status?: string, year?: string, month?: string): Promise<({
        inventoryItem: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            location: string | null;
            isActive: boolean;
            quantity: number;
            isRentable: boolean;
            rentalPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
        rentedToPerson: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        quantity: number;
        rentedToName: string | null;
        rentalDate: Date;
        returnDate: Date | null;
        expectedReturn: Date | null;
        rentalAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentStatus: string | null;
        paymentPaidAt: Date | null;
        paymentNotes: string | null;
        inventoryItemId: string;
        rentedTo: string | null;
    })[]>;
    createRental(dto: CreateRentalDto): Promise<{
        inventoryItem: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            location: string | null;
            isActive: boolean;
            quantity: number;
            isRentable: boolean;
            rentalPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
        rentedToPerson: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        quantity: number;
        rentedToName: string | null;
        rentalDate: Date;
        returnDate: Date | null;
        expectedReturn: Date | null;
        rentalAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentStatus: string | null;
        paymentPaidAt: Date | null;
        paymentNotes: string | null;
        inventoryItemId: string;
        rentedTo: string | null;
    }>;
    returnRental(id: string, dto: ReturnRentalDto): Promise<{
        inventoryItem: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            location: string | null;
            isActive: boolean;
            quantity: number;
            isRentable: boolean;
            rentalPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
        rentedToPerson: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        quantity: number;
        rentedToName: string | null;
        rentalDate: Date;
        returnDate: Date | null;
        expectedReturn: Date | null;
        rentalAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentStatus: string | null;
        paymentPaidAt: Date | null;
        paymentNotes: string | null;
        inventoryItemId: string;
        rentedTo: string | null;
    }>;
    recordRentalPayment(id: string, dto: {
        amount: number;
        notes?: string;
    }): Promise<{
        inventoryItem: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            location: string | null;
            isActive: boolean;
            quantity: number;
            isRentable: boolean;
            rentalPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
        rentedToPerson: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        quantity: number;
        rentedToName: string | null;
        rentalDate: Date;
        returnDate: Date | null;
        expectedReturn: Date | null;
        rentalAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentStatus: string | null;
        paymentPaidAt: Date | null;
        paymentNotes: string | null;
        inventoryItemId: string;
        rentedTo: string | null;
    }>;
    deleteRental(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        quantity: number;
        rentedToName: string | null;
        rentalDate: Date;
        returnDate: Date | null;
        expectedReturn: Date | null;
        rentalAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentStatus: string | null;
        paymentPaidAt: Date | null;
        paymentNotes: string | null;
        inventoryItemId: string;
        rentedTo: string | null;
    }>;
}
