


export interface ILoginResponse {
    token: string;
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        image?: string;
        isDeleted: boolean;
        emailVerified: boolean;
        status: string;
        needPasswordChange: boolean;
    }
}
