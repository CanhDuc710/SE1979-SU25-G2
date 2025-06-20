import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

export const getAccounts = async ({ page = 0, size = 10, keyword = "", status = "", role = "" }) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", size);
    if (keyword) params.append("keyword", keyword);
    if (status) params.append("status", status);
    if (role) params.append("role", role);

    const response = await axios.get(`${API_BASE_URL}/admin/accounts?${params.toString()}`);
    return response.data;
};

export const banAccount = async (id) => {
    const response = await axios.put(`${API_BASE_URL}/admin/accounts/ban/${id}`);
    return response.data;
};

export const unbanAccount = async (id) => {
    const response = await axios.put(`${API_BASE_URL}/admin/accounts/unban/${id}`);
    return response.data;
};

export const getAccountDetail = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/admin/accounts/getDetail/${id}`);
    return response.data;
};
