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

export const getStoreInformation = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/admin/setting/storeInformation`, {
            headers: createAuthHeaders()
        });
        return res.data;
    } catch (error) {
        console.error('Error fetching store information:', error);
        throw error;
    }
};

export const updateStoreInformation = async (storeData) => {
    try {
        const res = await axios.put(`${API_BASE_URL}/admin/setting/storeInformation`, storeData, {
            headers: createAuthHeaders()
        });
        return res.data; // Trả về kết quả (JSON object) sau khi cập nhật
    } catch (error) {
        console.error('Error updating store information:', error);
        throw error.response ? error.response.data : error.message;
    }
};

export const uploadStoreLogo = async (formData) => {
    try {
        const res = await axios.put(`${API_BASE_URL}/admin/setting/storeInformation/upload-logo`, formData, {
            headers: { ...createAuthHeaders(), 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    } catch (error) {
        console.error('Error uploading logo:', error);
        throw error.response ? error.response.data : error.message;
    }
};