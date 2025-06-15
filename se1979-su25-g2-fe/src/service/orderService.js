import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

export const createOrder = async (orderData) => {
    const res = await axios.post(`${API_BASE_URL}/orders`, orderData);
    return res.data;
};