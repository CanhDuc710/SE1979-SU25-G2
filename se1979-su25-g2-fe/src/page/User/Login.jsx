import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const navigate = useNavigate(); // ← React Router DOM v6
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", formData);

            const { token, type, userId, username, email, roleName } = response.data;

            // ✅ Lưu token và user info
            localStorage.setItem("token", `${type} ${token}`);
            localStorage.setItem("user", JSON.stringify({ userId, username, email, role: roleName }));

            // ✅ Chuyển hướng về trang chủ
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
            alert("Sai tài khoản hoặc mật khẩu!");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        console.log(`Login with ${provider}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full flex bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Left Side - Brand */}
                <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center p-12">
                    <div className="text-center">
                        <div className="w-32 h-24 bg-black rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <svg className="w-16 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14 6l-4.22 5.63 1.25 1.67L14 9.33 19 16h-8.46l-4.01-5.37L1 18h22L14 6zM5 16l1.52-2.03L8.04 16H5z" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">WE</h1>
                        <p className="text-xl text-gray-600">Online Clothes Shop</p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 p-8 lg:p-12">
                    <div className="max-w-md mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Đăng nhập</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
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
                                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                                    Quên mật khẩu?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-60"
                                disabled={loading}
                            >
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </button>
                        </form>

                        {/* Social Login */}
                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">hoặc tiếp tục bằng</span>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-center space-x-4">
                                <button
                                    onClick={() => handleSocialLogin("facebook")}
                                    className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 transform hover:scale-110"
                                >
                                    {/* Facebook Icon */}
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669..." />
                                    </svg>
                                </button>

                                <button
                                    onClick={() => handleSocialLogin("google")}
                                    className="w-12 h-12 bg-white border border-gray-300 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 transform hover:scale-110"
                                >
                                    {/* Google Icon */}
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26..." />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Register Link */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                Chưa có tài khoản?{" "}
                                <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200">
                                    Đăng ký ngay
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
