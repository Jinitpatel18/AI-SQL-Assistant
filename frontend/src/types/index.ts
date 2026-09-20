export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface QueryResult {
    rows: Record<string, any>[];
    rowCount: number;
    truncated: boolean;
}

export interface QueryResponse {
    question: string;
    generatedSql: string;
    result: QueryResult;
}

export interface HistoryItem {
    id: string;
    question: string;
    generatedSql: string;
    result: QueryResult;
    createdAt: string;
    userId: string;
}