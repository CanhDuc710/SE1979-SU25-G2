import React, { useState, useEffect } from "react";
import { fetchProfile, updateProfile } from "../../service/profileService";
import { accountSchema } from "../../validation/editInfor";

export default function UserProfile() {
    const [formData, setFormData] = useState({
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

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "";

            return date.toISOString().split('T')[0];
        } catch (e) {
            console.error("Error parsing date:", e);
            return "";
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const dto = await fetchProfile();
                setFormData({
                    lastName: dto.lastName || "",
                    firstName: dto.firstName || "",
                    email: dto.email || "",
                    phoneNumber: dto.phoneNumber || "",
                    sex: dto.sex || "Male",
                    dob: formatDateForInput(dto.dob),
                });
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined })); // Clear error for the field being changed
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setError(null);

        try {
            const profileSchema = accountSchema.pick([
                "firstName",
                "lastName",
                "email",
                "phoneNumber",
                "sex",
                "dob",
            ]);
            await profileSchema.validate(formData, { abortEarly: false });
            setErrors({});
        } catch (validationError) {
            const validationErrors = {};
            validationError.inner.forEach(err => {
                if (err.path) validationErrors[err.path] = err.message;
            });
            setErrors(validationErrors);
            setSaving(false);
            return;
        }

        try {
            const updated = await updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                sex: formData.sex,
                dob: formData.dob,
            });

            setFormData({
                lastName: updated.lastName || "",
                firstName: updated.firstName || "",
                email: updated.email || "",
                phoneNumber: updated.phoneNumber || "",
                sex: updated.sex || "Male",
                dob: formatDateForInput(updated.dob),
            });
            alert("Cập nhật thành công!");
        } catch (e) {
            console.error("Lỗi khi cập nhật hồ sơ:", e);
            if (e.response?.data && typeof e.response.data === 'object') {
                setErrors(e.response.data);
                setError("Có lỗi xảy ra khi cập nhật. Vui lòng kiểm tra lại thông tin.");
            } else {
                setError("Cập nhật thất bại! Vui lòng thử lại.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Đang tải thông tin...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-200 to-yellow-100 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-2xl font-medium text-gray-700 text-center">
                        Xin chào, {formData.firstName}
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {error && (
                    <div className="text-red-600 bg-red-100 p-3 rounded">{error}</div>
                )}

                {/* Profile Form */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Họ
                            </label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={e =>
                                    handleInputChange("lastName", e.target.value)
                                }
                                className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên
                            </label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={e =>
                                    handleInputChange("firstName", e.target.value)
                                }
                                className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => handleInputChange("email", e.target.value)}
                                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={e =>
                                    handleInputChange("phoneNumber", e.target.value)
                                }
                                className={`w-full px-3 py-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giới tính
                            </label>
                            <select
                                value={formData.sex}
                                onChange={e => handleInputChange("sex", e.target.value)}
                                className={`w-full px-3 py-2 border ${errors.sex ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                                <option value="Other">Khác</option>
                            </select>
                            {errors.sex && <p className="text-red-500 text-xs mt-1">{errors.sex}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày sinh
                            </label>
                            <input
                                type="date"
                                value={formData.dob}
                                onChange={e => handleInputChange("dob", e.target.value)}
                                className={`w-full px-3 py-2 border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
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