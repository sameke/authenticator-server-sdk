import axios, { AxiosResponse } from 'axios';
import jwt from 'jsonwebtoken';
import { Constants } from './Constants';
import { IDto } from './IDto';
import { ITokenResponse } from './ITokenResponse';
import { IUserProfile } from './IUserProfile';

export class Auth {
    public static async exchangeCodeForToken(code: string, clientId: number, clientSecret: string): Promise<string> {
        let url = `${Constants.AUTH_BASE_URL}?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`;

        let response = await axios.get<IDto<ITokenResponse>, AxiosResponse<IDto<ITokenResponse>>>(url);

        if (response.status === 200 && response.data != null && response.data.data != null && response.data.data.token != null) {
            return response.data.data.token;
        } else {
            throw new Error('token request failed');
        }
    }

    public static async getUserProfile(token: string): Promise<IUserProfile> {
        let url = `${Constants.AUTH_BASE_URL}/api/users/me`;
        let response = await axios.get<IDto<IUserProfile>, AxiosResponse<IDto<IUserProfile>>>(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200 && response.data != null && response.data.data != null) {
            return response.data.data;
        }

        throw new Error('user profile request failed');
    }

    public static async validateToken(token: string): Promise<boolean> {
        let url = `${Constants.AUTH_BASE_URL}/api/auth/token?token=${token}`;

        let response = await axios.get<IDto<boolean>, AxiosResponse<IDto<boolean>>>(url);
        if (response.status === 200 && response.data != null && response.data.data != null) {
            return response.data.data;
        }

        return false;
    }

    public static validateTokenLocal(token: string, clientSecret: string): string | object {
        return jwt.verify(token, clientSecret);
    }

    public static async refreshToken(token: string, clientId: number, clientSecret: string): Promise<string> {
        let url = `${Constants.AUTH_BASE_URL}/api/auth/token?token=${token}&client_id=${clientId}&client_secret=${clientSecret}`;

        let response = await axios.post<IDto<boolean>, AxiosResponse<IDto<ITokenResponse>>>(url);
        if (response.status === 200 && response.data != null && response.data.data != null) {
            return response.data.data.token;
        }
    }
}