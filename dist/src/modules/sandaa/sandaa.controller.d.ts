import { SandaaService } from './sandaa.service';
import { CreateSandaaConfigDto, UpdateSandaaConfigDto, RecordPaymentDto, GeneratePaymentsDto, SandaaPaymentQueryDto, UpdateFamilyEligibilityDto } from './dto/sandaa.dto';
export declare class SandaaController {
    private sandaaService;
    constructor(sandaaService: SandaaService);
    getConfigs(mahallaId?: string): Promise<({
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
        createdBy: string | null;
        mahallaId: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        frequency: string | null;
        whoPays: string | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
    })[]>;
    getActiveConfig(mahallaId?: string): Promise<any>;
    createConfig(dto: CreateSandaaConfigDto, user: any): Promise<{
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
        createdBy: string | null;
        mahallaId: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        frequency: string | null;
        whoPays: string | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
    }>;
    updateConfig(id: string, dto: UpdateSandaaConfigDto): Promise<{
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
        createdBy: string | null;
        mahallaId: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        frequency: string | null;
        whoPays: string | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
    }>;
    getPayments(query: SandaaPaymentQueryDto): Promise<{
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
        } & {
            id: string;
            notes: string | null;
            createdAt: Date;
            status: string;
            personId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            periodMonth: number;
            periodYear: number;
            paidAt: Date | null;
            paidAmount: import("@prisma/client/runtime/library").Decimal | null;
            receivedBy: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPaymentSummary(month: number, year: number, mahallaId?: string): Promise<{
        pending: number;
        paid: number;
        partial: number;
        totalFamilies: number;
        expectedAmount: number;
        collectedAmount: number;
        outstandingAmount: number;
        collectionRate: string | number;
    }>;
    getYearlySummary(year: number, mahallaId?: string): Promise<{
        year: number;
        totalPayments: number;
        paidPayments: number;
        expectedAmount: number;
        collectedAmount: number;
        outstandingAmount: number;
        collectionRate: string;
    }>;
    generatePayments(dto: GeneratePaymentsDto, user: any): Promise<{
        created: number;
        skipped: number;
        message: string;
    }>;
    recordPayment(dto: RecordPaymentDto, user: any): Promise<{
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
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        status: string;
        personId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        periodMonth: number;
        periodYear: number;
        paidAt: Date | null;
        paidAmount: import("@prisma/client/runtime/library").Decimal | null;
        receivedBy: string | null;
    }>;
    bulkRecordPayments(body: {
        paymentIds: string[];
    }, user: any): Promise<{
        total: number;
        successful: number;
        failed: number;
        results: any[];
    }>;
    waivePayment(id: string, body: {
        reason: string;
    }): Promise<{
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
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        status: string;
        personId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        periodMonth: number;
        periodYear: number;
        paidAt: Date | null;
        paidAmount: import("@prisma/client/runtime/library").Decimal | null;
        receivedBy: string | null;
    }>;
    getEligibleFamilies(mahallaId?: string): Promise<{
        id: string;
        familyHead: {
            id: string;
            fullName: string;
            phone: string;
        };
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
        members: {
            id: string;
            fullName: string;
        }[];
        isSandaaEligible: boolean;
    }[]>;
    getNonEligibleFamilies(mahallaId?: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            name: string;
            familyHead: {
                id: string;
                fullName: string;
                phone: string;
            };
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
            sandaaExemptReason: string;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getFamilyCounts(mahallaId?: string): Promise<{
        totalFamilies: number;
        eligibleFamilies: number;
        nonEligibleFamilies: number;
    }>;
    updateFamilyEligibility(dto: UpdateFamilyEligibilityDto): Promise<{
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
        familyMembers: {
            id: string;
            fullName: string;
        }[];
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
    }>;
    getFamilyPaymentHistory(familyHeadId: string): Promise<{
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
            familyMembers: {
                id: string;
                fullName: string;
            }[];
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
        payments: ({
            receivedByUser: {
                id: string;
                fullName: string;
            };
        } & {
            id: string;
            notes: string | null;
            createdAt: Date;
            status: string;
            personId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            periodMonth: number;
            periodYear: number;
            paidAt: Date | null;
            paidAmount: import("@prisma/client/runtime/library").Decimal | null;
            receivedBy: string | null;
        })[];
        summary: {
            totalPayments: number;
            totalPaid: number;
            totalPending: number;
            totalWaived: number;
        };
    }>;
    checkPaymentsGenerated(month: number, year: number, mahallaId?: string): Promise<{
        isGenerated: boolean;
        generatedCount: number;
        totalEligible: number;
        allGenerated: boolean;
    }>;
    getPendingPaymentsForFamily(familyHeadId: string): Promise<{
        person: {
            id: string;
            fullName: string;
            phone: string;
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
        };
        pendingPayments: {
            id: string;
            notes: string | null;
            createdAt: Date;
            status: string;
            personId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            periodMonth: number;
            periodYear: number;
            paidAt: Date | null;
            paidAmount: import("@prisma/client/runtime/library").Decimal | null;
            receivedBy: string | null;
        }[];
        summary: {
            pendingMonths: number;
            totalAmount: number;
            oldestPending: {
                month: number;
                year: number;
            };
        };
    }>;
    recordMultiplePayments(body: {
        paymentIds: string[];
        notes?: string;
    }, user: any): Promise<{
        total: number;
        successful: number;
        failed: number;
        results: any[];
    }>;
    getAllConfigsByMahalla(): Promise<any[]>;
    getGenerationStatus(mahallaId?: string): Promise<{
        generatedUntil: {
            month: number;
            year: number;
        };
        generatedFrom: {
            month: number;
            year: number;
        };
        previousMonth: {
            month: number;
            year: number;
        };
        currentMonth: {
            month: number;
            year: number;
        };
        isGeneratedUntilPreviousMonth: boolean;
        canGenerate: boolean;
    }>;
    generatePaymentsUntilPreviousMonth(body: {
        mahallaId?: string;
    }, user: any): Promise<{
        created: number;
        skipped: number;
        message: string;
        monthsGenerated?: undefined;
        generatedUntil?: undefined;
    } | {
        created: number;
        skipped: number;
        monthsGenerated: string[];
        generatedUntil: {
            month: number;
            year: number;
        };
        message: string;
    }>;
    getConsolidatedFamilyPayments(mahallaId?: string, search?: string, page?: number, limit?: number): Promise<{
        data: {
            family: {
                id: string;
                familyHead: {
                    id: string;
                    fullName: string;
                    phone: string;
                };
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
                isSandaaEligible: boolean;
            };
            payments: {
                total: number;
                pending: number;
                paid: number;
                pendingPaymentIds: string[];
            };
            amounts: {
                totalPending: number;
                totalPaid: number;
            };
            status: "paid" | "pending" | "partial" | "none";
            pendingMonths: {
                id: string;
                month: number;
                year: number;
                amount: number;
            }[];
            lastPaidDate: Date;
        }[];
        summary: {
            totalFamilies: number;
            allPaid: number;
            somePending: number;
            totalPendingAmount: number;
            totalPaidAmount: number;
        };
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    recordCustomPayment(body: {
        familyHeadId: string;
        amount: number;
        notes?: string;
    }, user: any): Promise<{
        amountPaid: number;
        paymentsAffected: number;
        paidPayments: any[];
        remainingPendingMonths: number;
        remainingPendingAmount: number;
    }>;
}
