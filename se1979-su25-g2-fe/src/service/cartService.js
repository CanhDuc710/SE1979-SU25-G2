import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const getSessionId = () => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
};
export { getSessionId };
export const getCart = async () => {
    const sessionId = getSessionId();
    const res = await axios.get(`${API_BASE_URL}/cart`, {
        params: { sessionId }
    });
    return res.data;
};

export const addToCart = async (variantId, quantity = 1) => {
    const sessionId = getSessionId();
    const res = await axios.post(
        `${API_BASE_URL}/cart/add`,
        { variantId, quantity },
        { params: { sessionId } }
    );
    return res.data;
};

export const updateCartItem = async (variantId, quantity) => {
    const sessionId = getSessionId();
    const res = await axios.put(
        `${API_BASE_URL}/cart/update`,
        { variantId, quantity },
        { params: { sessionId } }
    );
    return res.data;
};

export const removeFromCart = async (variantId) => {
    const sessionId = getSessionId();
    const res = await axios.delete(`${API_BASE_URL}/cart/remove/${variantId}`, {
        params: { sessionId }
    });
    return res.data;
};

export const clearCart = async () => {
    const sessionId = getSessionId();
    await axios.delete(`${API_BASE_URL}/cart/clear`, {
        params: { sessionId }
    });
};
