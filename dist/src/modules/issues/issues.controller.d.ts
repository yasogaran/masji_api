import { IssuesService } from './issues.service';
import { CreateIssueDto, UpdateIssueDto, ResolveIssueDto, IssueQueryDto } from './dto/issues.dto';
export declare class IssuesController {
    private issuesService;
    constructor(issuesService: IssuesService);
    findAll(query: IssueQueryDto): Promise<{
        data: ({
            raisedByPerson: {
                id: string;
                fullName: string;
                phone: string;
            };
            meetingDecisions: ({
                meeting: {
                    id: string;
                    title: string;
                    meetingDate: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                decision: string;
                meetingId: string;
                relatedIssueId: string | null;
            })[];
        } & {
            resolution: string | null;
            id: string;
            createdAt: Date;
            title: string;
            description: string | null;
            raisedDate: Date;
            status: string;
            resolvedDate: Date | null;
            raisedBy: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getSummary(): Promise<{
        open: number;
        inProgress: number;
        resolved: number;
        closed: number;
        total: number;
        recentIssues: ({
            raisedByPerson: {
                id: string;
                fullName: string;
            };
        } & {
            resolution: string | null;
            id: string;
            createdAt: Date;
            title: string;
            description: string | null;
            raisedDate: Date;
            status: string;
            resolvedDate: Date | null;
            raisedBy: string | null;
        })[];
    }>;
    findById(id: string): Promise<{
        raisedByPerson: {
            id: string;
            fullName: string;
            phone: string;
        };
        meetingDecisions: ({
            meeting: {
                id: string;
                title: string;
                meetingDate: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            decision: string;
            meetingId: string;
            relatedIssueId: string | null;
        })[];
    } & {
        resolution: string | null;
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        raisedDate: Date;
        status: string;
        resolvedDate: Date | null;
        raisedBy: string | null;
    }>;
    create(dto: CreateIssueDto): Promise<{
        raisedByPerson: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        resolution: string | null;
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        raisedDate: Date;
        status: string;
        resolvedDate: Date | null;
        raisedBy: string | null;
    }>;
    update(id: string, dto: UpdateIssueDto): Promise<{
        raisedByPerson: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        resolution: string | null;
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        raisedDate: Date;
        status: string;
        resolvedDate: Date | null;
        raisedBy: string | null;
    }>;
    resolve(id: string, dto: ResolveIssueDto): Promise<{
        raisedByPerson: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        resolution: string | null;
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        raisedDate: Date;
        status: string;
        resolvedDate: Date | null;
        raisedBy: string | null;
    }>;
    reopen(id: string): Promise<{
        raisedByPerson: {
            id: string;
            fullName: string;
            phone: string;
        };
    } & {
        resolution: string | null;
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        raisedDate: Date;
        status: string;
        resolvedDate: Date | null;
        raisedBy: string | null;
    }>;
    delete(id: string): Promise<{
        resolution: string | null;
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        raisedDate: Date;
        status: string;
        resolvedDate: Date | null;
        raisedBy: string | null;
    }>;
}
