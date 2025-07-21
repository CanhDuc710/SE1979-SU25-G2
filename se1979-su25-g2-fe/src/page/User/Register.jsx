import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        dob: "",
        sex: "OTHER",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = "Vui lòng nhập họ";
        if (!formData.lastName.trim()) newErrors.lastName = "Vui lòng nhập tên";
        if (!formData.username.trim()) newErrors.username = "Vui lòng nhập tên đăng nhập";

        if (!formData.email.trim()) {
            newErrors.email = "Vui lòng nhập email";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ";
        }

        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Vui lòng nhập số điện thoại";

        if (!formData.password) {
            newErrors.password = "Vui lòng nhập mật khẩu";
        } else if (formData.password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const payload = { ...formData };
            delete payload.confirmPassword;

            await axios.post("http://localhost:8080/api/auth/register", payload);

            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate("/login");
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            alert("Đăng ký thất bại. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Đăng ký tài khoản</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Họ"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                        </div>

                        <div>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Tên"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                        </div>
                    </div>

                    <div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Tên đăng nhập"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg ${errors.username ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                    </div>

                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Số điện thoại"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg ${errors.phoneNumber ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                    </div>

                    <div>
                        <input
                            type="date"
                            name="dob"
                            placeholder="Ngày sinh"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div className="flex gap-4">
                        <label>
                            <input type="radio" name="sex" value="MALE" checked={formData.sex === "MALE"} onChange={handleInputChange} />
                            <span className="ml-1">Nam</span>
                        </label>
                        <label>
                            <input type="radio" name="sex" value="FEMALE" checked={formData.sex === "FEMALE"} onChange={handleInputChange} />
                            <span className="ml-1">Nữ</span>
                        </label>
                        <label>
                            <input type="radio" name="sex" value="OTHER" checked={formData.sex === "OTHER"} onChange={handleInputChange} />
                            <span className="ml-1">Khác</span>
                        </label>
                    </div>

                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg ${errors.password ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-50"
                    >
                        {isLoading ? "Đang xử lý..." : "Đăng ký"}
                    </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-6">
                    Đã có tài khoản?{" "}
                    <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Đăng nhập
                    </a>
                </p>
            </div>
        </div>
    );
}
