import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Helper to create headers with authorization token
const createAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = { "Content-Type": "application/json" };
    if (token) {
        headers["Authorization"] = token;
    }
    return headers;
};

// Helper for multipart form data headers
const createMultipartAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = { "Content-Type": "multipart/form-data" };
    if (token) {
        headers["Authorization"] = token;
    }
    return headers;
};

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
    console.log("🚀 Calling API:", response);
    return response.data;
};

export const fetchAllProductsPaged = async (page = 0, size = 5) => {
    const response = await axios.get(`${API_BASE_URL}/products?page=${page}&size=${size}`, {
        headers: createAuthHeaders()
    });
    console.log("🚀 Calling ALL products API:", response);
    return response.data;
};

export const getProductDetail = async (productId) => {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
    return response.data;
};

export const fetchAllBrands = async () => {
    const response = await axios.get(`${API_BASE_URL}/products/brands`);
    return response.data;
};

export const fetchAllMaterials = async () => {
    const response = await axios.get(`${API_BASE_URL}/products/materials`);
    return response.data;
};

export const getProductById = async (productId) => {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`, {
        headers: createAuthHeaders()
    });
    return response.data;
};

export const deleteProductById = async (productId) => {
    const response = await axios.delete(`${API_BASE_URL}/admin/products/${productId}`, {
        headers: createAuthHeaders()
    });
    return response.data;
};

export const getCategories = async () => {
    const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: createAuthHeaders()
    });
    return response.data;
};

// Admin product management functions
export const createProduct = async (productData) => {
    const response = await axios.post(`${API_BASE_URL}/admin/products`, productData, {
        headers: createAuthHeaders()
    });
    return response.data;
};

export const createProductWithImages = async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/admin/products/with-images`, formData, {
        headers: createMultipartAuthHeaders()
    });
    return response.data;
};

export const updateProduct = async (productId, productData) => {
    const response = await axios.put(`${API_BASE_URL}/products/${productId}`, productData, {
        headers: createAuthHeaders()
    });
    return response.data;
};

export const updateProductWithImages = async (productId, formData) => {
    const response = await axios.put(`${API_BASE_URL}/admin/products/${productId}/with-images`, formData, {
        headers: createMultipartAuthHeaders()
    });
    return response.data;
};

export const createVariant = async (productId, variantData) => {
    const response = await axios.post(`${API_BASE_URL}/admin/products/${productId}/variants`, variantData, {
        headers: createAuthHeaders()
    });
    return response.data;
};

export const updateVariant = async (productId, variantId, variantData) => {
    const response = await axios.put(`${API_BASE_URL}/admin/products/${productId}/variants/${variantId}`, variantData, {
        headers: createAuthHeaders()
    });
    return response.data;
};

export const deleteVariant = async (productId, variantId) => {
    const response = await axios.delete(`${API_BASE_URL}/admin/products/${productId}/variants/${variantId}`, {
        headers: createAuthHeaders()
    });
    return response.data;
};
