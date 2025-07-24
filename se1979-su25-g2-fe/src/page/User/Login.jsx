import { useState, useEffect } from "react";
import axios from "axios";
import * as storeService from "../../service/storeService.js";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Store settings state
    const [storeData, setStoreData] = useState({
        storeName: "",
        email: "",
        fanpage: "",
        phone: "",
        address: "",
        description: "",
        logo: "",
    });

    // Fetch store settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await storeService.getStoreInformation();
                setStoreData({
                    storeName: response.storeName || "",
                    email: response.email || "",
                    fanpage: response.fanpage || "",
                    phone: response.phone || "",
                    address: response.address || "",
                    description: response.description || "",
                    logo: response.logo || "",
                });
            } catch (err) {
                console.error("Failed to load store settings:", err);
            }
        };
        fetchSettings();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                formData
            );
            const { token, type, userId, username, email, roleName } = response.data;
            localStorage.setItem("token", `${type} ${token}`);
            localStorage.setItem(
                "user",
                JSON.stringify({ userId, username, email, role: roleName })
            );
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
            const status = error.response?.status;
            if (status === 403) {
                alert("Tài khoản đã bị ban!");
            } else if (status === 401) {
                alert("Sai tài khoản hoặc mật khẩu!");
            } else {
                alert("Đăng nhập thất bại. Vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full flex bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Left Side - Store Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center p-12">
                    <div className="text-center">
                        {storeData.logo ? (
                            <img
                                src={storeData.logo}
                                alt={storeData.storeName}
                                className="w-320 h-320 object-contain mb-4 mx-auto"
                            />
                        ) : (
                            <div className="w-32 h-32 bg-gray-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                {/* Placeholder if no logo */}
                            </div>
                        )}
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            {storeData.storeName || "Store Name"}
                        </h1>
                        <p className="text-xl text-gray-600">
                            {storeData.description || "Store description goes here."}
                        </p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 p-8 lg:p-12">
                    <div className="max-w-md mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                            Đăng nhập
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username */}
                            <div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tên đăng nhập"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Mật khẩu"
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Forgot Password */}
                            <div className="text-right">
                                <a
                                    href="/forgot-password"
                                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                                >
                                    Quên mật khẩu?
                                </a>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-600">
                                    Chưa có tài khoản?{' '}
                                    <a
                                        href="/register"
                                        className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                                    >
                                        Đăng ký ngay
                                    </a>
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-60"
                                disabled={loading}
                            >
                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
