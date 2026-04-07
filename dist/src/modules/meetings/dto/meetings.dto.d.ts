export declare class CreateMeetingDto {
    title?: string;
    meetingDate: string;
    meetingTime?: string;
    location?: string;
    attendees?: string;
    agenda?: string;
    minutes?: string;
}
export declare class UpdateMeetingDto {
    title?: string;
    meetingDate?: string;
    meetingTime?: string;
    location?: string;
    attendees?: string;
    agenda?: string;
    minutes?: string;
}
export declare class CreateDecisionDto {
    decision: string;
    relatedIssueId?: string;
}
export declare class MeetingQueryDto {
    search?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}
