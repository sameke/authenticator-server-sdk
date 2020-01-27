export interface ITokenPayload {
    exp: number;
    data: {
        userId: number;
        appId: number;
        isVerified: boolean;
    };
}