import { PrismaService } from '../../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalPeople: number;
        activeMembers: number;
        totalHouses: number;
        totalMahallas: number;
        pendingPayments: number;
        openIssues: number;
    }>;
    getPaymentSummary(year: number): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.SandaaPaymentGroupByOutputType, ("status" | "periodMonth")[]> & {
        _count: number;
        _sum: {
            amount: import("@prisma/client/runtime/library").Decimal;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
        };
    })[]>;
    getFinancialSummary(year: number): Promise<{
        totalIncome: number;
        totalExpense: number;
        balance: number;
        regularIncome: number;
        regularExpense: number;
        paymentIncome: number;
        paymentExpense: number;
    }>;
    getChartData(): Promise<{
        monthlyPayments: {
            month: string;
            expected: number;
            collected: number;
            count: number;
        }[];
        monthlyFinance: {
            month: string;
            income: number;
            expense: number;
            balance: number;
        }[];
        genderDistribution: {
            name: string;
            value: number;
            color: string;
        }[];
        issuesByStatus: {
            name: string;
            value: number;
            color: string;
        }[];
        populationByMahalla: {
            name: string;
            fullName: string;
            population: number;
            houses: number;
        }[];
        ageDistribution: {
            name: string;
            value: number;
        }[];
        recentDonations: {
            month: string;
            money: number;
            goods: number;
            total: number;
        }[];
        paymentTrends: {
            month: string;
            paid: number;
            pending: number;
            partial: number;
        }[];
    }>;
    private getMonthlyPaymentsData;
    private getMonthlyFinanceData;
    private getGenderDistribution;
    private getIssuesByStatus;
    private getPopulationByMahalla;
    private getAgeDistribution;
    private getRecentDonationsData;
    private getPaymentTrendsData;
    getTopContributors(limit?: number): Promise<{
        name: string;
        amount: number;
    }[]>;
    getUpcomingMeetings(limit?: number): Promise<{
        id: string;
        title: string;
        meetingDate: Date;
        meetingTime: Date;
        location: string;
    }[]>;
    getRecentIssues(limit?: number): Promise<{
        id: string;
        title: string;
        raisedDate: Date;
        status: string;
    }[]>;
}
