import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

export const getStoreInformation = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/admin/setting/storeInformation`);
        return res.data;
    } catch (error) {
        console.error('Error fetching store information:', error);
        throw error;
    }
};

export const updateStoreInformation = async (storeData) => {
    try {
        const res = await axios.put(`${API_BASE_URL}/admin/setting/storeInformation`, storeData);
        return res.data; // Trả về kết quả (JSON object) sau khi cập nhật
    } catch (error) {
        console.error('Error updating store information:', error);
        throw error.response ? error.response.data : error.message;
    }
};

export const uploadStoreLogo = async (formData) => {
    try {
        const res = await axios.put(`${API_BASE_URL}/admin/setting/storeInformation/upload-logo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error uploading logo:', error);
        throw error.response ? error.response.data : error.message;
    }
};