export declare class CreateIssueDto {
    title: string;
    description?: string;
    raisedBy?: string;
    raisedDate: string;
    status?: string;
}
export declare class UpdateIssueDto {
    title?: string;
    description?: string;
    status?: string;
}
export declare class ResolveIssueDto {
    resolution: string;
    resolvedDate: string;
}
export declare class IssueQueryDto {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
}
