"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const payments_service_1 = require("./payments.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const library_1 = require("@prisma/client/runtime/library");
describe('PaymentsService', () => {
    let service;
    let prisma;
    const mockPrismaService = {
        paymentType: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        otherPayment: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
            aggregate: jest.fn(),
        },
        person: {
            findUnique: jest.fn(),
        },
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                payments_service_1.PaymentsService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrismaService },
            ],
        }).compile();
        service = module.get(payments_service_1.PaymentsService);
        prisma = module.get(prisma_service_1.PrismaService);
        jest.clearAllMocks();
    });
    describe('getPaymentTypes', () => {
        it('should return active payment types by default', async () => {
            const mockTypes = [
                { id: '1', name: 'Building Fund', amount: new library_1.Decimal(1000), isActive: true, _count: { payments: 5 } },
                { id: '2', name: 'Charity', amount: new library_1.Decimal(500), isActive: true, _count: { payments: 3 } },
            ];
            mockPrismaService.paymentType.findMany.mockResolvedValue(mockTypes);
            const result = await service.getPaymentTypes();
            expect(result).toEqual(mockTypes);
            expect(mockPrismaService.paymentType.findMany).toHaveBeenCalledWith({
                where: { isActive: true },
                orderBy: { name: 'asc' },
                include: { _count: { select: { payments: true } } },
            });
        });
        it('should return all payment types when includeInactive is true', async () => {
            const mockTypes = [
                { id: '1', name: 'Active Type', isActive: true },
                { id: '2', name: 'Inactive Type', isActive: false },
            ];
            mockPrismaService.paymentType.findMany.mockResolvedValue(mockTypes);
            const result = await service.getPaymentTypes(true);
            expect(result).toHaveLength(2);
            expect(mockPrismaService.paymentType.findMany).toHaveBeenCalledWith({
                where: {},
                orderBy: { name: 'asc' },
                include: { _count: { select: { payments: true } } },
            });
        });
    });
    describe('getPaymentTypeById', () => {
        it('should return a payment type by id', async () => {
            const mockType = {
                id: '1',
                name: 'Building Fund',
                amount: new library_1.Decimal(1000),
                _count: { payments: 5 },
            };
            mockPrismaService.paymentType.findUnique.mockResolvedValue(mockType);
            const result = await service.getPaymentTypeById('1');
            expect(result).toEqual(mockType);
        });
        it('should throw NotFoundException when type not found', async () => {
            mockPrismaService.paymentType.findUnique.mockResolvedValue(null);
            await expect(service.getPaymentTypeById('non-existent'))
                .rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('createPaymentType', () => {
        it('should create a new payment type', async () => {
            const dto = { name: 'New Type', amount: 500, description: 'Test' };
            const mockCreatedType = { id: '1', ...dto, isActive: true };
            mockPrismaService.paymentType.findUnique.mockResolvedValue(null);
            mockPrismaService.paymentType.create.mockResolvedValue(mockCreatedType);
            const result = await service.createPaymentType(dto);
            expect(result).toEqual(mockCreatedType);
            expect(mockPrismaService.paymentType.create).toHaveBeenCalledWith({
                data: {
                    name: dto.name,
                    amount: dto.amount,
                    description: dto.description,
                    type: 'incoming',
                    isActive: true,
                },
            });
        });
        it('should throw BadRequestException when name already exists', async () => {
            const dto = { name: 'Existing Type', amount: 500 };
            mockPrismaService.paymentType.findUnique.mockResolvedValue({ id: '1', name: 'Existing Type' });
            await expect(service.createPaymentType(dto))
                .rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('updatePaymentType', () => {
        it('should update an existing payment type', async () => {
            const existingType = { id: '1', name: 'Old Name', amount: new library_1.Decimal(500) };
            const updateDto = { name: 'New Name', amount: 600 };
            mockPrismaService.paymentType.findUnique
                .mockResolvedValueOnce(existingType)
                .mockResolvedValueOnce(null);
            mockPrismaService.paymentType.update.mockResolvedValue({
                ...existingType,
                ...updateDto,
            });
            const result = await service.updatePaymentType('1', updateDto);
            expect(result.name).toBe('New Name');
        });
        it('should throw NotFoundException when type not found', async () => {
            mockPrismaService.paymentType.findUnique.mockResolvedValue(null);
            await expect(service.updatePaymentType('non-existent', { name: 'Test' }))
                .rejects.toThrow(common_1.NotFoundException);
        });
        it('should throw BadRequestException when new name conflicts', async () => {
            const existingType = { id: '1', name: 'Type A' };
            const conflictingType = { id: '2', name: 'Type B' };
            mockPrismaService.paymentType.findUnique
                .mockResolvedValueOnce(existingType)
                .mockResolvedValueOnce(conflictingType);
            await expect(service.updatePaymentType('1', { name: 'Type B' }))
                .rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('deletePaymentType', () => {
        it('should delete a payment type with no payments', async () => {
            const mockType = { id: '1', name: 'Test', _count: { payments: 0 } };
            mockPrismaService.paymentType.findUnique.mockResolvedValue(mockType);
            mockPrismaService.paymentType.delete.mockResolvedValue(mockType);
            const result = await service.deletePaymentType('1');
            expect(result).toEqual(mockType);
        });
        it('should throw BadRequestException when type has existing payments', async () => {
            const mockType = { id: '1', name: 'Test', _count: { payments: 5 } };
            mockPrismaService.paymentType.findUnique.mockResolvedValue(mockType);
            await expect(service.deletePaymentType('1'))
                .rejects.toThrow(common_1.BadRequestException);
        });
        it('should throw NotFoundException when type not found', async () => {
            mockPrismaService.paymentType.findUnique.mockResolvedValue(null);
            await expect(service.deletePaymentType('non-existent'))
                .rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('getPayments', () => {
        it('should return paginated payments', async () => {
            const mockPayments = [
                { id: 'p1', amount: new library_1.Decimal(500), status: 'pending' },
                { id: 'p2', amount: new library_1.Decimal(1000), status: 'paid' },
            ];
            mockPrismaService.otherPayment.findMany.mockResolvedValue(mockPayments);
            mockPrismaService.otherPayment.count.mockResolvedValue(2);
            const result = await service.getPayments({ page: 1, limit: 10 });
            expect(result.data).toEqual(mockPayments);
            expect(result.meta.total).toBe(2);
            expect(result.meta.totalPages).toBe(1);
        });
        it('should filter by status', async () => {
            mockPrismaService.otherPayment.findMany.mockResolvedValue([]);
            mockPrismaService.otherPayment.count.mockResolvedValue(0);
            await service.getPayments({ status: 'pending' });
            expect(mockPrismaService.otherPayment.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({ status: 'pending' }),
            }));
        });
        it('should filter by year', async () => {
            mockPrismaService.otherPayment.findMany.mockResolvedValue([]);
            mockPrismaService.otherPayment.count.mockResolvedValue(0);
            await service.getPayments({ year: 2025 });
            expect(mockPrismaService.otherPayment.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    createdAt: {
                        gte: new Date(2025, 0, 1),
                        lt: new Date(2026, 0, 1),
                    },
                }),
            }));
        });
        it('should filter by paymentTypeId', async () => {
            mockPrismaService.otherPayment.findMany.mockResolvedValue([]);
            mockPrismaService.otherPayment.count.mockResolvedValue(0);
            await service.getPayments({ paymentTypeId: 'type-1' });
            expect(mockPrismaService.otherPayment.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({ paymentTypeId: 'type-1' }),
            }));
        });
        it('should search by person name', async () => {
            mockPrismaService.otherPayment.findMany.mockResolvedValue([]);
            mockPrismaService.otherPayment.count.mockResolvedValue(0);
            await service.getPayments({ search: 'John' });
            expect(mockPrismaService.otherPayment.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    person: {
                        OR: [
                            { fullName: { contains: 'John', mode: 'insensitive' } },
                            { nic: { contains: 'John' } },
                            { phone: { contains: 'John' } },
                        ],
                    },
                }),
            }));
        });
    });
    describe('getPaymentById', () => {
        it('should return a payment by id', async () => {
            const mockPayment = {
                id: 'p1',
                amount: new library_1.Decimal(500),
                person: { fullName: 'John' },
                paymentType: { name: 'Building Fund' },
            };
            mockPrismaService.otherPayment.findUnique.mockResolvedValue(mockPayment);
            const result = await service.getPaymentById('p1');
            expect(result).toEqual(mockPayment);
        });
        it('should throw NotFoundException when payment not found', async () => {
            mockPrismaService.otherPayment.findUnique.mockResolvedValue(null);
            await expect(service.getPaymentById('non-existent'))
                .rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('createPayment', () => {
        it('should create a new payment', async () => {
            const dto = {
                personId: 'person-1',
                paymentTypeId: 'type-1',
                amount: 500,
                reason: 'Annual contribution',
            };
            const mockPerson = { id: 'person-1', fullName: 'John' };
            const mockPaymentType = { id: 'type-1', name: 'Building Fund', amount: new library_1.Decimal(500), isActive: true };
            const mockCreatedPayment = {
                id: 'p1',
                ...dto,
                status: 'pending',
            };
            mockPrismaService.person.findUnique.mockResolvedValue(mockPerson);
            mockPrismaService.paymentType.findUnique.mockResolvedValue(mockPaymentType);
            mockPrismaService.otherPayment.create.mockResolvedValue(mockCreatedPayment);
            const result = await service.createPayment(dto);
            expect(result.status).toBe('pending');
        });
        it('should use default amount from payment type if not provided', async () => {
            const dto = {
                personId: 'person-1',
                paymentTypeId: 'type-1',
                reason: 'Test',
            };
            const mockPerson = { id: 'person-1' };
            const mockPaymentType = { id: 'type-1', amount: new library_1.Decimal(750), isActive: true };
            mockPrismaService.person.findUnique.mockResolvedValue(mockPerson);
            mockPrismaService.paymentType.findUnique.mockResolvedValue(mockPaymentType);
            mockPrismaService.otherPayment.create.mockResolvedValue({ id: 'p1', amount: 750 });
            await service.createPayment(dto);
            expect(mockPrismaService.otherPayment.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ amount: 750 }),
            }));
        });
        it('should throw NotFoundException when person not found', async () => {
            mockPrismaService.person.findUnique.mockResolvedValue(null);
            await expect(service.createPayment({
                personId: 'non-existent',
                paymentTypeId: 'type-1',
            })).rejects.toThrow(common_1.NotFoundException);
        });
        it('should throw NotFoundException when payment type not found', async () => {
            mockPrismaService.person.findUnique.mockResolvedValue({ id: 'person-1' });
            mockPrismaService.paymentType.findUnique.mockResolvedValue(null);
            await expect(service.createPayment({
                personId: 'person-1',
                paymentTypeId: 'non-existent',
            })).rejects.toThrow(common_1.NotFoundException);
        });
        it('should throw BadRequestException when payment type is inactive', async () => {
            mockPrismaService.person.findUnique.mockResolvedValue({ id: 'person-1' });
            mockPrismaService.paymentType.findUnique.mockResolvedValue({
                id: 'type-1',
                isActive: false,
            });
            await expect(service.createPayment({
                personId: 'person-1',
                paymentTypeId: 'type-1',
            })).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('recordPayment', () => {
        it('should record a payment as paid', async () => {
            const mockPayment = { id: 'p1', status: 'pending', amount: new library_1.Decimal(500) };
            const updatedPayment = { ...mockPayment, status: 'paid', paidAt: expect.any(Date) };
            mockPrismaService.otherPayment.findUnique.mockResolvedValue(mockPayment);
            mockPrismaService.otherPayment.update.mockResolvedValue(updatedPayment);
            const result = await service.recordPayment({ paymentId: 'p1' });
            expect(result.status).toBe('paid');
        });
        it('should throw NotFoundException when payment not found', async () => {
            mockPrismaService.otherPayment.findUnique.mockResolvedValue(null);
            await expect(service.recordPayment({ paymentId: 'non-existent' }))
                .rejects.toThrow(common_1.NotFoundException);
        });
        it('should throw BadRequestException when payment already recorded', async () => {
            mockPrismaService.otherPayment.findUnique.mockResolvedValue({
                id: 'p1',
                status: 'paid',
            });
            await expect(service.recordPayment({ paymentId: 'p1' }))
                .rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('cancelPayment', () => {
        it('should cancel a pending payment', async () => {
            const mockPayment = { id: 'p1', status: 'pending' };
            mockPrismaService.otherPayment.findUnique.mockResolvedValue(mockPayment);
            mockPrismaService.otherPayment.update.mockResolvedValue({
                ...mockPayment,
                status: 'cancelled',
            });
            const result = await service.cancelPayment('p1');
            expect(result.status).toBe('cancelled');
        });
        it('should throw BadRequestException when cancelling paid payment', async () => {
            mockPrismaService.otherPayment.findUnique.mockResolvedValue({
                id: 'p1',
                status: 'paid',
            });
            await expect(service.cancelPayment('p1'))
                .rejects.toThrow(common_1.BadRequestException);
        });
        it('should throw NotFoundException when payment not found', async () => {
            mockPrismaService.otherPayment.findUnique.mockResolvedValue(null);
            await expect(service.cancelPayment('non-existent'))
                .rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('getPersonPayments', () => {
        it('should return payments for a person', async () => {
            const mockPerson = { id: 'person-1', fullName: 'John' };
            const mockPayments = [
                { id: 'p1', amount: new library_1.Decimal(500), paymentType: { name: 'Type A' } },
                { id: 'p2', amount: new library_1.Decimal(300), paymentType: { name: 'Type B' } },
            ];
            mockPrismaService.person.findUnique.mockResolvedValue(mockPerson);
            mockPrismaService.otherPayment.findMany.mockResolvedValue(mockPayments);
            const result = await service.getPersonPayments('person-1');
            expect(result.person).toEqual(mockPerson);
            expect(result.payments).toEqual(mockPayments);
        });
        it('should throw NotFoundException when person not found', async () => {
            mockPrismaService.person.findUnique.mockResolvedValue(null);
            await expect(service.getPersonPayments('non-existent'))
                .rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('getPaymentSummary', () => {
        it('should return payment summary', async () => {
            mockPrismaService.otherPayment.aggregate
                .mockResolvedValueOnce({ _count: 5, _sum: { amount: new library_1.Decimal(2500) } })
                .mockResolvedValueOnce({ _count: 10, _sum: { amount: new library_1.Decimal(5000) } })
                .mockResolvedValueOnce({ _count: 17, _sum: { amount: new library_1.Decimal(7500) } })
                .mockResolvedValueOnce({ _count: 8, _sum: { amount: new library_1.Decimal(4000) } })
                .mockResolvedValueOnce({ _count: 2, _sum: { amount: new library_1.Decimal(1000) } });
            mockPrismaService.otherPayment.count.mockResolvedValue(2);
            const result = await service.getPaymentSummary();
            expect(result.pending.count).toBe(5);
            expect(result.pending.amount).toBe(2500);
            expect(result.paid.count).toBe(10);
            expect(result.paid.amount).toBe(5000);
            expect(result.cancelled).toBe(2);
            expect(result.total.count).toBe(17);
            expect(result.total.amount).toBe(7500);
            expect(result.income.count).toBe(8);
            expect(result.income.amount).toBe(4000);
            expect(result.expense.count).toBe(2);
            expect(result.expense.amount).toBe(1000);
        });
        it('should filter summary by payment type', async () => {
            mockPrismaService.otherPayment.aggregate.mockResolvedValue({ _count: 0, _sum: { amount: null } });
            mockPrismaService.otherPayment.count.mockResolvedValue(0);
            await service.getPaymentSummary({ paymentTypeId: 'type-1' });
            expect(mockPrismaService.otherPayment.aggregate).toHaveBeenCalledWith({
                where: { paymentTypeId: 'type-1', status: 'pending' },
                _count: true,
                _sum: { amount: true },
            });
        });
    });
});
//# sourceMappingURL=payments.service.spec.js.map