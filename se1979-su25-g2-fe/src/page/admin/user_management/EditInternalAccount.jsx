import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAccountById, updateAccount } from "../../../service/accountService";
import { FaArrowCircleLeft } from "react-icons/fa";
import { accountSchema } from "/src/validation/editInfor.js";

export default function EditInternalAccount() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        phone: "",
        gender: "MALE",
        dob: "",
        role: "STAFF",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate với Yup
        try {
            await accountSchema.validate(formData, { abortEarly: false });
            setErrors({});
        } catch (validationError) {
            const validationErrors = {};
            validationError.inner.forEach(err => {
                if (err.path) validationErrors[err.path] = err.message;
            });
            setErrors(validationErrors);
            return;
        }

        // Gửi lên server
        try {
            await updateAccount(id, formData);
            alert("Cập nhật tài khoản thành công!");
            navigate("/admin/accounts");
        } catch (apiError) {
            console.error("Lỗi khi cập nhật tài khoản:", apiError);
            if (apiError.response?.status === 400 && typeof apiError.response.data === 'object') {
                setErrors(apiError.response.data);
            } else {
                alert("Cập nhật tài khoản thất bại! Vui lòng thử lại.");
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAccountById(id);
                setFormData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    username: data.username || "",
                    email: data.email || "",
                    password: "",
                    phone: data.phone || "",
                    gender: data.gender || "MALE",
                    dob: data.dob || "",
                    role: data.role || "STAFF",
                });
            } catch (fetchError) {
                console.error("Lỗi khi lấy dữ liệu tài khoản:", fetchError);
                alert("Không thể tải dữ liệu người dùng.");
                navigate("/admin/accounts");
            }
        };
        if (id) fetchData();
    }, [id, navigate]);

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="flex-1 p-6">
                <div className="px-6 py-4 bg-white shadow-sm mb-6 flex items-center">
                    <button
                        onClick={() => navigate("/admin/accounts")}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                    >
                        <FaArrowCircleLeft size={24} />
                    </button>
                    <h1 className="ml-4 text-3xl font-extrabold text-gray-800">
                        Chỉnh sửa tài khoản người dùng
                    </h1>
                </div>
                <hr className="mb-8 border-gray-300" />

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg"
                >
                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tên <span className="text-red-500">*</span></label>
                        <input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Họ <span className="text-red-500">*</span></label>
                        <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tên tài khoản <span className="text-red-500">*</span></label>
                        <input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full border ${errors.username ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu mới</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Để trống nếu không đổi"
                            className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày sinh <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className={`w-full border ${errors.dob ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Vai trò <span className="text-red-500">*</span></label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={`w-full border ${errors.role ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option value="STAFF">Nhân viên</option>
                            <option value="ADMIN">Quản trị viên</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Giới tính <span className="text-red-500">*</span></label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={`w-full border ${errors.gender ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                            <option value="OTHER">Khác</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                    </div>

                    {/* Phone */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2 flex justify-center mt-6">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-semibold text-lg"
                        >
                            Cập nhật tài khoản
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
