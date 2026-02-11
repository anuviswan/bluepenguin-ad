import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('auth_token'));
    const userId = ref<string | null>(localStorage.getItem('user_id'));
    const expiration = ref<string | null>(localStorage.getItem('token_expiration'));

    const isAuthenticated = computed(() => !!token.value && !isTokenExpired.value);

    const isTokenExpired = computed(() => {
        if (!expiration.value) return true;

        const expDate = new Date(expiration.value);
        const now = new Date();
        return expDate <= now;
    });

    function setAuth(newToken: string, newUserId: string, newExpiration: string) {
        if (!newToken || newToken === 'undefined' || newToken === 'null') {
            console.error('Attempted to set invalid token in AuthStore');
            return;
        }

        token.value = newToken;
        userId.value = newUserId;
        expiration.value = newExpiration;

        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('user_id', newUserId);
        localStorage.setItem('token_expiration', newExpiration);
    }

    function clearAuth() {
        token.value = null;
        userId.value = null;
        expiration.value = null;

        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('token_expiration');
    }

    return {
        token,
        userId,
        expiration,
        isAuthenticated,
        isTokenExpired,
        setAuth,
        clearAuth
    };
});
