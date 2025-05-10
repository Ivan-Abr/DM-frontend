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
    layerId: number;
}