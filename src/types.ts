export interface DecodedToken {
    sub: string;
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