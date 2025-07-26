import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

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
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        return payload.id || payload.sub;
    } catch (e) {
        console.error("Error parsing JWT token:", e);
        return null;
    }
};

export const getProvinces = async () => {
    const res = await axios.get(`${API_BASE_URL}/provinces`);
    return res.data;
};

export const getDistricts = async (provinceId) => {
    const res = await axios.get(`${API_BASE_URL}/districts/by-province/${provinceId}`);
    return res.data;
};

export const getWards = async (districtId) => {
    const res = await axios.get(`${API_BASE_URL}/wards/by-district/${districtId}`);
    return res.data;
};

// User Address Management Functions
export const getUserAddresses = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
        throw new Error("No authenticated user found");
    }

    const res = await fetch(`${API_BASE_URL}/user-addresses/user/${userId}`, {
        headers: createAuthHeaders()
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to get addresses: ${err}`);
    }

    return res.json();
};

export const createUserAddress = async (addressData) => {
    const userId = getUserIdFromToken();
    if (!userId) {
        throw new Error("No authenticated user found");
    }

    const res = await fetch(`${API_BASE_URL}/user-addresses/user/${userId}`, {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify(addressData),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to create address: ${err}`);
    }

    return res.json();
};

export const updateUserAddress = async (addressId, addressData) => {
    const userId = getUserIdFromToken();
    if (!userId) {
        throw new Error("No authenticated user found");
    }

    const res = await fetch(`${API_BASE_URL}/user-addresses/user/${userId}/${addressId}`, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify(addressData),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to update address: ${err}`);
    }

    return res.json();
};

export const deleteUserAddress = async (addressId) => {
    const userId = getUserIdFromToken();
    if (!userId) {
        throw new Error("No authenticated user found");
    }

    const res = await fetch(`${API_BASE_URL}/user-addresses/user/${userId}/${addressId}`, {
        method: "DELETE",
        headers: createAuthHeaders(),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to delete address: ${err}`);
    }
};

export const setDefaultAddress = async (addressId) => {
    const userId = getUserIdFromToken();
    if (!userId) {
        throw new Error("No authenticated user found");
    }

    const res = await fetch(`${API_BASE_URL}/user-addresses/user/${userId}/${addressId}/default`, {
        method: "PUT",
        headers: createAuthHeaders(),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to set default address: ${err}`);
    }
};

export const getDefaultAddress = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
        return null;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/user-addresses/user/${userId}/default`, {
            headers: createAuthHeaders()
        });

        if (res.status === 204) {
            return null; // No default address
        }

        if (!res.ok) {
            throw new Error(`Failed to get default address`);
        }

        return res.json();
    } catch (error) {
        console.error("Error getting default address:", error);
        return null;
    }
};
