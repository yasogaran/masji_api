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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRentalIncomeCategory() {
        let category = await this.prisma.incomeCategory.findFirst({
            where: { name: 'Rental Income' },
        });
        if (!category) {
            category = await this.prisma.incomeCategory.create({
                data: {
                    name: 'Rental Income',
                    description: 'Income from inventory rentals',
                    isActive: true,
                },
            });
        }
        return category;
    }
    async generateRentalReceiptNumber() {
        const today = new Date();
        const year = today.getFullYear();
        const count = await this.prisma.income.count({
            where: {
                createdAt: {
                    gte: new Date(year, 0, 1),
                    lte: new Date(year, 11, 31),
                },
            },
        });
        return `RNT-${year}-${String(count + 1).padStart(5, '0')}`;
    }
    async findAll(query) {
        const where = {};
        if (!query?.includeInactive) {
            where.isActive = true;
        }
        if (query?.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
                { location: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        if (query?.rentableOnly) {
            where.isRentable = true;
        }
        const items = await this.prisma.inventoryItem.findMany({
            where,
            include: {
                rentals: {
                    where: { status: 'active' },
                    include: { rentedToPerson: { select: { id: true, fullName: true, phone: true } } },
                },
            },
            orderBy: { name: 'asc' },
        });
        return items.map(item => {
            const rentedQuantity = item.rentals.reduce((sum, r) => sum + (r.quantity || 1), 0);
            return {
                ...item,
                rentedQuantity,
                availableQuantity: item.quantity - rentedQuantity,
            };
        });
    }
    async findById(id) {
        const item = await this.prisma.inventoryItem.findUnique({
            where: { id },
            include: {
                rentals: {
                    include: {
                        rentedToPerson: { select: { id: true, fullName: true, phone: true } },
                    },
                    orderBy: { rentalDate: 'desc' },
                },
            },
        });
        if (!item)
            throw new common_1.NotFoundException('Inventory item not found');
        const activeRentals = item.rentals.filter(r => r.status === 'active');
        const rentedQuantity = activeRentals.reduce((sum, r) => sum + (r.quantity || 1), 0);
        return {
            ...item,
            rentedQuantity,
            availableQuantity: item.quantity - rentedQuantity,
        };
    }
    async create(dto) {
        return this.prisma.inventoryItem.create({
            data: {
                name: dto.name,
                description: dto.description,
                quantity: dto.quantity ?? 1,
                location: dto.location,
                isRentable: dto.isRentable ?? false,
                rentalPrice: dto.rentalPrice,
            },
        });
    }
    async update(id, dto) {
        await this.findById(id);
        return this.prisma.inventoryItem.update({
            where: { id },
            data: dto,
        });
    }
    async delete(id) {
        const item = await this.findById(id);
        const activeRentals = item.rentals.filter(r => r.status === 'active');
        if (activeRentals.length > 0) {
            throw new common_1.BadRequestException('Cannot delete item with active rentals');
        }
        return this.prisma.inventoryItem.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async adjustQuantity(id, dto, createdBy) {
        const item = await this.findById(id);
        const previousQty = item.quantity;
        let newQty;
        if (dto.type === 'increase') {
            newQty = previousQty + dto.quantity;
        }
        else {
            if (dto.quantity > item.availableQuantity) {
                throw new common_1.BadRequestException(`Cannot decrease by ${dto.quantity}. Only ${item.availableQuantity} items available (${previousQty} total - ${item.rentedQuantity} rented)`);
            }
            newQty = previousQty - dto.quantity;
        }
        const [transaction, updatedItem] = await this.prisma.$transaction([
            this.prisma.inventoryTransaction.create({
                data: {
                    inventoryItemId: id,
                    type: dto.type,
                    quantity: dto.quantity,
                    previousQty,
                    newQty,
                    reason: dto.reason,
                    notes: dto.notes,
                    createdBy,
                },
                include: {
                    createdByUser: {
                        select: { id: true, person: { select: { fullName: true } } },
                    },
                },
            }),
            this.prisma.inventoryItem.update({
                where: { id },
                data: { quantity: newQty },
            }),
        ]);
        return {
            transaction,
            item: updatedItem,
            previousQty,
            newQty,
        };
    }
    async getTransactionHistory(id) {
        await this.findById(id);
        return this.prisma.inventoryTransaction.findMany({
            where: { inventoryItemId: id },
            include: {
                createdByUser: {
                    select: { id: true, person: { select: { fullName: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getRentals(query) {
        const where = {};
        if (query?.itemId)
            where.inventoryItemId = query.itemId;
        if (query?.status)
            where.status = query.status;
        return this.prisma.inventoryRental.findMany({
            where,
            include: {
                inventoryItem: true,
                rentedToPerson: { select: { id: true, fullName: true, phone: true } },
            },
            orderBy: { rentalDate: 'desc' },
        });
    }
    async createRental(dto) {
        const item = await this.findById(dto.inventoryItemId);
        const requestedQuantity = dto.quantity || 1;
        if (item.availableQuantity < requestedQuantity) {
            throw new common_1.BadRequestException(`Only ${item.availableQuantity} items available for rental (requested: ${requestedQuantity})`);
        }
        if (!dto.rentedTo && !dto.rentedToName) {
            throw new common_1.BadRequestException('Either rentedTo or rentedToName must be provided');
        }
        return this.prisma.inventoryRental.create({
            data: {
                inventoryItemId: dto.inventoryItemId,
                rentedTo: dto.rentedTo,
                rentedToName: dto.rentedToName,
                quantity: requestedQuantity,
                rentalDate: new Date(dto.rentalDate),
                expectedReturn: dto.expectedReturn ? new Date(dto.expectedReturn) : null,
                rentalAmount: dto.rentalAmount ?? item.rentalPrice,
                status: 'active',
            },
            include: {
                inventoryItem: true,
                rentedToPerson: { select: { id: true, fullName: true, phone: true } },
            },
        });
    }
    async returnRental(rentalId, dto) {
        const rental = await this.prisma.inventoryRental.findUnique({
            where: { id: rentalId },
            include: {
                inventoryItem: true,
                rentedToPerson: { select: { id: true, fullName: true, phone: true } },
            },
        });
        if (!rental)
            throw new common_1.NotFoundException('Rental not found');
        if (rental.status !== 'active') {
            throw new common_1.BadRequestException('Rental is not active');
        }
        if (dto.paymentStatus && !['paid', 'waived'].includes(dto.paymentStatus)) {
            throw new common_1.BadRequestException('Payment status must be "paid" or "waived" when returning an item');
        }
        const expectedAmount = Number(rental.rentalAmount) || Number(rental.inventoryItem.rentalPrice) || 0;
        const paymentAmount = dto.paymentAmount ?? expectedAmount;
        const updatedRental = await this.prisma.inventoryRental.update({
            where: { id: rentalId },
            data: {
                returnDate: new Date(dto.returnDate),
                status: 'returned',
                paymentAmount: paymentAmount,
                paymentStatus: dto.paymentStatus || 'paid',
                paymentPaidAt: dto.paymentStatus === 'paid' ? new Date() : null,
                paymentNotes: dto.paymentNotes,
            },
            include: {
                inventoryItem: true,
                rentedToPerson: { select: { id: true, fullName: true, phone: true } },
            },
        });
        if (dto.paymentStatus === 'paid' && paymentAmount > 0) {
            try {
                const category = await this.getRentalIncomeCategory();
                const receiptNumber = await this.generateRentalReceiptNumber();
                const payerName = rental.rentedToPerson?.fullName || rental.rentedToName || 'Unknown';
                await this.prisma.income.create({
                    data: {
                        receiptNumber,
                        categoryId: category.id,
                        amount: paymentAmount,
                        sourceType: 'rental',
                        payerId: rental.rentedTo || undefined,
                        payerName: payerName,
                        description: `Rental return: ${rental.inventoryItem.name} (Qty: ${rental.quantity})`,
                        transactionDate: new Date(dto.returnDate),
                        paymentMethod: 'cash',
                        notes: dto.paymentNotes || `Rental ID: ${rentalId}`,
                    },
                });
            }
            catch (error) {
                console.error('Failed to create income entry for rental:', error);
            }
        }
        return updatedRental;
    }
    async recordRentalPayment(rentalId, dto) {
        const rental = await this.prisma.inventoryRental.findUnique({
            where: { id: rentalId },
            include: {
                inventoryItem: true,
                rentedToPerson: { select: { id: true, fullName: true, phone: true } },
            },
        });
        if (!rental)
            throw new common_1.NotFoundException('Rental not found');
        const updatedRental = await this.prisma.inventoryRental.update({
            where: { id: rentalId },
            data: {
                paymentAmount: dto.amount,
                paymentStatus: 'paid',
                paymentPaidAt: new Date(),
                paymentNotes: dto.notes,
            },
            include: {
                inventoryItem: true,
                rentedToPerson: { select: { id: true, fullName: true, phone: true } },
            },
        });
        if (dto.amount > 0) {
            try {
                const category = await this.getRentalIncomeCategory();
                const receiptNumber = await this.generateRentalReceiptNumber();
                const payerName = rental.rentedToPerson?.fullName || rental.rentedToName || 'Unknown';
                await this.prisma.income.create({
                    data: {
                        receiptNumber,
                        categoryId: category.id,
                        amount: dto.amount,
                        sourceType: 'rental',
                        payerId: rental.rentedTo || undefined,
                        payerName: payerName,
                        description: `Rental payment: ${rental.inventoryItem.name} (Qty: ${rental.quantity})`,
                        transactionDate: new Date(),
                        paymentMethod: 'cash',
                        notes: dto.notes || `Rental ID: ${rentalId}`,
                    },
                });
            }
            catch (error) {
                console.error('Failed to create income entry for rental payment:', error);
            }
        }
        return updatedRental;
    }
    async getRentalPayments(query) {
        const where = {
            paymentStatus: { not: null },
        };
        if (query?.status) {
            where.paymentStatus = query.status;
        }
        if (query?.year) {
            const startDate = new Date(query.year, (query.month || 1) - 1, 1);
            const endDate = query.month
                ? new Date(query.year, query.month, 1)
                : new Date(query.year + 1, 0, 1);
            where.OR = [
                { paymentPaidAt: { gte: startDate, lt: endDate } },
                { returnDate: { gte: startDate, lt: endDate } },
            ];
        }
        return this.prisma.inventoryRental.findMany({
            where,
            include: {
                inventoryItem: true,
                rentedToPerson: { select: { id: true, fullName: true, phone: true } },
            },
            orderBy: { returnDate: 'desc' },
        });
    }
    async deleteRental(rentalId) {
        const rental = await this.prisma.inventoryRental.findUnique({
            where: { id: rentalId },
        });
        if (!rental)
            throw new common_1.NotFoundException('Rental not found');
        return this.prisma.inventoryRental.delete({
            where: { id: rentalId },
        });
    }
    async getSummary() {
        const [totalItems, rentableItems, activeRentalRecords, overdueRentalRecords] = await Promise.all([
            this.prisma.inventoryItem.count({ where: { isActive: true } }),
            this.prisma.inventoryItem.count({ where: { isActive: true, isRentable: true } }),
            this.prisma.inventoryRental.findMany({ where: { status: 'active' } }),
            this.prisma.inventoryRental.findMany({
                where: {
                    status: 'active',
                    expectedReturn: { lt: new Date() },
                },
            }),
        ]);
        const activeRentals = activeRentalRecords.reduce((sum, r) => sum + (r.quantity || 1), 0);
        const overdueRentals = overdueRentalRecords.reduce((sum, r) => sum + (r.quantity || 1), 0);
        const totalQuantity = await this.prisma.inventoryItem.aggregate({
            where: { isActive: true },
            _sum: { quantity: true },
        });
        const recentRentals = await this.prisma.inventoryRental.findMany({
            where: { status: 'active' },
            include: {
                inventoryItem: true,
                rentedToPerson: { select: { id: true, fullName: true } },
            },
            orderBy: { rentalDate: 'desc' },
            take: 5,
        });
        return {
            totalItems,
            totalQuantity: totalQuantity._sum.quantity || 0,
            rentableItems,
            activeRentals,
            overdueRentals,
            recentRentals,
        };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map