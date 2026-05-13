const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

export const getAdmin = () => {
    const admin = localStorage.getItem("admin");
    try {
        return admin ? JSON.parse(admin) : null;
    } catch {
        return null;
    }
};

export const setAdmin = (admin) => localStorage.setItem("admin", JSON.stringify(admin));
export const removeAdmin = () => localStorage.removeItem("admin");

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
    refreshQueue.forEach((promise) => {
        if (error) promise.reject(error);
        else promise.resolve(token);
    });
    refreshQueue = [];
};

const safeJsonParse = async (response) => {
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch (err) {
        console.error("Invalid JSON response:", text);
        return { success: false, message: "Server returned invalid JSON", raw: text };
    }
};

export async function apiFetch(path, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    let response;
    try {
        response = await fetch(`${BASE_URL}${path}`, {
            ...options,
            headers,
            credentials: "include",
        });
    } catch (err) {
        console.error("Network error:", err);
        return { ok: false, status: 500, data: { message: "Network error. Server may be offline." } };
    }

    if (response.status === 401) {
        const cloned = response.clone();
        let errorData = {};
        try {
            errorData = await cloned.json();
        } catch {
            errorData = {};
        }

        if (errorData.code === "TOKEN_EXPIRED") {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshQueue.push({ resolve, reject });
                }).then(async (newToken) => {
                    headers.Authorization = `Bearer ${newToken}`;
                    return fetch(`${BASE_URL}${path}`, { ...options, headers, credentials: "include" });
                });
            }

            isRefreshing = true;
            try {
                const refreshResponse = await fetch(`${BASE_URL}/auth/refresh-token`, {
                    method: "POST",
                    credentials: "include",
                });
                const refreshData = await safeJsonParse(refreshResponse);
                if (!refreshResponse.ok) throw new Error(refreshData.message || "Refresh token failed");

                setToken(refreshData.token);
                processQueue(null, refreshData.token);
                headers.Authorization = `Bearer ${refreshData.token}`;
                return fetch(`${BASE_URL}${path}`, { ...options, headers, credentials: "include" });
            } catch (err) {
                console.error("Refresh token error:", err);
                processQueue(err);
                removeToken();
                removeAdmin();
                window.location.href = "/login";
                throw err;
            } finally {
                isRefreshing = false;
            }
        }
    }
    return response;
}

export const authApi = {
    login: async (email, password) => {
        const response = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        const data = await safeJsonParse(response);
        return { ok: response.ok, status: response.status, data };
    },

    verifyEmailCode: async (preAuthToken, code) => {
        if (!preAuthToken) return { ok: false, data: { message: "Session expired. Please login again." } };
        const response = await apiFetch("/auth/verify-email", {
            method: "POST",
            body: JSON.stringify({ preAuthToken, code }),
        });
        const data = await safeJsonParse(response);
        return { ok: response.ok, status: response.status, data };
    },

    resendVerificationCode: async (preAuthToken) => {
        if (!preAuthToken) return { ok: false, data: { message: "Session expired. Please login again." } };
        const response = await apiFetch("/auth/resend-code", {
            method: "POST",
            body: JSON.stringify({ preAuthToken }),
        });
        const data = await safeJsonParse(response);
        return { ok: response.ok, status: response.status, data };
    },

    refreshToken: async () => {
        const response = await apiFetch("/auth/refresh-token", { method: "POST" });
        const data = await safeJsonParse(response);
        return { ok: response.ok, status: response.status, data };
    },

    logout: async () => {
        const response = await apiFetch("/auth/logout", { method: "POST" });
        removeToken();
        removeAdmin();
        const data = await safeJsonParse(response);
        return { ok: response.ok, status: response.status, data };
    },

    getProfile: async () => {
        const response = await apiFetch("/auth/profile");
        const data = await safeJsonParse(response);
        return { ok: response.ok, status: response.status, data };
    },

    changePassword: async (currentPassword, newPassword) => {
        const response = await apiFetch("/auth/change-password", {
            method: "PUT",
            body: JSON.stringify({ currentPassword, newPassword }),
        });
        const data = await safeJsonParse(response);
        return { ok: response.ok, status: response.status, data };
    },
};

export const adminApi = {
    getPayments: async (page = 1) => {
        const response = await apiFetch(`/admin/payments?page=${page}`);
        const data = await safeJsonParse(response);
        return { ok: response.ok, status: response.status, data };
    },
};