import axios from 'axios';

import { API_BASE_URL } from "../utils/constants";

// Helper to create headers with authorization token
const createAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = { "Content-Type": "application/json" };

    if (token) {
        headers["Authorization"] = token; // Token already includes "Bearer " prefix
    }

    return headers;
};

export function sendOtp(email) {
    return axios.post(
        `${ API_BASE_URL }/auth/forgot-password`,
        { email },
        { headers: createAuthHeaders() }
    );
}

export function resetPasswordWithOtp(email, otp, newPassword) {
    return axios.post(
        `${ API_BASE_URL }/auth/reset-password`,
        { email, otp, newPassword },
        { headers: createAuthHeaders() }
    );
}

export function changePassword(currentPassword, newPassword) {
    return axios.post(
        `${ API_BASE_URL }/auth/change-password`,
        { currentPassword, newPassword },
        { headers: createAuthHeaders() }
    );
}
