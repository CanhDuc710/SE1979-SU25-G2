import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

export const fetchNotifications = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/notifications/${userId}`);
    return response.data;
};