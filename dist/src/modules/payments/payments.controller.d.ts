import { PaymentsService } from './payments.service';
import { CreatePaymentTypeDto, UpdatePaymentTypeDto, CreateOtherPaymentDto, UpdateOtherPaymentDto, OtherPaymentQueryDto } from './dto/payment.dto';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    getPaymentTypes(includeInactive?: string): Promise<({
        _count: {
            payments: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        type: string;
        amount: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    getPaymentTypeById(id: string): Promise<{
        _count: {
            payments: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        type: string;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    createPaymentType(dto: CreatePaymentTypeDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        type: string;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    updatePaymentType(id: string, dto: UpdatePaymentTypeDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        type: string;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    deletePaymentType(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        type: string;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    getPayments(query: OtherPaymentQueryDto): Promise<{
        data: ({
            person: {
                house: {
                    mahalla: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        createdBy: string | null;
                        title: string;
                        description: string | null;
                        isActive: boolean;
                        isOutJamath: boolean;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    isActive: boolean;
                    mahallaId: string;
                    houseNumber: number;
                    addressLine1: string | null;
                    addressLine2: string | null;
                    addressLine3: string | null;
                    city: string | null;
                    postalCode: string | null;
                };
            } & {
                id: string;
                fullName: string;
                nic: string | null;
                dob: Date | null;
                gender: string | null;
                phone: string | null;
                email: string | null;
                houseId: string;
                familyHeadId: string | null;
                relationshipTypeId: number | null;
                memberStatusId: number | null;
                civilStatusId: number | null;
                dateOfDeath: Date | null;
                educationLevelId: number | null;
                occupationId: number | null;
                bloodGroup: string | null;
                notes: string | null;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                isFamilyHead: boolean;
                familyName: string | null;
                isSandaaEligible: boolean;
                sandaaExemptReason: string | null;
            };
            receivedByUser: {
                id: string;
                fullName: string;
            };
            paymentType: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                isActive: boolean;
                type: string;
                amount: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            status: string;
            personId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paidAt: Date | null;
            receivedBy: string | null;
            reason: string | null;
            paymentTypeId: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPaymentSummary(paymentTypeId?: string, year?: string, month?: string): Promise<{
        pending: {
            count: number;
            amount: number;
        };
        paid: {
            count: number;
            amount: number;
        };
        cancelled: number;
        total: {
            count: number;
            amount: number;
        };
        income: {
            count: number;
            amount: number;
        };
        expense: {
            count: number;
            amount: number;
        };
    }>;
    getPaymentById(id: string): Promise<{
        person: {
            house: {
                mahalla: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    title: string;
                    description: string | null;
                    isActive: boolean;
                    isOutJamath: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                isActive: boolean;
                mahallaId: string;
                houseNumber: number;
                addressLine1: string | null;
                addressLine2: string | null;
                addressLine3: string | null;
                city: string | null;
                postalCode: string | null;
            };
        } & {
            id: string;
            fullName: string;
            nic: string | null;
            dob: Date | null;
            gender: string | null;
            phone: string | null;
            email: string | null;
            houseId: string;
            familyHeadId: string | null;
            relationshipTypeId: number | null;
            memberStatusId: number | null;
            civilStatusId: number | null;
            dateOfDeath: Date | null;
            educationLevelId: number | null;
            occupationId: number | null;
            bloodGroup: string | null;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            isFamilyHead: boolean;
            familyName: string | null;
            isSandaaEligible: boolean;
            sandaaExemptReason: string | null;
        };
        receivedByUser: {
            id: string;
            fullName: string;
        };
        paymentType: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            type: string;
            amount: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        personId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidAt: Date | null;
        receivedBy: string | null;
        reason: string | null;
        paymentTypeId: string;
    }>;
    createPayment(dto: CreateOtherPaymentDto): Promise<{
        person: {
            id: string;
            fullName: string;
            nic: string | null;
            dob: Date | null;
            gender: string | null;
            phone: string | null;
            email: string | null;
            houseId: string;
            familyHeadId: string | null;
            relationshipTypeId: number | null;
            memberStatusId: number | null;
            civilStatusId: number | null;
            dateOfDeath: Date | null;
            educationLevelId: number | null;
            occupationId: number | null;
            bloodGroup: string | null;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            isFamilyHead: boolean;
            familyName: string | null;
            isSandaaEligible: boolean;
            sandaaExemptReason: string | null;
        };
        paymentType: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            type: string;
            amount: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        personId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidAt: Date | null;
        receivedBy: string | null;
        reason: string | null;
        paymentTypeId: string;
    }>;
    updatePayment(id: string, dto: UpdateOtherPaymentDto): Promise<{
        person: {
            house: {
                mahalla: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    title: string;
                    description: string | null;
                    isActive: boolean;
                    isOutJamath: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                isActive: boolean;
                mahallaId: string;
                houseNumber: number;
                addressLine1: string | null;
                addressLine2: string | null;
                addressLine3: string | null;
                city: string | null;
                postalCode: string | null;
            };
        } & {
            id: string;
            fullName: string;
            nic: string | null;
            dob: Date | null;
            gender: string | null;
            phone: string | null;
            email: string | null;
            houseId: string;
            familyHeadId: string | null;
            relationshipTypeId: number | null;
            memberStatusId: number | null;
            civilStatusId: number | null;
            dateOfDeath: Date | null;
            educationLevelId: number | null;
            occupationId: number | null;
            bloodGroup: string | null;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            isFamilyHead: boolean;
            familyName: string | null;
            isSandaaEligible: boolean;
            sandaaExemptReason: string | null;
        };
        paymentType: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            type: string;
            amount: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        personId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidAt: Date | null;
        receivedBy: string | null;
        reason: string | null;
        paymentTypeId: string;
    }>;
    recordPayment(id: string, body: {
        notes?: string;
    }, user: any): Promise<{
        person: {
            house: {
                mahalla: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    title: string;
                    description: string | null;
                    isActive: boolean;
                    isOutJamath: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                isActive: boolean;
                mahallaId: string;
                houseNumber: number;
                addressLine1: string | null;
                addressLine2: string | null;
                addressLine3: string | null;
                city: string | null;
                postalCode: string | null;
            };
        } & {
            id: string;
            fullName: string;
            nic: string | null;
            dob: Date | null;
            gender: string | null;
            phone: string | null;
            email: string | null;
            houseId: string;
            familyHeadId: string | null;
            relationshipTypeId: number | null;
            memberStatusId: number | null;
            civilStatusId: number | null;
            dateOfDeath: Date | null;
            educationLevelId: number | null;
            occupationId: number | null;
            bloodGroup: string | null;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            isFamilyHead: boolean;
            familyName: string | null;
            isSandaaEligible: boolean;
            sandaaExemptReason: string | null;
        };
        paymentType: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            type: string;
            amount: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        personId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidAt: Date | null;
        receivedBy: string | null;
        reason: string | null;
        paymentTypeId: string;
    }>;
    cancelPayment(id: string): Promise<{
        person: {
            id: string;
            fullName: string;
            nic: string | null;
            dob: Date | null;
            gender: string | null;
            phone: string | null;
            email: string | null;
            houseId: string;
            familyHeadId: string | null;
            relationshipTypeId: number | null;
            memberStatusId: number | null;
            civilStatusId: number | null;
            dateOfDeath: Date | null;
            educationLevelId: number | null;
            occupationId: number | null;
            bloodGroup: string | null;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            isFamilyHead: boolean;
            familyName: string | null;
            isSandaaEligible: boolean;
            sandaaExemptReason: string | null;
        };
        paymentType: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            type: string;
            amount: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        personId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidAt: Date | null;
        receivedBy: string | null;
        reason: string | null;
        paymentTypeId: string;
    }>;
    getPersonPayments(personId: string): Promise<{
        person: {
            id: string;
            fullName: string;
            nic: string | null;
            dob: Date | null;
            gender: string | null;
            phone: string | null;
            email: string | null;
            houseId: string;
            familyHeadId: string | null;
            relationshipTypeId: number | null;
            memberStatusId: number | null;
            civilStatusId: number | null;
            dateOfDeath: Date | null;
            educationLevelId: number | null;
            occupationId: number | null;
            bloodGroup: string | null;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            isFamilyHead: boolean;
            familyName: string | null;
            isSandaaEligible: boolean;
            sandaaExemptReason: string | null;
        };
        payments: ({
            receivedByUser: {
                id: string;
                fullName: string;
            };
            paymentType: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                isActive: boolean;
                type: string;
                amount: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            status: string;
            personId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paidAt: Date | null;
            receivedBy: string | null;
            reason: string | null;
            paymentTypeId: string;
        })[];
    }>;
}
