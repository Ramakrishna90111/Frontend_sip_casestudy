export const API_BASE_URL = "http://localhost:3000/api";

export function getToken() {
    if (typeof document == "undefined") {
        return "";
    }
    const tokenCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : "";
}

export function getCookie(name) {
    if (typeof document == "undefined") {
        return "";
    }
    const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : "";
}

export async function apiRequest(path, options = {}) {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.error || data?.message || data || "Request failed");
    }
    return data;
}
