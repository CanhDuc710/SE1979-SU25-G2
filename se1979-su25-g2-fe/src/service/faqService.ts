import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

export const getAllFaqs = async () => {
    const res = await axios.get(`${API_BASE_URL}/faqs`);
    return res.data;
};

export const createFaq = async (faq) => {
    const res = await axios.post(`${API_BASE_URL}/faqs`, faq);
    return res.data;
};

export const deleteFaq = async (id) => {
    await axios.delete(`${API_BASE_URL}/faqs/${id}`);
};