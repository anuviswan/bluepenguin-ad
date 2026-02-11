import { api } from '../api/api';

export interface AuthenticationRequest {
    username?: string | null;
    password?: string | null;
}

export interface AuthenticationResponse {
    token?: string | null;
    expiration?: string;
    userId?: string | null;
}

export const AuthService = {
    async login(request: AuthenticationRequest): Promise<AuthenticationResponse> {
        return await api.post<AuthenticationResponse>('/login', request);
    },

    async hashMe(key: string): Promise<string> {
        return await api.get<string>(`/hashme/${key}`);
    }
};
