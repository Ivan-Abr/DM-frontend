// types.ts
export interface DecodedToken {
    sub: string;
    roles: string[];
    iat: number;
    exp: number;
}