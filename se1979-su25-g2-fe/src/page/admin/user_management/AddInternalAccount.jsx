import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Sidebar from "../../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../../../service/accountService";
import { FaArrowCircleLeft } from "react-icons/fa";
import { accountSchema } from "/src/validation/internalAccount.js";
import { useEffect } from "react";

export default function AddInternalAccount() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm({
        resolver: yupResolver(accountSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            phone: "",
            gender: "MALE",
            dob: "",
            role: "STAFF",
        },
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert('Bạn cần đăng nhập để truy cập trang này');
            navigate('/login');
        }
    }, [navigate]);

    const onSubmit = async data => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                navigate('/login');
                return;
            }

            await createAccount(data);
            alert("Tạo tài khoản thành công!");
            navigate("/admin/accounts");
        } catch (err) {
            console.error("Lỗi khi tạo tài khoản:", err);

            if (err.message === "Unauthorized") {
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                navigate('/login');
            } else {
                alert("Tạo tài khoản thất bại!");
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <Sidebar />

            <div className="flex-1 p-6">
                <button
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                    onClick={() => navigate("/admin/accounts")}
                >
                    <FaArrowCircleLeft />
                </button>

                <h1 className="text-xl font-bold mb-1">
                    Quản lý tài khoản người dùng {'>'} Thêm tài khoản
                </h1>
                <hr className="mb-6" />

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                    <div>
                        <label className="block text-sm font-medium">Tên</label>
                        <input
                            {...register("firstName")}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.firstName && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Họ</label>
                        <input
                            {...register("lastName")}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.lastName && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.lastName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Tên tài khoản</label>
                        <input
                            {...register("username")}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.username && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Mật khẩu</label>
                        <input
                            type="password"
                            {...register("password")}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.password && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.email && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Ngày sinh</label>
                        <input
                            type="date"
                            {...register("dob")}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.dob && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.dob.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Vai trò</label>
                        <select
                            {...register("role")}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="STAFF">Nhân viên</option>
                            <option value="ADMIN">Quản trị viên</option>
                        </select>
                        {errors.role && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.role.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Giới tính</label>
                        <select
                            {...register("gender")}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                            <option value="OTHER">Khác</option>
                        </select>
                        {errors.gender && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.gender.message}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Số điện thoại</label>
                        <input
                            {...register("phone")}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.phone && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2 flex justify-end mt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting || !isDirty}
                            className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
                        >
                            {isSubmitting ? "Đang tạo..." : "Thêm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}