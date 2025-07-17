import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

export const createOrder = async (orderData) => {
    const res = await axios.post(`${API_BASE_URL}/orders`, orderData);
    return res.data;
};

// Admin Order Management APIs
export const getAllOrders = async (page = 0, size = 10, sort = "orderDate,desc") => {
    const res = await axios.get(`${API_BASE_URL}/admin/orders`, {
        params: { page, size, sort }
    });
    return res.data;
};

export const getOrderById = async (orderId) => {
    const res = await axios.get(`${API_BASE_URL}/admin/orders/${orderId}`);
    return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const res = await axios.put(`${API_BASE_URL}/admin/orders/${orderId}/status`, status, {
        headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
};

export const deleteOrder = async (orderId) => {
    await axios.delete(`${API_BASE_URL}/admin/orders/${orderId}`);
};