// src/service/discountService.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Gọi API lấy danh sách discount có phân trang, tìm kiếm, lọc, sắp xếp
export const fetchDiscounts = async ({
                                         page = 0,
                                         size = 10,
                                         code,
                                         minValue,
                                         maxValue,
                                         sortBy = 'discountId',
                                         direction = 'asc',
                                     } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", size);
    if (code) params.append("code", code);
    if (minValue !== undefined && minValue !== "") params.append("minValue", minValue);
    if (maxValue !== undefined && maxValue !== "") params.append("maxValue", maxValue);
    if (sortBy) params.append("sortBy", sortBy);
    if (direction) params.append("direction", direction);

    const response = await axios.get(`${API_BASE_URL}/discounts/search?${params.toString()}`);
    return response.data;
};


// Tạo mới discount
export const createDiscount = async (data) => {
    const response = await axios.post(`${API_BASE_URL}/discounts`, data);
    return response.data;
};

// Cập nhật discount theo ID
export const updateDiscount = async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/discounts/${id}`, data);
    return response.data;
};

// Xóa discount theo ID
export const deleteDiscount = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/discounts/${id}`);
    return response;
};

// Lấy discount theo code (nếu cần tìm riêng)
export const getDiscountByCode = async (code) => {
    const response = await axios.get(`${API_BASE_URL}/discounts/code/${code}`);
    return response.data;
};
