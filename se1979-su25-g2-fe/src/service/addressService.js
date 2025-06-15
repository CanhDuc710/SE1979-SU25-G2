import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

export const getProvinces = async () => {
    const res = await axios.get(`${API_BASE_URL}/provinces`);
    return res.data;
};

export const getDistricts = async (provinceId) => {
    const res = await axios.get(`${API_BASE_URL}/districts/by-province/${provinceId}`);
    return res.data;
};

export const getWards = async (districtId) => {
    const res = await axios.get(`${API_BASE_URL}/wards/by-district/${districtId}`);
    return res.data;
};