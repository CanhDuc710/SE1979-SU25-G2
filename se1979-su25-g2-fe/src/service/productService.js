import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

export const getNewArrivals = async () => {
    const response = await axios.get(`${API_BASE_URL}/products/new-arrivals`);
    return response.data;
};
export const getSuggestedProducts = async () => {
    const response = await axios.get(`${API_BASE_URL}/products/suggestions`);
    return response.data;
};
export const fetchProductsPaged = async (page = 0, size = 8, filters = {}) => {
    const params = new URLSearchParams({
        page,
        size,
        ...filters
    });

    const response = await axios.get(`${API_BASE_URL}/products/dto?${params.toString()}`);
    console.log("🚀 Calling API:", response); // ✅ LOG NÀY BẮT BUỘC PHẢI CÓ

    return response.data;
};

export const fetchAllProductsPaged = async (page = 0, size = 5) => {
    const response = await axios.get(`${API_BASE_URL}/products?page=${page}&size=${size}`);
    console.log("🚀 Calling ALL products API:", response); // ✅ Debug log
    return response.data;
};

export const getProductDetail = async (productId) => {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
    return response.data;
};

export const deleteProductById = async (productId) => {
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        throw new Error("Delete failed");
    }
};




