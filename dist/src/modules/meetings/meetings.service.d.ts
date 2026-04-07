import { PrismaService } from '../../prisma/prisma.service';
import { CreateMeetingDto, UpdateMeetingDto, CreateDecisionDto, MeetingQueryDto } from './dto/meetings.dto';
export declare class MeetingsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: MeetingQueryDto): Promise<{
        data: ({
            _count: {
                decisions: number;
            };
            decisions: ({
                relatedIssue: {
                    id: string;
                    title: string;
                    status: string;
                };
            } & {
                id: string;
                createdAt: Date;
                decision: string;
                meetingId: string;
                relatedIssueId: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            createdBy: string | null;
            title: string | null;
            minutes: string | null;
            meetingDate: Date;
            meetingTime: Date | null;
            location: string | null;
            attendees: string | null;
            agenda: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findById(id: string): Promise<{
        decisions: ({
            relatedIssue: {
                id: string;
                title: string;
                status: string;
            };
        } & {
            id: string;
            createdAt: Date;
            decision: string;
            meetingId: string;
            relatedIssueId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        createdBy: string | null;
        title: string | null;
        minutes: string | null;
        meetingDate: Date;
        meetingTime: Date | null;
        location: string | null;
        attendees: string | null;
        agenda: string | null;
    }>;
    create(dto: CreateMeetingDto, createdBy?: string): Promise<{
        decisions: {
            id: string;
            createdAt: Date;
            decision: string;
            meetingId: string;
            relatedIssueId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        createdBy: string | null;
        title: string | null;
        minutes: string | null;
        meetingDate: Date;
        meetingTime: Date | null;
        location: string | null;
        attendees: string | null;
        agenda: string | null;
    }>;
    update(id: string, dto: UpdateMeetingDto): Promise<{
        decisions: ({
            relatedIssue: {
                id: string;
                title: string;
                status: string;
            };
        } & {
            id: string;
            createdAt: Date;
            decision: string;
            meetingId: string;
            relatedIssueId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        createdBy: string | null;
        title: string | null;
        minutes: string | null;
        meetingDate: Date;
        meetingTime: Date | null;
        location: string | null;
        attendees: string | null;
        agenda: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        createdBy: string | null;
        title: string | null;
        minutes: string | null;
        meetingDate: Date;
        meetingTime: Date | null;
        location: string | null;
        attendees: string | null;
        agenda: string | null;
    }>;
    addDecision(meetingId: string, dto: CreateDecisionDto): Promise<{
        meeting: {
            id: string;
            title: string;
            meetingDate: Date;
        };
        relatedIssue: {
            id: string;
            title: string;
            status: string;
        };
    } & {
        id: string;
        createdAt: Date;
        decision: string;
        meetingId: string;
        relatedIssueId: string | null;
    }>;
    removeDecision(decisionId: string): Promise<{
        id: string;
        createdAt: Date;
        decision: string;
        meetingId: string;
        relatedIssueId: string | null;
    }>;
    updateDecision(decisionId: string, dto: CreateDecisionDto): Promise<{
        relatedIssue: {
            id: string;
            title: string;
            status: string;
        };
    } & {
        id: string;
        createdAt: Date;
        decision: string;
        meetingId: string;
        relatedIssueId: string | null;
    }>;
    getSummary(): Promise<{
        totalMeetings: number;
        recentMeetings: number;
        upcomingMeetings: {
            id: string;
            createdAt: Date;
            createdBy: string | null;
            title: string | null;
            minutes: string | null;
            meetingDate: Date;
            meetingTime: Date | null;
            location: string | null;
            attendees: string | null;
            agenda: string | null;
        }[];
        totalDecisions: number;
        latestMeetings: ({
            _count: {
                decisions: number;
            };
        } & {
            id: string;
            createdAt: Date;
            createdBy: string | null;
            title: string | null;
            minutes: string | null;
            meetingDate: Date;
            meetingTime: Date | null;
            location: string | null;
            attendees: string | null;
            agenda: string | null;
        })[];
    }>;
    getCalendarMeetings(year: number, month: number): Promise<({
        _count: {
            decisions: number;
        };
    } & {
        id: string;
        createdAt: Date;
        createdBy: string | null;
        title: string | null;
        minutes: string | null;
        meetingDate: Date;
        meetingTime: Date | null;
        location: string | null;
        attendees: string | null;
        agenda: string | null;
    })[]>;
}
