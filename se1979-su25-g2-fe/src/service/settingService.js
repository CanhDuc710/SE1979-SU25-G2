import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

export const getAllCategories = async ({ page = 0, size = 10, keyword = "" }) => {
    const params = new URLSearchParams({ page, size, keyword });
    const res = await axios.get(`${API_BASE_URL}/admin/setting/categories?${params.toString()}`);
    return res.data;
};

export const createCategory = async (data) => {
    const res = await axios.post(`${API_BASE_URL}/admin/setting/categories`, data);
    return res.data;
};

export const updateCategory = async (id, data) => {
    const res = await axios.put(`${API_BASE_URL}/admin/setting/categories/${id}`, data);
    return res.data;
};

export const deleteCategory = async (id) => {
    const res = await axios.delete(`${API_BASE_URL}/admin/setting/categories/${id}`);
    return res.data;
};
