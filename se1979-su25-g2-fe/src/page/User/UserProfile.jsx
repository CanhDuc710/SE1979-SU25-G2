"use client";

import { useState, useEffect } from "react";
import { fetchProfile, updateProfile } from "../../service/profileService";
import { User } from "lucide-react";

export default function UserProfile({ userId }) {
    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        email: "",
        phoneNumber: "",
        sex: "Male",
        dob: "1990-01-01",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // load profile khi component mount
        (async () => {
            try {
                const dto = await fetchProfile(userId);
                setFormData({
                    lastName: dto.lastName,
                    firstName: dto.firstName,
                    email: dto.email,
                    phoneNumber: dto.phoneNumber,
                    sex: dto.sex,
                    dob: dto.dob.split("T")[0], // nếu backend trả ISO datetime
                });
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setError(null);
        try {
            const updated = await updateProfile(userId, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                sex: formData.sex,
                dob: formData.dob,
            });
            // bạn có thể cập nhật lại state nếu backend chỉnh sửa thêm
            setFormData({
                lastName: updated.lastName,
                firstName: updated.firstName,
                email: updated.email,
                phoneNumber: updated.phoneNumber,
                sex: updated.sex,
                dob: updated.dob.split("T")[0] || updated.dob,
            });
            alert("Cập nhật thành công!");
        } catch (e) {
            setError(e.message);
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
                        {/* Họ */}
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Tên */}
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => handleInputChange("email", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Số điện thoại */}
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Giới tính */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giới tính
                            </label>
                            <select
                                value={formData.sex}
                                onChange={e => handleInputChange("sex", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                                <option value="Other">Khác</option>
                            </select>
                        </div>

                        {/* Ngày sinh */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày sinh
                            </label>
                            <input
                                type="date"
                                value={formData.dob}
                                onChange={e => handleInputChange("dob", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Save Button */}
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
