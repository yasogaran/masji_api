"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const sandaa_service_1 = require("./sandaa.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const library_1 = require("@prisma/client/runtime/library");
describe('SandaaService', () => {
    let service;
    let prisma;
    const mockPrismaService = {
        sandaaConfig: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        sandaaPayment: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
            aggregate: jest.fn(),
        },
        person: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
        },
        mahalla: {
            findMany: jest.fn(),
        },
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                sandaa_service_1.SandaaService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrismaService },
            ],
        }).compile();
        service = module.get(sandaa_service_1.SandaaService);
        prisma = module.get(prisma_service_1.PrismaService);
        jest.clearAllMocks();
    });
    describe('getConfigs', () => {
        it('should return all configs', async () => {
            const mockConfigs = [
                { id: '1', amount: new library_1.Decimal(500), mahallaId: null, mahalla: null },
                { id: '2', amount: new library_1.Decimal(600), mahallaId: 'm1', mahalla: { title: 'North Area' } },
            ];
            mockPrismaService.sandaaConfig.findMany.mockResolvedValue(mockConfigs);
            const result = await service.getConfigs();
            expect(result).toEqual(mockConfigs);
            expect(mockPrismaService.sandaaConfig.findMany).toHaveBeenCalledWith({
                where: {},
                include: { mahalla: true },
                orderBy: [{ effectiveFrom: 'desc' }],
            });
        });
        it('should filter configs by mahallaId', async () => {
            const mockConfigs = [
                { id: '2', amount: new library_1.Decimal(600), mahallaId: 'm1', mahalla: { title: 'North Area' } },
            ];
            mockPrismaService.sandaaConfig.findMany.mockResolvedValue(mockConfigs);
            const result = await service.getConfigs('m1');
            expect(result).toEqual(mockConfigs);
            expect(mockPrismaService.sandaaConfig.findMany).toHaveBeenCalledWith({
                where: { mahallaId: 'm1' },
                include: { mahalla: true },
                orderBy: [{ effectiveFrom: 'desc' }],
            });
        });
    });
    describe('getActiveConfig', () => {
        it('should return mahalla-specific config when available', async () => {
            const mockConfig = {
                id: '1',
                amount: new library_1.Decimal(600),
                mahallaId: 'm1',
                mahalla: { title: 'North Area' },
            };
            mockPrismaService.sandaaConfig.findFirst.mockResolvedValue(mockConfig);
            const result = await service.getActiveConfig('m1');
            expect(result).toEqual(mockConfig);
        });
        it('should fall back to global config when no mahalla-specific config', async () => {
            const mockGlobalConfig = {
                id: '1',
                amount: new library_1.Decimal(500),
                mahallaId: null,
            };
            mockPrismaService.sandaaConfig.findFirst
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(mockGlobalConfig);
            const result = await service.getActiveConfig('m1');
            expect(result).toEqual(mockGlobalConfig);
        });
    });
    describe('createConfig', () => {
        it('should create a new config', async () => {
            const dto = {
                amount: 500,
                effectiveFrom: '2025-01-01',
                frequency: 'monthly',
                whoPays: 'family_head',
            };
            const mockCreatedConfig = {
                id: '1',
                ...dto,
                amount: new library_1.Decimal(500),
                mahallaId: null,
                mahalla: null,
            };
            mockPrismaService.sandaaConfig.findFirst.mockResolvedValue(null);
            mockPrismaService.sandaaConfig.create.mockResolvedValue(mockCreatedConfig);
            const result = await service.createConfig(dto);
            expect(result).toEqual(mockCreatedConfig);
            expect(mockPrismaService.sandaaConfig.create).toHaveBeenCalled();
        });
        it('should close existing config when creating new one', async () => {
            const dto = {
                amount: 600,
                effectiveFrom: '2025-06-01',
            };
            const existingConfig = {
                id: 'existing-1',
                amount: new library_1.Decimal(500),
                effectiveTo: null,
            };
            const mockCreatedConfig = {
                id: '2',
                amount: new library_1.Decimal(600),
                mahallaId: null,
            };
            mockPrismaService.sandaaConfig.findFirst.mockResolvedValue(existingConfig);
            mockPrismaService.sandaaConfig.update.mockResolvedValue({});
            mockPrismaService.sandaaConfig.create.mockResolvedValue(mockCreatedConfig);
            await service.createConfig(dto);
            expect(mockPrismaService.sandaaConfig.update).toHaveBeenCalledWith({
                where: { id: 'existing-1' },
                data: { effectiveTo: new Date('2025-06-01') },
            });
        });
    });
    describe('updateConfig', () => {
        it('should update an existing config', async () => {
            const existingConfig = {
                id: '1',
                amount: new library_1.Decimal(500),
            };
            const updateDto = { amount: 600 };
            mockPrismaService.sandaaConfig.findUnique.mockResolvedValue(existingConfig);
            mockPrismaService.sandaaConfig.update.mockResolvedValue({
                ...existingConfig,
                amount: new library_1.Decimal(600),
            });
            const result = await service.updateConfig('1', updateDto);
            expect(result.amount).toEqual(new library_1.Decimal(600));
        });
        it('should throw NotFoundException when config not found', async () => {
            mockPrismaService.sandaaConfig.findUnique.mockResolvedValue(null);
            await expect(service.updateConfig('non-existent', { amount: 600 }))
                .rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('generatePayments', () => {
        it('should generate payments for eligible families', async () => {
            const mockFamilyHeads = [
                {
                    id: 'p1',
                    fullName: 'John Doe',
                    familyHeadId: null,
                    isSandaaEligible: true,
                    house: { mahallaId: 'm1', mahalla: { title: 'North Area' } },
                },
                {
                    id: 'p2',
                    fullName: 'Jane Doe',
                    familyHeadId: null,
                    isSandaaEligible: true,
                    house: { mahallaId: 'm1', mahalla: { title: 'North Area' } },
                },
            ];
            const mockConfig = { id: 'c1', amount: new library_1.Decimal(500) };
            mockPrismaService.person.findMany.mockResolvedValue(mockFamilyHeads);
            mockPrismaService.sandaaConfig.findFirst.mockResolvedValue(mockConfig);
            mockPrismaService.sandaaPayment.findUnique.mockResolvedValue(null);
            mockPrismaService.sandaaPayment.create.mockResolvedValue({});
            const result = await service.generatePayments({ month: 1, year: 2025 });
            expect(result.created).toBe(2);
            expect(result.skipped).toBe(0);
            expect(mockPrismaService.sandaaPayment.create).toHaveBeenCalledTimes(2);
        });
        it('should skip families with existing payments', async () => {
            const mockFamilyHeads = [
                {
                    id: 'p1',
                    fullName: 'John Doe',
                    familyHeadId: null,
                    isSandaaEligible: true,
                    house: { mahallaId: 'm1', mahalla: {} },
                },
            ];
            const mockConfig = { id: 'c1', amount: new library_1.Decimal(500) };
            mockPrismaService.person.findMany.mockResolvedValue(mockFamilyHeads);
            mockPrismaService.sandaaConfig.findFirst.mockResolvedValue(mockConfig);
            mockPrismaService.sandaaPayment.findUnique.mockResolvedValue({ id: 'existing' });
            const result = await service.generatePayments({ month: 1, year: 2025 });
            expect(result.created).toBe(0);
            expect(result.skipped).toBe(1);
        });
        it('should return message when no eligible families found', async () => {
            mockPrismaService.person.findMany.mockResolvedValue([]);
            const result = await service.generatePayments({ month: 1, year: 2025 });
            expect(result.created).toBe(0);
            expect(result.skipped).toBe(0);
            expect(result.message).toBe('No eligible families found');
        });
    });
    describe('getPayments', () => {
        it('should return paginated payments', async () => {
            const mockPayments = [
                { id: 'pay1', amount: new library_1.Decimal(500), status: 'pending' },
                { id: 'pay2', amount: new library_1.Decimal(500), status: 'paid' },
            ];
            mockPrismaService.sandaaPayment.findMany.mockResolvedValue(mockPayments);
            mockPrismaService.sandaaPayment.count.mockResolvedValue(2);
            const result = await service.getPayments({ page: 1, limit: 10 });
            expect(result.data).toEqual(mockPayments);
            expect(result.meta.total).toBe(2);
            expect(result.meta.totalPages).toBe(1);
        });
        it('should filter by status', async () => {
            mockPrismaService.sandaaPayment.findMany.mockResolvedValue([]);
            mockPrismaService.sandaaPayment.count.mockResolvedValue(0);
            await service.getPayments({ status: 'pending' });
            expect(mockPrismaService.sandaaPayment.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({ status: 'pending' }),
            }));
        });
    });
    describe('recordPayment', () => {
        it('should record a full payment', async () => {
            const mockPayment = {
                id: 'pay1',
                amount: new library_1.Decimal(500),
                status: 'pending',
            };
            const updatedPayment = {
                ...mockPayment,
                paidAmount: 500,
                status: 'paid',
                paidAt: expect.any(Date),
            };
            mockPrismaService.sandaaPayment.findUnique.mockResolvedValue(mockPayment);
            mockPrismaService.sandaaPayment.update.mockResolvedValue(updatedPayment);
            const result = await service.recordPayment({ paymentId: 'pay1' });
            expect(result.status).toBe('paid');
        });
        it('should record a partial payment', async () => {
            const mockPayment = {
                id: 'pay1',
                amount: new library_1.Decimal(500),
                status: 'pending',
            };
            mockPrismaService.sandaaPayment.findUnique.mockResolvedValue(mockPayment);
            mockPrismaService.sandaaPayment.update.mockResolvedValue({
                ...mockPayment,
                paidAmount: 300,
                status: 'partial',
            });
            const result = await service.recordPayment({ paymentId: 'pay1', paidAmount: 300 });
            expect(result.status).toBe('partial');
        });
        it('should throw NotFoundException when payment not found', async () => {
            mockPrismaService.sandaaPayment.findUnique.mockResolvedValue(null);
            await expect(service.recordPayment({ paymentId: 'non-existent' }))
                .rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('waivePayment', () => {
        it('should waive a payment', async () => {
            const mockPayment = { id: 'pay1', amount: new library_1.Decimal(500) };
            mockPrismaService.sandaaPayment.findUnique.mockResolvedValue(mockPayment);
            mockPrismaService.sandaaPayment.update.mockResolvedValue({
                ...mockPayment,
                status: 'waived',
                notes: 'Financial hardship',
            });
            const result = await service.waivePayment('pay1', 'Financial hardship');
            expect(result.status).toBe('waived');
            expect(result.notes).toBe('Financial hardship');
        });
    });
    describe('updateFamilyEligibility', () => {
        it('should update family eligibility', async () => {
            const mockPerson = { id: 'p1', familyHeadId: null, isSandaaEligible: true };
            mockPrismaService.person.findUnique.mockResolvedValue(mockPerson);
            mockPrismaService.person.update.mockResolvedValue({
                ...mockPerson,
                isSandaaEligible: false,
                sandaaExemptReason: 'Financial hardship',
            });
            const result = await service.updateFamilyEligibility({
                familyId: 'p1',
                isSandaaEligible: false,
                sandaaExemptReason: 'Financial hardship',
            });
            expect(result.isSandaaEligible).toBe(false);
        });
        it('should throw NotFoundException when family not found', async () => {
            mockPrismaService.person.findUnique.mockResolvedValue(null);
            await expect(service.updateFamilyEligibility({
                familyId: 'non-existent',
                isSandaaEligible: false,
            })).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('checkPaymentsGenerated', () => {
        it('should check if payments are generated', async () => {
            mockPrismaService.sandaaPayment.count.mockResolvedValue(10);
            mockPrismaService.person.count.mockResolvedValue(10);
            const result = await service.checkPaymentsGenerated(1, 2025);
            expect(result.isGenerated).toBe(true);
            expect(result.generatedCount).toBe(10);
            expect(result.allGenerated).toBe(true);
        });
    });
    describe('getPendingPaymentsForFamily', () => {
        it('should get pending payments for a family head', async () => {
            const mockPerson = {
                id: 'p1',
                fullName: 'John Doe',
                familyAsHead: { id: 'f1' },
                house: { mahalla: { title: 'North Area' } },
            };
            const mockPendingPayments = [
                { id: 'pay1', amount: new library_1.Decimal(500), periodMonth: 1, periodYear: 2025 },
                { id: 'pay2', amount: new library_1.Decimal(500), periodMonth: 2, periodYear: 2025 },
            ];
            mockPrismaService.person.findUnique.mockResolvedValue(mockPerson);
            mockPrismaService.sandaaPayment.findMany.mockResolvedValue(mockPendingPayments);
            const result = await service.getPendingPaymentsForFamily('p1');
            expect(result.pendingPayments).toHaveLength(2);
            expect(result.summary.pendingMonths).toBe(2);
            expect(result.summary.totalAmount).toBe(1000);
        });
        it('should throw NotFoundException when person not found', async () => {
            mockPrismaService.person.findUnique.mockResolvedValue(null);
            await expect(service.getPendingPaymentsForFamily('non-existent'))
                .rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('getPaymentSummary', () => {
        it('should return payment summary', async () => {
            mockPrismaService.sandaaPayment.count
                .mockResolvedValueOnce(5)
                .mockResolvedValueOnce(10)
                .mockResolvedValueOnce(2);
            mockPrismaService.sandaaPayment.aggregate.mockResolvedValue({
                _sum: {
                    amount: new library_1.Decimal(8500),
                    paidAmount: new library_1.Decimal(5000),
                },
            });
            const result = await service.getPaymentSummary(1, 2025);
            expect(result.pending).toBe(5);
            expect(result.paid).toBe(10);
            expect(result.partial).toBe(2);
            expect(result.expectedAmount).toBe(8500);
            expect(result.collectedAmount).toBe(5000);
        });
    });
    describe('getAllConfigsByMahalla', () => {
        it('should return configs for all mahallas', async () => {
            const mockMahallas = [
                { id: 'm1', title: 'North Area', isActive: true },
                { id: 'm2', title: 'South Area', isActive: true },
            ];
            const mockGlobalConfig = { id: 'c1', amount: new library_1.Decimal(500) };
            mockPrismaService.mahalla.findMany.mockResolvedValue(mockMahallas);
            mockPrismaService.sandaaConfig.findFirst
                .mockResolvedValueOnce(mockGlobalConfig)
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce({ id: 'c2', amount: new library_1.Decimal(600) })
                .mockResolvedValueOnce(null);
            const result = await service.getAllConfigsByMahalla();
            expect(result).toHaveLength(3);
            expect(result[0].mahallaTitle).toBe('Default (All Mahallas)');
            expect(result[1].isUsingGlobal).toBe(true);
            expect(result[2].isUsingGlobal).toBe(false);
        });
    });
    describe('recordCustomPayment', () => {
        it('should record custom payment across multiple months', async () => {
            const mockPendingPayments = [
                { id: 'pay1', amount: new library_1.Decimal(500), periodMonth: 1, periodYear: 2025 },
                { id: 'pay2', amount: new library_1.Decimal(500), periodMonth: 2, periodYear: 2025 },
            ];
            mockPrismaService.sandaaPayment.findMany
                .mockResolvedValueOnce(mockPendingPayments)
                .mockResolvedValueOnce([]);
            mockPrismaService.sandaaPayment.update.mockResolvedValue({});
            const result = await service.recordCustomPayment('p1', 1000);
            expect(result.amountPaid).toBe(1000);
            expect(result.paymentsAffected).toBe(2);
        });
        it('should throw BadRequestException when no pending payments', async () => {
            mockPrismaService.sandaaPayment.findMany.mockResolvedValue([]);
            await expect(service.recordCustomPayment('p1', 500))
                .rejects.toThrow(common_1.BadRequestException);
        });
    });
});
//# sourceMappingURL=sandaa.service.spec.js.map