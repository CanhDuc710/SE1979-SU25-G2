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

export const createOrder = async (orderData) => {
    const res = await axios.post(`${API_BASE_URL}/orders`, orderData);
    return res.data;
};

export const createVNPayPayment = async (orderData) => {
    const res = await axios.post(`${API_BASE_URL}/orders/vnpay`, orderData);
    return res.data;
};

export const checkVNPayReturn = async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const res = await axios.get(`${API_BASE_URL}/orders/vnpay-return?${queryString}`);
    return res.data;
};

// User order history functions
export const getUserOrderHistory = async (userId, { page = 0, size = 10, keyword } = {}) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    if (keyword && keyword.trim()) {
        params.append('keyword', keyword.trim());
    }

    const res = await axios.get(`${API_BASE_URL}/orders/user/${userId}?${params}`, {
        headers: createAuthHeaders()
    });
    return res.data;
};

export const getUserOrderDetail = async (userId, orderId) => {
    const res = await axios.get(`${API_BASE_URL}/orders/user/${userId}/order/${orderId}`, {
        headers: createAuthHeaders()
    });
    return res.data;
};

export const cancelUserOrder = async (userId, orderId) => {
    const res = await axios.put(`${API_BASE_URL}/orders/user/${userId}/order/${orderId}/cancel`, {}, {
        headers: createAuthHeaders()
    });
    return res.data;
};

export const getAllOrders = async ({
    page = 0,
    size = 8,
    status,
    searchTerm,
    searchBy,
    sortBy = 'orderDate',
    direction = 'desc'
} = {}) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('sortBy', sortBy);
    params.append('direction', direction);

    if (status && status !== "all") {
        params.append('status', status);
    }

    if (searchTerm && searchTerm.trim()) {
        params.append('searchTerm', searchTerm.trim());
        params.append('searchBy', searchBy || "all");
    }

    const response = await axios.get(`${API_BASE_URL}/admin/orders/search?${params.toString()}`,
        { headers: createAuthHeaders() });
    return response.data;
};

export const getOrderById = async (orderId) => {
    const res = await axios.get(`${API_BASE_URL}/admin/orders/${orderId}`,
        { headers: createAuthHeaders() });
    return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const res = await axios.put(`${API_BASE_URL}/admin/orders/${orderId}/status`, status, {
        headers: { ...createAuthHeaders(), 'Content-Type': 'text/plain' }
    });
    return res.data;
};

export const deleteOrder = async (orderId) => {
    await axios.delete(`${API_BASE_URL}/admin/orders/${orderId}`,
        { headers: createAuthHeaders() });
};
