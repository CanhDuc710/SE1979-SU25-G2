import React, { useState, useEffect } from "react";
import { fetchProfile, updateProfile } from "../../service/profileService";
import { profileSchema } from "../../validation/profileSchema";

export default function UserProfile() {
    const [formData, setFormData] = useState({
        username: "",
        lastName: "",
        firstName: "",
        email: "",
        phoneNumber: "",
        sex: "",
        dob: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    const formatDateForInput = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        return isNaN(d) ? "" : d.toISOString().split("T")[0];
    };

    const normalizeSex = (raw) => {
        if (!raw) return "";
        const lower = raw.toLowerCase();
        if (lower === "male") return "Male";
        if (lower === "female") return "Female";
        if (lower === "other") return "Other";
        return "";
    };

    useEffect(() => {
        (async () => {
            try {
                const dto = await fetchProfile();
                setFormData({
                    username: dto.username || "",
                    lastName: dto.lastName || "",
                    firstName: dto.firstName || "",
                    email: dto.email || "",
                    phoneNumber: dto.phoneNumber || "",
                    sex: normalizeSex(dto.sex),
                    dob: formatDateForInput(dto.dob),
                });
            } catch (e) {
                console.error(e);
                setError("Không thể lấy thông tin hồ sơ.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        setError(null);
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setError(null);

        try {
            await profileSchema
                .pick(["firstName", "lastName", "email", "phoneNumber", "sex", "dob"])
                .validate(formData, { abortEarly: false });
            setErrors({});
        } catch (ve) {
            const fieldErrors = {};
            ve.inner.forEach((err) => {
                if (err.path) fieldErrors[err.path] = err.message;
            });
            setErrors(fieldErrors);
            setSaving(false);
            return;
        }

        try {
            const updated = await updateProfile(formData);
            setFormData({
                username: updated.username || "",
                lastName: updated.lastName || "",
                firstName: updated.firstName || "",
                email: updated.email || "",
                phoneNumber: updated.phoneNumber || "",
                sex: normalizeSex(updated.sex),
                dob: formatDateForInput(updated.dob),
            });
            alert("Cập nhật thành công!");
        } catch (e) {
            console.error("Lỗi khi cập nhật hồ sơ:", e);
            if (e.response?.data && typeof e.response.data === "object") {
                setErrors(e.response.data);
                setError("Vui lòng kiểm tra lại thông tin.");
            } else {
                setError("Cập nhật thất bại! Vui lòng thử lại.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-600">Đang tải...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-200 to-yellow-100 py-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl font-medium text-gray-700">
                        Xin chào, {formData.username}
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {error && (
                    <div className="text-red-600 bg-red-100 p-3 rounded">{error}</div>
                )}

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Họ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Họ
                            </label>
                            <input
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${
                                    errors.lastName ? "border-red-500" : "border-gray-300"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.lastName}
                                </p>
                            )}
                        </div>

                        {/* Tên */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên
                            </label>
                            <input
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${
                                    errors.firstName ? "border-red-500" : "border-gray-300"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.firstName}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${
                                    errors.email ? "border-red-500" : "border-gray-300"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại
                            </label>
                            <input
                                name="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${
                                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.phoneNumber}
                                </p>
                            )}
                        </div>

                        {/* Giới tính – sẽ tự động chọn đúng option */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giới tính
                            </label>
                            <select
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${
                                    errors.sex ? "border-red-500" : "border-gray-300"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option value="">-- Chọn --</option>
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                                <option value="Other">Khác</option>
                            </select>
                            {errors.sex && (
                                <p className="text-red-500 text-xs mt-1">{errors.sex}</p>
                            )}
                        </div>

                        {/* Ngày sinh */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày sinh
                            </label>
                            <input
                                name="dob"
                                type="date"
                                value={formData.dob}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${
                                    errors.dob ? "border-red-500" : "border-gray-300"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.dob && (
                                <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end mt-8">
                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-8 py-3 rounded-lg text-lg transition-colors"
                        >
                            {saving ? "Đang lưu..." : "Lưu"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
