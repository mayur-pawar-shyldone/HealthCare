import axios, {} from 'axios';
import { store } from '@/store';
import { clearSession, updateTokens } from '@/store/authSlice';
const api = axios.create({
    baseURL: '/api',
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('hc_access');
    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    config.headers['Cache-Control'] = 'no-cache';
    config.headers.Pragma = 'no-cache';
    return config;
});
let refreshing = null;
api.interceptors.response.use((res) => res, async (error) => {
    const original = error.config;
    if (!original || error.response?.status !== 401 || original.url?.includes('/auth/')) {
        return Promise.reject(error);
    }
    if (!refreshing) {
        refreshing = (async () => {
            const refreshToken = localStorage.getItem('hc_refresh');
            if (!refreshToken)
                return null;
            try {
                const { data } = await axios.post('/api/auth/refresh', { refreshToken });
                const payload = data.data ?? data;
                store.dispatch(updateTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken }));
                return payload.accessToken;
            }
            catch (refreshError) {
                const status = refreshError.response?.status;
                if (status === 401 || status === 403) {
                    store.dispatch(clearSession());
                }
                return null;
            }
            finally {
                refreshing = null;
            }
        })();
    }
    const token = await refreshing;
    if (!token) {
        const stillAuthed = Boolean(localStorage.getItem('hc_access') && localStorage.getItem('hc_refresh'));
        if (!stillAuthed) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
    original.headers.Authorization = `Bearer ${token}`;
    return api(original);
});
export function unwrap(payload) {
    if (payload && typeof payload === 'object' && 'data' in payload) {
        return payload.data;
    }
    return payload;
}
export default api;
