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

export const getAllCategories = async ({ page = 0, size = 10, keyword = "" }) => {
    const params = new URLSearchParams({ page, size, keyword });
    const res = await axios.get(`${API_BASE_URL}/admin/setting/categories?${params.toString()}`,
        { headers: createAuthHeaders() });
    return res.data;
};

export const createCategory = async (data) => {
    const res = await axios.post(`${API_BASE_URL}/admin/setting/categories`, data, {
        headers: createAuthHeaders()
    });
    return res.data;
};

export const updateCategory = async (id, data) => {
    const res = await axios.put(`${API_BASE_URL}/admin/setting/categories/${id}`, data, {
        headers: createAuthHeaders()
    });
    return res.data;
};

export const deleteCategory = async (id) => {
    const res = await axios.delete(`${API_BASE_URL}/admin/setting/categories/${id}`,
        { headers: createAuthHeaders() });
    return res.data;
};

export const getActiveBanners = async () => {
    const res = await axios.get(`${API_BASE_URL}/admin/setting/banners`, {
        headers: createAuthHeaders()
    });
    return res.data;
};

export const uploadBanner = async (formData) => {
    const res = await axios.post(`${API_BASE_URL}/admin/setting/banners`, formData, {
        headers: { ...createAuthHeaders(), 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

export const deleteBanner = async (id) => {
    const res = await axios.delete(`${API_BASE_URL}/admin/setting/banners/${id}`,
        { headers: createAuthHeaders() });
    return res.data;
};

export const getBannerConfig = async () => {
    const res = await axios.get(`${API_BASE_URL}/admin/setting/banner-config`, {
        headers: createAuthHeaders()
    });
    return res.data;
};

export const updateBannerConfig = async (config) => {
    const res = await axios.post(`${API_BASE_URL}/admin/setting/banner-config`, config, {
        headers: createAuthHeaders()
    });
    return res.data;
};
