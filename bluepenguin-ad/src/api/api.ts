const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://localhost:7022/').replace(/\/$/, '');

export interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options;

    let url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }

    const token = localStorage.getItem('auth_token');
    const isValidToken = token && token !== 'null' && token !== 'undefined';

    console.log(`[API Request] ${init.method || 'GET'} ${url}`);
    if (isValidToken) {
        console.log(`[API Auth] Sending Bearer token (first 15 chars): ${token.substring(0, 15)}...`);
    } else {
        console.log(`[API Auth] No valid token found in localStorage`);
    }

    const response = await fetch(url, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...(isValidToken ? { 'Authorization': `Bearer ${token}` } : {}),
            ...init.headers,
        },
    });

    if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData.message) errorMessage = errorData.message;
        } catch {
            // Not JSON error, use default
        }
        throw new Error(errorMessage);
    }

    const text = await response.text();
    if (!text) return null as unknown as T;

    try {
        return JSON.parse(text);
    } catch {
        return text as unknown as T;
    }
}

export const api = {
    get: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
        request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined
        }),

    put: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
        request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined
        }),

    delete: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'DELETE' }),
};
