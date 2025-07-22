import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

// Helper function to get token and create headers
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: token
    };
};

// Helper to create headers with authorization token
const createAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = { "Content-Type": "application/json" };
    if (token) {
        headers["Authorization"] = token;
    }
    return headers;
};

export const getAccounts = async ({ page = 0, size = 10, keyword = "", status = "", role = "" }) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", size);
    if (keyword) params.append("keyword", keyword);
    if (status) params.append("status", status);
    if (role) params.append("role", role);

    const response = await axios.get(`${API_BASE_URL}/admin/accounts?${params.toString()}`, {
        headers: createAuthHeaders()
    });
    return response.data;
};

export const banAccount = async (id) => {
    const response = await axios.put(`${API_BASE_URL}/admin/accounts/ban/${id}`, {}, {
        headers: createAuthHeaders()
    });
    return response.data;
};

export const unbanAccount = async (id) => {
    const response = await axios.put(`${API_BASE_URL}/admin/accounts/unban/${id}`, {}, {
        headers: createAuthHeaders()
    });
    return response.data;
};

export const getAccountDetail = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/admin/accounts/getDetail/${id}`, {
        headers: createAuthHeaders()
    });
    return response.data;
};

export const createAccount = async (accountData) => {
    const response = await axios.post(`${API_BASE_URL}/admin/accounts/add`, accountData, {
        headers: createAuthHeaders()
    });
    return response.data;
};

export const getAccountById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/admin/accounts/edit/${id}`, {
        headers: createAuthHeaders()
    });
    return response.data;
};

export const updateAccount = async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/admin/accounts/edit/${id}`, data, {
        headers: createAuthHeaders()
    });
    return response.data;
};

export const getOrderHistory = async (userId, { page = 0, size = 10, keyword = "" } = {}) => {
    try {
        const { data } = await axios.get(
            `${API_BASE_URL}/admin/accounts/${userId}/orders`,
            {
                params: { page, size, keyword },
                headers: createAuthHeaders()
            }
        );
        return data;
    } catch (err) {
        console.error("Error fetching order history:", err);
        throw err;
    }
};