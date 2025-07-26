import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile, updateProfile } from "../../service/profileService";
import AddressManagement from "../../components/AddressManagement";
import OrderHistory from "../../components/OrderHistory";
import { profileSchema } from "../../validation/profileSchema";

const updateProfileSchema = profileSchema.omit(["username", "password", "role"]);

export default function UserProfile() {
    const navigate = useNavigate();
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
    const [activeTab, setActiveTab] = useState("profile");
    const [userId, setUserId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState({});

    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
            const payloadBase64 = token.split(".")[1];
            const payload = JSON.parse(atob(payloadBase64));
            // Assuming the user ID is stored in 'id' or 'sub' in the JWT payload
            return payload.id || payload.sub;
        } catch (e) {
            console.error("Error parsing JWT token:", e);
            return null;
        }
    };

    const checkAuthentication = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.log("No token found, redirecting to login");
            navigate("/login", { replace: true });
            return false;
        }

        try {
            const payloadBase64 = token.split(".")[1];
            const payload = JSON.parse(atob(payloadBase64));
            const currentTime = Date.now() / 1000;

            if (payload.exp && payload.exp < currentTime) {
                console.log("Token expired, redirecting to login");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login", { replace: true });
                return false;
            }

            return true;
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login", { replace: true });
            return false;
        }
    };

    const formatDateForInput = (value) => {
        if (!value) return "";
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return value;
        }
        const parts = value.split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            const formattedMonth = month.padStart(2, '0');
            const formattedDay = day.padStart(2, '0');
            return `${year}-${formattedMonth}-${formattedDay}`;
        }
        try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split("T")[0];
            }
        } catch (e) {
            console.error("Failed to parse date for input:", value, e);
        }
        return "";
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
        const isAuth = checkAuthentication();
        if (!isAuth) return;

        setIsAuthenticated(true);

        const userIdFromToken = getUserIdFromToken();
        setUserId(userIdFromToken);

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
                    // Apply the new formatting function when setting the initial DOB
                    dob: formatDateForInput(dto.dob),
                });
                console.log("DOB from server (raw):", dto.dob);
                console.log("DOB formatted for input:", formatDateForInput(dto.dob));

            } catch (e) {
                console.error("Error fetching profile:", e);
                setError("Không thể lấy thông tin hồ sơ.");
                if (String(e?.message || "").includes("401") || String(e?.message || "").includes("unauthorized")) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login", { replace: true });
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [navigate]);

    // Corrected handleChange signature to accept name and value directly
    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined })); // Clear error for the changed field
        setError(null); // Clear general error message
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setError(null);
        setErrors({}); // Clear previous validation errors

        try {
            // Validate using Yup schema
            await updateProfileSchema.validate(formData, { abortEarly: false });

            // The dob in formData should already be in 'yyyy-MM-dd' due to input type="date"
            const updated = await updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                sex: formData.sex,
                dob: formData.dob,
            });

            // Update form data with potentially new values from the backend response
            setFormData({
                ...formData,
                lastName: updated.lastName || "",
                firstName: updated.firstName || "",
                email: updated.email || "",
                phoneNumber: updated.phoneNumber || "",
                sex: normalizeSex(updated.sex),
                dob: formatDateForInput(updated.dob),
            });
            alert("Cập nhật thành công!");
        } catch (e) {
            if (e.name === "ValidationError") {
                const fieldErrors = {};
                e.inner.forEach((err) => {
                    if (!fieldErrors[err.path]) fieldErrors[err.path] = err.message;
                });
                setErrors(fieldErrors);
            } else {
                setError(e.message || "Cập nhật thất bại");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Đang tải thông tin...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-200 to-yellow-100 py-8 rounded-b-lg shadow-sm">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-semibold text-gray-800 text-center">
                        Xin chào, {formData.username}
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {error && (
                    <div className="text-red-700 bg-red-100 p-4 rounded-lg border border-red-200 shadow-sm">
                        {error}
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-lg">
                    <div className="border-b border-gray-200">
                        <nav className="flex flex-wrap justify-center sm:justify-start">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`flex-1 sm:flex-none px-6 py-3 text-base font-medium border-b-2 transition-colors duration-200 ease-in-out
                                    ${activeTab === "profile"
                                    ? "border-blue-600 text-blue-700 bg-blue-50"
                                    : "border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-300"
                                } rounded-tl-lg`}
                            >
                                Thông tin cá nhân
                            </button>
                            <button
                                onClick={() => setActiveTab("address")}
                                className={`flex-1 sm:flex-none px-6 py-3 text-base font-medium border-b-2 transition-colors duration-200 ease-in-out
                                    ${activeTab === "address"
                                    ? "border-blue-600 text-blue-700 bg-blue-50"
                                    : "border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-300"
                                }`}
                            >
                                Địa chỉ giao hàng
                            </button>
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`flex-1 sm:flex-none px-6 py-3 text-base font-medium border-b-2 transition-colors duration-200 ease-in-out
                                    ${activeTab === "orders"
                                    ? "border-blue-600 text-blue-700 bg-blue-50"
                                    : "border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-300"
                                } rounded-tr-lg`}
                            >
                                Lịch sử đơn hàng
                            </button>
                        </nav>
                    </div>

                    <div className="p-6 sm:p-8">
                        {activeTab === "profile" && (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Họ */}
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => handleChange("lastName", e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                        />
                                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                    </div>

                                    {/* Tên */}
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => handleChange("firstName", e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                        />
                                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>

                                    {/* Số điện thoại */}
                                    <div>
                                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={(e) => handleChange("phoneNumber", e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                        />
                                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                                    </div>

                                    {/* Giới tính */}
                                    <div>
                                        <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                                        <select
                                            id="sex"
                                            value={formData.sex}
                                            onChange={(e) => handleChange("sex", e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white transition-all duration-200"
                                        >
                                            <option value="">Chọn giới tính</option>
                                            <option value="Male">Nam</option>
                                            <option value="Female">Nữ</option>
                                            <option value="Other">Khác</option>
                                        </select>
                                        {errors.sex && <p className="text-red-500 text-sm mt-1">{errors.sex}</p>}
                                    </div>

                                    {/* Ngày sinh */}
                                    <div>
                                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                                        <input
                                            type="date"
                                            id="dob"
                                            value={formData.dob}
                                            onChange={(e) => handleChange("dob", e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                        />
                                        {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
                                    >
                                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "address" && <AddressManagement />}

                        {activeTab === "orders" && userId && <OrderHistory userId={userId} />}

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
