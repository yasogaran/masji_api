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
exports.DonationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DonationsService = class DonationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCategories(includeInactive = false) {
        return this.prisma.donationCategory.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    async getCategoryById(id) {
        const category = await this.prisma.donationCategory.findUnique({
            where: { id },
        });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return category;
    }
    async createCategory(dto) {
        return this.prisma.donationCategory.create({
            data: {
                name: dto.name,
                type: dto.type,
                isActive: dto.isActive ?? true,
            },
        });
    }
    async updateCategory(id, dto) {
        await this.getCategoryById(id);
        return this.prisma.donationCategory.update({
            where: { id },
            data: dto,
        });
    }
    async deleteCategory(id) {
        await this.getCategoryById(id);
        return this.prisma.donationCategory.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async getDonations(query) {
        const { year, type, categoryId, search, page = 1, limit = 20 } = query;
        const where = {};
        if (year) {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);
            where.donationDate = { gte: startDate, lte: endDate };
        }
        if (type)
            where.donationType = type;
        if (categoryId)
            where.categoryId = categoryId;
        if (search) {
            where.OR = [
                { donorName: { contains: search, mode: 'insensitive' } },
                { donor: { fullName: { contains: search, mode: 'insensitive' } } },
                { itemDescription: { contains: search, mode: 'insensitive' } },
                { notes: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [donations, total] = await Promise.all([
            this.prisma.donation.findMany({
                where,
                include: {
                    donor: { select: { id: true, fullName: true, phone: true } },
                    category: true,
                },
                orderBy: { donationDate: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.donation.count({ where }),
        ]);
        return {
            data: donations,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getDonationById(id) {
        const donation = await this.prisma.donation.findUnique({
            where: { id },
            include: {
                donor: { select: { id: true, fullName: true, phone: true } },
                category: true,
            },
        });
        if (!donation)
            throw new common_1.NotFoundException('Donation not found');
        return donation;
    }
    async createDonation(dto, createdBy) {
        return this.prisma.donation.create({
            data: {
                donorId: dto.donorId,
                donorName: dto.donorName,
                donorPhone: dto.donorPhone,
                categoryId: dto.categoryId,
                donationType: dto.donationType,
                amount: dto.amount,
                itemDescription: dto.itemDescription,
                quantity: dto.quantity,
                unit: dto.unit,
                estimatedValue: dto.estimatedValue,
                donationDate: new Date(dto.donationDate),
                notes: dto.notes,
                createdBy,
            },
            include: {
                donor: { select: { id: true, fullName: true, phone: true } },
                category: true,
            },
        });
    }
    async updateDonation(id, dto) {
        await this.getDonationById(id);
        return this.prisma.donation.update({
            where: { id },
            data: {
                ...dto,
                donationDate: dto.donationDate ? new Date(dto.donationDate) : undefined,
            },
            include: {
                donor: { select: { id: true, fullName: true, phone: true } },
                category: true,
            },
        });
    }
    async deleteDonation(id) {
        await this.getDonationById(id);
        return this.prisma.donation.delete({ where: { id } });
    }
    async getDistributions(query) {
        const { year, type, categoryId, search, page = 1, limit = 20 } = query;
        const where = {};
        if (year) {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);
            where.distributionDate = { gte: startDate, lte: endDate };
        }
        if (type)
            where.distributionType = type;
        if (categoryId)
            where.categoryId = categoryId;
        if (search) {
            where.OR = [
                { recipientName: { contains: search, mode: 'insensitive' } },
                { recipient: { fullName: { contains: search, mode: 'insensitive' } } },
                { itemDescription: { contains: search, mode: 'insensitive' } },
                { reason: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [distributions, total] = await Promise.all([
            this.prisma.donationDistribution.findMany({
                where,
                include: {
                    recipient: { select: { id: true, fullName: true, phone: true } },
                    category: true,
                },
                orderBy: { distributionDate: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.donationDistribution.count({ where }),
        ]);
        return {
            data: distributions,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getDistributionById(id) {
        const distribution = await this.prisma.donationDistribution.findUnique({
            where: { id },
            include: {
                recipient: { select: { id: true, fullName: true, phone: true } },
                category: true,
            },
        });
        if (!distribution)
            throw new common_1.NotFoundException('Distribution not found');
        return distribution;
    }
    async createDistribution(dto, createdBy) {
        const stock = await this.getStockByCategory(dto.categoryId);
        if (dto.distributionType === 'money') {
            if (dto.amount && Number(dto.amount) > stock.availableMoney) {
                throw new common_1.BadRequestException(`Insufficient funds. Available: ${stock.availableMoney.toFixed(2)}, Requested: ${dto.amount}`);
            }
        }
        else if (dto.distributionType === 'goods') {
            if (dto.quantity && dto.quantity > stock.availableQuantity) {
                throw new common_1.BadRequestException(`Insufficient stock. Available: ${stock.availableQuantity} ${stock.unit || 'units'}, Requested: ${dto.quantity}`);
            }
        }
        return this.prisma.donationDistribution.create({
            data: {
                recipientId: dto.recipientId,
                recipientName: dto.recipientName,
                recipientPhone: dto.recipientPhone,
                recipientAddress: dto.recipientAddress,
                categoryId: dto.categoryId,
                distributionType: dto.distributionType,
                amount: dto.amount,
                itemDescription: dto.itemDescription,
                quantity: dto.quantity,
                unit: dto.unit,
                reason: dto.reason,
                distributionDate: new Date(dto.distributionDate),
                notes: dto.notes,
                createdBy,
            },
            include: {
                recipient: { select: { id: true, fullName: true, phone: true } },
                category: true,
            },
        });
    }
    async updateDistribution(id, dto) {
        await this.getDistributionById(id);
        return this.prisma.donationDistribution.update({
            where: { id },
            data: {
                ...dto,
                distributionDate: dto.distributionDate ? new Date(dto.distributionDate) : undefined,
            },
            include: {
                recipient: { select: { id: true, fullName: true, phone: true } },
                category: true,
            },
        });
    }
    async deleteDistribution(id) {
        await this.getDistributionById(id);
        return this.prisma.donationDistribution.delete({ where: { id } });
    }
    async getDonationsSummary(year) {
        const where = {};
        if (year) {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);
            where.donationDate = { gte: startDate, lte: endDate };
        }
        const [moneyDonations, goodsDonations, categories, monthlyDataRaw] = await Promise.all([
            this.prisma.donation.aggregate({
                where: { ...where, donationType: 'money' },
                _sum: { amount: true },
                _count: true,
            }),
            this.prisma.donation.aggregate({
                where: { ...where, donationType: 'goods' },
                _sum: { estimatedValue: true },
                _count: true,
            }),
            this.prisma.donation.groupBy({
                by: ['categoryId'],
                where,
                _sum: { amount: true, estimatedValue: true },
                _count: true,
            }),
            year
                ? this.prisma.$queryRaw `
            SELECT
              CAST(MONTH(donation_date) AS SIGNED) as month,
              CAST(SUM(CASE WHEN donation_type = 'money' THEN amount ELSE 0 END) AS DOUBLE) as money_amount,
              CAST(SUM(CASE WHEN donation_type = 'goods' THEN COALESCE(estimated_value, 0) ELSE 0 END) AS DOUBLE) as goods_value,
              CAST(COUNT(*) AS SIGNED) as count
            FROM donations
            WHERE YEAR(donation_date) = ${year}
            GROUP BY MONTH(donation_date)
            ORDER BY month
          `
                : this.prisma.$queryRaw `
            SELECT
              CAST(MONTH(donation_date) AS SIGNED) as month,
              CAST(SUM(CASE WHEN donation_type = 'money' THEN amount ELSE 0 END) AS DOUBLE) as money_amount,
              CAST(SUM(CASE WHEN donation_type = 'goods' THEN COALESCE(estimated_value, 0) ELSE 0 END) AS DOUBLE) as goods_value,
              CAST(COUNT(*) AS SIGNED) as count
            FROM donations
            GROUP BY MONTH(donation_date)
            ORDER BY month
          `,
        ]);
        const monthlyData = monthlyDataRaw.map((row) => ({
            month: Number(row.month),
            money_amount: Number(row.money_amount) || 0,
            goods_value: Number(row.goods_value) || 0,
            count: Number(row.count),
        }));
        const categoryIds = categories.map(c => c.categoryId);
        const categoryDetails = await this.prisma.donationCategory.findMany({
            where: { id: { in: categoryIds } },
        });
        const categoryMap = new Map(categoryDetails.map(c => [c.id, c]));
        return {
            totalMoneyReceived: Number(moneyDonations._sum.amount) || 0,
            totalGoodsValue: Number(goodsDonations._sum.estimatedValue) || 0,
            moneyDonationsCount: moneyDonations._count,
            goodsDonationsCount: goodsDonations._count,
            byCategory: categories.map(c => ({
                category: categoryMap.get(c.categoryId),
                moneyAmount: Number(c._sum.amount) || 0,
                goodsValue: Number(c._sum.estimatedValue) || 0,
                count: c._count,
            })),
            monthlyData,
        };
    }
    async getDistributionsSummary(year) {
        const where = {};
        if (year) {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);
            where.distributionDate = { gte: startDate, lte: endDate };
        }
        const [moneyDistributions, goodsDistributions, categories] = await Promise.all([
            this.prisma.donationDistribution.aggregate({
                where: { ...where, distributionType: 'money' },
                _sum: { amount: true },
                _count: true,
            }),
            this.prisma.donationDistribution.aggregate({
                where: { ...where, distributionType: 'goods' },
                _count: true,
            }),
            this.prisma.donationDistribution.groupBy({
                by: ['categoryId'],
                where,
                _sum: { amount: true },
                _count: true,
            }),
        ]);
        const categoryIds = categories.map(c => c.categoryId);
        const categoryDetails = await this.prisma.donationCategory.findMany({
            where: { id: { in: categoryIds } },
        });
        const categoryMap = new Map(categoryDetails.map(c => [c.id, c]));
        return {
            totalMoneyDistributed: Number(moneyDistributions._sum.amount) || 0,
            moneyDistributionsCount: moneyDistributions._count,
            goodsDistributionsCount: goodsDistributions._count,
            byCategory: categories.map(c => ({
                category: categoryMap.get(c.categoryId),
                amount: Number(c._sum.amount) || 0,
                count: c._count,
            })),
        };
    }
    async getAvailableYears() {
        const [donationYears, distributionYears] = await Promise.all([
            this.prisma.$queryRaw `
        SELECT DISTINCT CAST(YEAR(donation_date) AS SIGNED) as year
        FROM donations
        ORDER BY year DESC
      `,
            this.prisma.$queryRaw `
        SELECT DISTINCT CAST(YEAR(distribution_date) AS SIGNED) as year
        FROM donation_distributions
        ORDER BY year DESC
      `,
        ]);
        const years = new Set([
            ...donationYears.map(y => y.year),
            ...distributionYears.map(y => y.year),
        ]);
        return Array.from(years).sort((a, b) => b - a);
    }
    async getStockByCategory(categoryId) {
        const category = await this.getCategoryById(categoryId);
        const [moneyDonations, goodsDonations] = await Promise.all([
            this.prisma.donation.aggregate({
                where: { categoryId, donationType: 'money' },
                _sum: { amount: true },
            }),
            this.prisma.donation.aggregate({
                where: { categoryId, donationType: 'goods' },
                _sum: { quantity: true, estimatedValue: true },
            }),
        ]);
        const [moneyDistributions, goodsDistributions] = await Promise.all([
            this.prisma.donationDistribution.aggregate({
                where: { categoryId, distributionType: 'money' },
                _sum: { amount: true },
            }),
            this.prisma.donationDistribution.aggregate({
                where: { categoryId, distributionType: 'goods' },
                _sum: { quantity: true },
            }),
        ]);
        const unitInfo = await this.prisma.donation.findFirst({
            where: { categoryId, donationType: 'goods', unit: { not: null } },
            select: { unit: true },
            orderBy: { createdAt: 'desc' },
        });
        const totalMoneyReceived = Number(moneyDonations._sum.amount) || 0;
        const totalMoneyDistributed = Number(moneyDistributions._sum.amount) || 0;
        const totalGoodsReceived = Number(goodsDonations._sum.quantity) || 0;
        const totalGoodsDistributed = Number(goodsDistributions._sum.quantity) || 0;
        const totalGoodsValue = Number(goodsDonations._sum.estimatedValue) || 0;
        return {
            categoryId,
            categoryName: category.name,
            categoryType: category.type,
            totalMoneyReceived,
            totalMoneyDistributed,
            availableMoney: totalMoneyReceived - totalMoneyDistributed,
            totalGoodsReceived,
            totalGoodsDistributed,
            availableQuantity: totalGoodsReceived - totalGoodsDistributed,
            totalGoodsValue,
            unit: unitInfo?.unit || null,
        };
    }
    async getAllStock() {
        const categories = await this.prisma.donationCategory.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
        const stockLevels = await Promise.all(categories.map(async (cat) => {
            const stock = await this.getStockByCategory(cat.id);
            return stock;
        }));
        const totals = stockLevels.reduce((acc, stock) => ({
            totalMoneyReceived: acc.totalMoneyReceived + stock.totalMoneyReceived,
            totalMoneyDistributed: acc.totalMoneyDistributed + stock.totalMoneyDistributed,
            availableMoney: acc.availableMoney + stock.availableMoney,
            totalGoodsValue: acc.totalGoodsValue + stock.totalGoodsValue,
        }), { totalMoneyReceived: 0, totalMoneyDistributed: 0, availableMoney: 0, totalGoodsValue: 0 });
        return {
            categories: stockLevels,
            totals,
        };
    }
    async carryForwardStock(fromYear, toYear, createdBy) {
        if (toYear <= fromYear) {
            throw new common_1.BadRequestException('Target year must be greater than source year');
        }
        const existingCarryForward = await this.prisma.donation.findFirst({
            where: {
                isCarryForward: true,
                carryFromYear: fromYear,
                donationDate: {
                    gte: new Date(toYear, 0, 1),
                    lte: new Date(toYear, 11, 31),
                },
            },
        });
        if (existingCarryForward) {
            throw new common_1.BadRequestException(`Stock has already been carried forward from ${fromYear} to ${toYear}`);
        }
        const categories = await this.prisma.donationCategory.findMany({
            where: { isActive: true },
        });
        const carryForwardEntries = [];
        for (const category of categories) {
            const yearEndDate = new Date(fromYear, 11, 31);
            const [moneyDonations, goodsDonations] = await Promise.all([
                this.prisma.donation.aggregate({
                    where: {
                        categoryId: category.id,
                        donationType: 'money',
                        donationDate: { lte: yearEndDate },
                    },
                    _sum: { amount: true },
                }),
                this.prisma.donation.aggregate({
                    where: {
                        categoryId: category.id,
                        donationType: 'goods',
                        donationDate: { lte: yearEndDate },
                    },
                    _sum: { quantity: true, estimatedValue: true },
                }),
            ]);
            const [moneyDistributions, goodsDistributions] = await Promise.all([
                this.prisma.donationDistribution.aggregate({
                    where: {
                        categoryId: category.id,
                        distributionType: 'money',
                        distributionDate: { lte: yearEndDate },
                    },
                    _sum: { amount: true },
                }),
                this.prisma.donationDistribution.aggregate({
                    where: {
                        categoryId: category.id,
                        distributionType: 'goods',
                        distributionDate: { lte: yearEndDate },
                    },
                    _sum: { quantity: true },
                }),
            ]);
            const availableMoney = (Number(moneyDonations._sum.amount) || 0) - (Number(moneyDistributions._sum.amount) || 0);
            const availableQuantity = (Number(goodsDonations._sum.quantity) || 0) - (Number(goodsDistributions._sum.quantity) || 0);
            const goodsValue = Number(goodsDonations._sum.estimatedValue) || 0;
            const unitInfo = await this.prisma.donation.findFirst({
                where: { categoryId: category.id, donationType: 'goods', unit: { not: null } },
                select: { unit: true },
                orderBy: { createdAt: 'desc' },
            });
            if (availableMoney > 0 && category.type === 'money') {
                carryForwardEntries.push({
                    categoryId: category.id,
                    donationType: 'money',
                    amount: availableMoney,
                    donationDate: new Date(toYear, 0, 1),
                    notes: `Carried forward from ${fromYear}`,
                    isCarryForward: true,
                    carryFromYear: fromYear,
                    createdBy,
                });
            }
            if (availableQuantity > 0 && category.type === 'goods') {
                carryForwardEntries.push({
                    categoryId: category.id,
                    donationType: 'goods',
                    quantity: availableQuantity,
                    unit: unitInfo?.unit,
                    estimatedValue: goodsValue > 0 ? goodsValue : null,
                    itemDescription: `Stock carried forward from ${fromYear}`,
                    donationDate: new Date(toYear, 0, 1),
                    notes: `Carried forward from ${fromYear}`,
                    isCarryForward: true,
                    carryFromYear: fromYear,
                    createdBy,
                });
            }
        }
        if (carryForwardEntries.length > 0) {
            await this.prisma.donation.createMany({
                data: carryForwardEntries,
            });
        }
        return {
            message: `Successfully carried forward ${carryForwardEntries.length} entries from ${fromYear} to ${toYear}`,
            entriesCreated: carryForwardEntries.length,
            entries: carryForwardEntries.map(e => ({
                category: categories.find(c => c.id === e.categoryId)?.name,
                type: e.donationType,
                amount: e.amount,
                quantity: e.quantity,
                unit: e.unit,
            })),
        };
    }
    async getYearlyStockSummary(year) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        const carryForwardDonations = await this.prisma.donation.findMany({
            where: {
                isCarryForward: true,
                donationDate: { gte: startDate, lte: endDate },
            },
            include: { category: true },
        });
        const regularDonations = await this.prisma.donation.aggregate({
            where: {
                isCarryForward: false,
                donationDate: { gte: startDate, lte: endDate },
            },
            _sum: { amount: true, estimatedValue: true },
            _count: true,
        });
        const distributions = await this.prisma.donationDistribution.aggregate({
            where: {
                distributionDate: { gte: startDate, lte: endDate },
            },
            _sum: { amount: true },
            _count: true,
        });
        const carryForwardMoney = carryForwardDonations
            .filter(d => d.donationType === 'money')
            .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
        const carryForwardGoodsValue = carryForwardDonations
            .filter(d => d.donationType === 'goods')
            .reduce((sum, d) => sum + (Number(d.estimatedValue) || 0), 0);
        return {
            year,
            carryForward: {
                money: carryForwardMoney,
                goodsValue: carryForwardGoodsValue,
                entries: carryForwardDonations.map(d => ({
                    category: d.category.name,
                    type: d.donationType,
                    amount: d.amount ? Number(d.amount) : null,
                    quantity: d.quantity,
                    unit: d.unit,
                    fromYear: d.carryFromYear,
                })),
            },
            regularDonations: {
                totalMoney: Number(regularDonations._sum.amount) || 0,
                totalGoodsValue: Number(regularDonations._sum.estimatedValue) || 0,
                count: regularDonations._count,
            },
            distributions: {
                totalMoney: Number(distributions._sum.amount) || 0,
                count: distributions._count,
            },
            totalAvailable: {
                money: carryForwardMoney + (Number(regularDonations._sum.amount) || 0) - (Number(distributions._sum.amount) || 0),
            },
        };
    }
};
exports.DonationsService = DonationsService;
exports.DonationsService = DonationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DonationsService);
//# sourceMappingURL=donations.service.js.map