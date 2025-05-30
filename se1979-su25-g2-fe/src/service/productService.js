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
export const getProductDetail = async (productId) => {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
    return response.data;
};



