// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { registerSchema } from "../../validation/registerSchema";

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
        setFormData((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        // Validate with Yup
        try {
            await registerSchema.validate(formData, { abortEarly: false });
        } catch (ve) {
            const newErrors = {};
            ve.inner.forEach((err) => {
                if (err.path) newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        // Submit
        try {
            const payload = { ...formData };
            delete payload.confirmPassword;
            await axios.post("http://localhost:8080/api/auth/register", payload);
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate("/login");
        } catch {
            alert("Đăng ký thất bại. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Đăng ký tài khoản
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                name="firstName"
                                placeholder="Họ"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg ${
                                    errors.firstName ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.firstName}
                                </p>
                            )}
                        </div>
                        <div>
                            <input
                                name="lastName"
                                placeholder="Tên"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg ${
                                    errors.lastName ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.lastName}
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        <input
                            name="username"
                            placeholder="Tên đăng nhập"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg ${
                                errors.username ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                        )}
                    </div>
                    <div>
                        <input
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg ${
                                errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <input
                            name="phoneNumber"
                            placeholder="Số điện thoại"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg ${
                                errors.phoneNumber ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.phoneNumber}
                            </p>
                        )}
                    </div>
                    <div>
                        <input
                            name="dob"
                            type="date"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="flex gap-4">
                        {["MALE", "FEMALE", "OTHER"].map((s) => (
                            <label key={s} className="flex items-center">
                                <input
                                    type="radio"
                                    name="sex"
                                    value={s}
                                    checked={formData.sex === s}
                                    onChange={handleInputChange}
                                    className="form-radio"
                                />
                                <span className="ml-1">
                  {s === "MALE"
                      ? "Nam"
                      : s === "FEMALE"
                          ? "Nữ"
                          : "Khác"}
                </span>
                            </label>
                        ))}
                    </div>
                    <div>
                        <input
                            name="password"
                            type="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg ${
                                errors.password ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>
                    <div>
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg ${
                                errors.confirmPassword
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {isLoading ? "Đang xử lý..." : "Đăng ký"}
                    </button>
                </form>
                <p className="text-center text-gray-600 text-sm mt-6">
                    Đã có tài khoản?{" "}
                    <a
                        href="/login"
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Đăng nhập
                    </a>
                </p>
            </div>
        </div>
    );
}
