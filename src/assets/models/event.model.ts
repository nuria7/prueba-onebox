export interface Event {
    id?: string;
    title?: string;
    subtitle?: string;
    image?: string;
    place?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    sessions?: SessionId[];
}

export interface SessionId {
    date: string;
    availability: number;
}

export interface Root {
    session: SessionId;
    quantity: number;
    locations: Event;
}

export interface EventData {
    event: Event;
    sessions: SessionId[];
}

export interface EmitFromCartEventData {
    sessionId: SessionId;
    index: number;
}
