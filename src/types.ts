export interface DecodedToken {
    sub: string;
    id: string;
    roles: string[];
    iat: number;
    exp: number;
}

export interface Layer {
    id: string;
    name: string;
}

export interface Factor {
    id: string;
    name: string;
    shortname: string;
}

export interface FactorUpt {
    id: string;
    name: string | null;
    shortname: string | null;
}

export interface ViewQuestionDTO {
    id: string;
    name: string;
    layerName: string;
    factorShortname: string;
    annotation?: string;
}

export interface CreateQuestionDTO {
    layerId: string;
    factorId: string;
    name: string;
    annotation?: string;
}

export interface UpdateQuestionDTO {
    layerId?: string;
    factorId?: string;
    name?: string;
    annotation?: string;
}

export interface Mark {
    id: string;
    questionId: string;
    annotation: string;
    value: number;
}

export interface ViewMarkDTO {
    id: string;
    questionId: string;
    annotation: string;
    value: number;
}

export interface CreateMarkDTO {
    questionId: string;
    annotation: string;
    value: number;
}

export interface UpdateMarkDTO {
    questionId?: string;
    annotation?: string;
    value?: number;
}

export interface ViewUserDTO {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    password?: string;
}

export interface ViewOrganizationDTO {
    id: string;
    expertId: string;
    name: string;
    annotation: string;
    contacts: string;
}

export interface CreateOrganizationDTO {
    expertId: string;
    name: string;
    annotation: string;
    contacts: string;
}

export interface UpdateOrganizationDTO {
    expertId?: string;
    name?: string;
    annotation?: string;
    contacts?: string;
}

export interface ViewRecommendationDTO {
    id: string;
    layerName: string;
    value: number;
    annotation: string;
}

export interface CreateRecommendationDTO {
    layerId: string;
    value: number;
    annotation: string;
}

export interface UpdateRecommendationDTO {
    layerId?: string;
    value?: number;
    annotation?: string;
}

export interface Milestone {
    id: string;
    dateFrom: string;
    dateTo: string;
    year: number;
}