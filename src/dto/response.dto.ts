

export interface RequestOptions<T = Record<string, string>> {
    headers?: Record<string, string>;
    queryParams?: T;
    formId: string;
}

export interface QuestionType {
    id: string;
    name: string;
    type: string;
    value: string | number | boolean;
}

export interface CalculationType {
    id: string;
    name: string;
    type: string;
    value: string;
}

export interface UrlParameterType {
    id: string;
    name: string;
    value: string;
}
export interface DocumentType {
    id: string;
    name: string;
    value: string;
}

export interface QuizType {
    score: number;
    maxScore: number;
}
export interface Responses {
    submissionId: string;
    submissionTime: string;
    lastUpdatedAt: string;
    questions: QuestionType[];
    calculations: CalculationType[];
    urlParameters: UrlParameterType[];
    quiz: QuizType;
    documents: DocumentType[];
}

export interface PaginatedResponse {
    responses: Responses[];
    totalResponses: number;
    pageCount: number;
}

export interface PageOptions {
    page: number | string;
    pageSize: number | string;
}