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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalPeople, activeMembers, totalHouses, totalMahallas, pendingPayments, openIssues,] = await Promise.all([
            this.prisma.person.count(),
            this.prisma.person.count({ where: { memberStatusId: 1 } }),
            this.prisma.house.count({ where: { isActive: true } }),
            this.prisma.mahalla.count({ where: { isActive: true } }),
            this.prisma.sandaaPayment.count({ where: { status: 'pending' } }),
            this.prisma.issue.count({ where: { status: 'open' } }),
        ]);
        return {
            totalPeople,
            activeMembers,
            totalHouses,
            totalMahallas,
            pendingPayments,
            openIssues,
        };
    }
    async getPaymentSummary(year) {
        const payments = await this.prisma.sandaaPayment.groupBy({
            by: ['periodMonth', 'status'],
            where: { periodYear: year },
            _sum: { amount: true, paidAmount: true },
            _count: true,
        });
        return payments;
    }
    async getFinancialSummary(year) {
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year + 1}-01-01`);
        const [incomes, expenses, otherPaymentIncome, otherPaymentExpense] = await Promise.all([
            this.prisma.income.aggregate({
                where: {
                    transactionDate: {
                        gte: startDate,
                        lt: endDate,
                    },
                },
                _sum: { amount: true },
            }),
            this.prisma.expense.aggregate({
                where: {
                    transactionDate: {
                        gte: startDate,
                        lt: endDate,
                    },
                },
                _sum: { amount: true },
            }),
            this.prisma.otherPayment.aggregate({
                where: {
                    status: 'paid',
                    paidAt: {
                        gte: startDate,
                        lt: endDate,
                    },
                    paymentType: {
                        type: 'incoming',
                    },
                },
                _sum: { amount: true },
            }),
            this.prisma.otherPayment.aggregate({
                where: {
                    status: 'paid',
                    paidAt: {
                        gte: startDate,
                        lt: endDate,
                    },
                    paymentType: {
                        type: 'outgoing',
                    },
                },
                _sum: { amount: true },
            }),
        ]);
        const regularIncome = Number(incomes._sum.amount || 0);
        const regularExpense = Number(expenses._sum.amount || 0);
        const paymentIncome = Number(otherPaymentIncome._sum.amount || 0);
        const paymentExpense = Number(otherPaymentExpense._sum.amount || 0);
        const totalIncome = regularIncome + paymentIncome;
        const totalExpense = regularExpense + paymentExpense;
        return {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
            regularIncome,
            regularExpense,
            paymentIncome,
            paymentExpense,
        };
    }
    async getChartData() {
        const currentYear = new Date().getFullYear();
        const [monthlyPayments, monthlyFinance, genderDistribution, issuesByStatus, populationByMahalla, ageDistribution, recentDonations, paymentTrends,] = await Promise.all([
            this.getMonthlyPaymentsData(currentYear),
            this.getMonthlyFinanceData(currentYear),
            this.getGenderDistribution(),
            this.getIssuesByStatus(),
            this.getPopulationByMahalla(),
            this.getAgeDistribution(),
            this.getRecentDonationsData(),
            this.getPaymentTrendsData(currentYear),
        ]);
        return {
            monthlyPayments,
            monthlyFinance,
            genderDistribution,
            issuesByStatus,
            populationByMahalla,
            ageDistribution,
            recentDonations,
            paymentTrends,
        };
    }
    async getMonthlyPaymentsData(year) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const payments = await this.prisma.sandaaPayment.groupBy({
            by: ['periodMonth'],
            where: { periodYear: year },
            _sum: { amount: true, paidAmount: true },
            _count: true,
        });
        return months.map((month, index) => {
            const monthData = payments.find(p => p.periodMonth === index + 1);
            return {
                month,
                expected: Number(monthData?._sum.amount || 0),
                collected: Number(monthData?._sum.paidAmount || 0),
                count: monthData?._count || 0,
            };
        });
    }
    async getMonthlyFinanceData(year) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const [incomeData, expenseData] = await Promise.all([
            this.prisma.$queryRaw `
        SELECT CAST(MONTH(transaction_date) AS SIGNED) as month, CAST(SUM(amount) AS DOUBLE) as total
        FROM incomes
        WHERE YEAR(transaction_date) = ${year}
        GROUP BY MONTH(transaction_date)
        ORDER BY month
      `,
            this.prisma.$queryRaw `
        SELECT CAST(MONTH(transaction_date) AS SIGNED) as month, CAST(SUM(amount) AS DOUBLE) as total
        FROM expenses
        WHERE YEAR(transaction_date) = ${year}
        GROUP BY MONTH(transaction_date)
        ORDER BY month
      `,
        ]);
        return months.map((month, index) => {
            const income = incomeData.find(i => i.month === index + 1);
            const expense = expenseData.find(e => e.month === index + 1);
            return {
                month,
                income: Number(income?.total || 0),
                expense: Number(expense?.total || 0),
                balance: Number(income?.total || 0) - Number(expense?.total || 0),
            };
        });
    }
    async getGenderDistribution() {
        const data = await this.prisma.person.groupBy({
            by: ['gender'],
            _count: true,
        });
        return data.map(d => ({
            name: d.gender === 'male' ? 'Male' : d.gender === 'female' ? 'Female' : 'Unknown',
            value: d._count,
            color: d.gender === 'male' ? '#3b82f6' : d.gender === 'female' ? '#ec4899' : '#94a3b8',
        }));
    }
    async getIssuesByStatus() {
        const data = await this.prisma.issue.groupBy({
            by: ['status'],
            _count: true,
        });
        const statusColors = {
            open: '#ef4444',
            in_progress: '#f59e0b',
            resolved: '#10b981',
            closed: '#6b7280',
        };
        const statusLabels = {
            open: 'Open',
            in_progress: 'In Progress',
            resolved: 'Resolved',
            closed: 'Closed',
        };
        return data.map(d => ({
            name: statusLabels[d.status] || d.status,
            value: d._count,
            color: statusColors[d.status] || '#94a3b8',
        }));
    }
    async getPopulationByMahalla() {
        const mahallas = await this.prisma.mahalla.findMany({
            where: { isActive: true },
            include: {
                houses: {
                    include: {
                        _count: {
                            select: { people: true },
                        },
                    },
                },
            },
        });
        return mahallas.map(m => ({
            name: m.title.length > 15 ? m.title.substring(0, 15) + '...' : m.title,
            fullName: m.title,
            population: m.houses.reduce((sum, h) => sum + h._count.people, 0),
            houses: m.houses.length,
        })).sort((a, b) => b.population - a.population);
    }
    async getAgeDistribution() {
        const people = await this.prisma.person.findMany({
            where: { dob: { not: null } },
            select: { dob: true },
        });
        const ageGroups = {
            '0-14': 0,
            '15-24': 0,
            '25-44': 0,
            '45-64': 0,
            '65+': 0,
        };
        const today = new Date();
        people.forEach(p => {
            if (p.dob) {
                const age = Math.floor((today.getTime() - new Date(p.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
                if (age < 15)
                    ageGroups['0-14']++;
                else if (age < 25)
                    ageGroups['15-24']++;
                else if (age < 45)
                    ageGroups['25-44']++;
                else if (age < 65)
                    ageGroups['45-64']++;
                else
                    ageGroups['65+']++;
            }
        });
        return Object.entries(ageGroups).map(([name, value]) => ({ name, value }));
    }
    async getRecentDonationsData() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const donations = await this.prisma.$queryRaw `
      SELECT
        DATE_FORMAT(donation_date, '%b') as month,
        CAST(SUM(CASE WHEN donation_type = 'money' THEN amount ELSE 0 END) AS DOUBLE) as money,
        CAST(SUM(CASE WHEN donation_type = 'goods' THEN COALESCE(estimated_value, 0) ELSE 0 END) AS DOUBLE) as goods
      FROM donations
      WHERE donation_date >= ${sixMonthsAgo}
      GROUP BY DATE_FORMAT(donation_date, '%b'), MONTH(donation_date)
      ORDER BY MONTH(donation_date)
    `;
        return donations.map(d => ({
            month: d.month,
            money: Number(d.money || 0),
            goods: Number(d.goods || 0),
            total: Number(d.money || 0) + Number(d.goods || 0),
        }));
    }
    async getPaymentTrendsData(year) {
        const data = await this.prisma.sandaaPayment.groupBy({
            by: ['periodMonth', 'status'],
            where: { periodYear: year },
            _count: true,
        });
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map((month, index) => {
            const monthData = data.filter(d => d.periodMonth === index + 1);
            return {
                month,
                paid: monthData.find(d => d.status === 'paid')?._count || 0,
                pending: monthData.find(d => d.status === 'pending')?._count || 0,
                partial: monthData.find(d => d.status === 'partial')?._count || 0,
            };
        });
    }
    async getTopContributors(limit = 10) {
        const contributors = await this.prisma.sandaaPayment.groupBy({
            by: ['personId'],
            where: { status: 'paid' },
            _sum: { paidAmount: true },
            orderBy: { _sum: { paidAmount: 'desc' } },
            take: limit,
        });
        const personIds = contributors.map(c => c.personId);
        const people = await this.prisma.person.findMany({
            where: { id: { in: personIds } },
            select: { id: true, fullName: true },
        });
        return contributors.map(c => {
            const person = people.find(p => p.id === c.personId);
            return {
                name: person?.fullName || 'Unknown',
                amount: Number(c._sum.paidAmount || 0),
            };
        });
    }
    async getUpcomingMeetings(limit = 5) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.prisma.meeting.findMany({
            where: {
                meetingDate: { gte: today },
            },
            orderBy: { meetingDate: 'asc' },
            take: limit,
            select: {
                id: true,
                title: true,
                meetingDate: true,
                meetingTime: true,
                location: true,
            },
        });
    }
    async getRecentIssues(limit = 5) {
        return this.prisma.issue.findMany({
            where: { status: { in: ['open', 'in_progress'] } },
            orderBy: { raisedDate: 'desc' },
            take: limit,
            select: {
                id: true,
                title: true,
                status: true,
                raisedDate: true,
            },
        });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map