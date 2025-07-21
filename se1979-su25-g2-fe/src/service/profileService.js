// profileService.js
const API_BASE = "/api/profile";

// Helper to create headers with authorization token
const createAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = { "Content-Type": "application/json" };

    if (token) {
        headers["Authorization"] = token;
    }

    return headers;
};

// Extract user ID from JWT token
const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        // JWT tokens are in format: header.payload.signature
        const payloadBase64 = token.split('.')[1];
        // Decode the base64 payload
        const payload = JSON.parse(atob(payloadBase64));
        // Return the user ID (assuming it's in the 'id' or 'sub' field)
        return payload.id || payload.sub;
    } catch (e) {
        console.error("Error parsing JWT token:", e);
        return null;
    }
};

export async function fetchProfile() {
    const userId = getUserIdFromToken();
    if (!userId) {
        throw new Error("No authenticated user found");
    }

    const res = await fetch(`${API_BASE}/${userId}`, {
        headers: createAuthHeaders()
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Fetch profile failed: ${err}`);
    }
    return res.json();
}

export async function updateProfile(data) {
    const userId = getUserIdFromToken();
    if (!userId) {
        throw new Error("No authenticated user found");
    }

    const res = await fetch(`${API_BASE}/${userId}`, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Update profile failed: ${err}`);
    }
    return res.json();
}