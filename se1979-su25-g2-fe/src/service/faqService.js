import axios from 'axios';
console.log("🔧 API_BASE_URL = ", API_BASE_URL);
import { API_BASE_URL } from '../utils/constants';

// Lấy tất cả FAQs
export const fetchAllFaqs = async () => {
    const response = await axios.get(`${API_BASE_URL}/faqs`);
    console.log("🚀 Calling FAQ API:", response); // Debug log
    return response.data;
};

// Lấy chi tiết 1 FAQ theo id
export const fetchFaqById = async (faqId) => {
    const response = await axios.get(`${API_BASE_URL}/faqs/${faqId}`);
    return response.data;
};

// Tạo mới 1 FAQ
export const createFaq = async (faq) => {
    const response = await axios.post(`${API_BASE_URL}/faqs`, faq);
    return response.data;
};

// Xóa 1 FAQ
export const deleteFaq = async (faqId) => {
    const response = await axios.delete(`${API_BASE_URL}/faqs/${faqId}`);
    return response.data;
};