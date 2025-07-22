import axios from 'axios';

import { API_BASE_URL } from "../utils/constants";
export function sendOtp(email) {
    return axios.post(`${ API_BASE_URL }/auth/forgot-password`, { email });
}

export function resetPasswordWithOtp(email, otp, newPassword) {
    return axios.post(`${ API_BASE_URL }/auth/reset-password`, { email, otp, newPassword });
}

export function changePassword(currentPassword, newPassword, token) {
    return axios.post(
        `${ API_BASE_URL }/auth/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
