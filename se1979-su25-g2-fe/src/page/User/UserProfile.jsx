"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile, updateProfile } from "../../service/profileService";
import AddressManagement from "../../components/AddressManagement";
import OrderHistory from "../../components/OrderHistory";

export default function UserProfile() {
    const navigate = useNavigate();
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
    const [activeTab, setActiveTab] = useState("profile");
    const [userId, setUserId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Helper function to get user ID from token
    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const payloadBase64 = token.split('.')[1];
            const payload = JSON.parse(atob(payloadBase64));
            return payload.id || payload.sub;
        } catch (e) {
            console.error("Error parsing JWT token:", e);
            return null;
        }
    };

    // Check authentication function
    const checkAuthentication = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.log("No token found, redirecting to homepage");
            navigate('/login', { replace: true });
            return false;
        }

        try {
            const payloadBase64 = token.split('.')[1];
            const payload = JSON.parse(atob(payloadBase64));
            const currentTime = Date.now() / 1000;

            if (payload.exp && payload.exp < currentTime) {
                console.log("Token expired, redirecting to homepage");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/', { replace: true });
                return false;
            }

            return true;
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/', { replace: true });
            return false;
        }
    };

    // Helper function to properly format date for input type="date"
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
        // Check authentication first
        const isAuth = checkAuthentication();
        if (!isAuth) {
            return; // Component will be unmounted due to navigation
        }

        setIsAuthenticated(true);

        // Get user ID from token
        const userIdFromToken = getUserIdFromToken();
        setUserId(userIdFromToken);

        // load profile when component mounts
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
                // If profile fetch fails due to auth issues, redirect
                if (e.message.includes('401') || e.message.includes('unauthorized')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/', { replace: true });
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [navigate]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setError(null);
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

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="border-b border-gray-200">
                        <nav className="flex">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                                    activeTab === "profile"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                Thông tin cá nhân
                            </button>
                            <button
                                onClick={() => setActiveTab("address")}
                                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                                    activeTab === "address"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                Địa chỉ giao hàng
                            </button>
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                                    activeTab === "orders"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                Lịch sử đơn hàng
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === "profile" && (
                            <div>
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

                                {/* Nút lưu */}
                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "address" && (
                            <AddressManagement />
                        )}

                        {activeTab === "orders" && userId && (
                            <OrderHistory userId={userId} />
                        )}

                        {activeTab === "orders" && !userId && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-2">Không thể tải lịch sử đơn hàng</div>
                                <p className="text-gray-500">Vui lòng đăng nhập lại để xem lịch sử đơn hàng</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}