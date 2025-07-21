import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

export const createOrder = async (orderData) => {
    const res = await axios.post(`${API_BASE_URL}/orders`, orderData);
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

    const response = await axios.get(`${API_BASE_URL}/admin/orders/search?${params.toString()}`);
    return response.data;
};

export const getOrderById = async (orderId) => {
    const res = await axios.get(`${API_BASE_URL}/admin/orders/${orderId}`);
    return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const res = await axios.put(`${API_BASE_URL}/admin/orders/${orderId}/status`, status, {
        headers: { 'Content-Type': 'text/plain' }
    });
    return res.data;
};

export const deleteOrder = async (orderId) => {
    await axios.delete(`${API_BASE_URL}/admin/orders/${orderId}`);
};