import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { getAccountById, updateAccount } from "../../../service/accountService";
import { FaArrowCircleLeft } from "react-icons/fa";
import { validateAccountForm } from "/src/ValidateForm.js";

export default function EditInternalAccount() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        phone: "",
        gender: "",
        dob: "",
        role: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateAccountForm(formData);
        if (Object.keys(errors).length > 0) {
            alert(Object.values(errors)[0]);
            return;
        }

        try {
            await updateAccount(id, formData);
            alert("Cập nhật tài khoản thành công!");
            navigate("/admin/accounts");
        } catch (err) {
            console.error("Lỗi khi cập nhật tài khoản:", err);
            alert("Cập nhật tài khoản thất bại!");
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
                    gender: data.gender || "",
                    dob: data.dob || "",
                    role: data.role || "",
                });
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu tài khoản:", err);
                alert("Không thể tải dữ liệu người dùng.");
            }
        };
        fetchData();
    }, [id]);

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className={`transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"} flex-shrink-0`}>
                <Sidebar sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
            </div>

            <div className="flex-1 p-6">
                <button
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                    onClick={() => navigate(`/admin/accounts`)}
                >
                    <FaArrowCircleLeft />
                </button>

                <h1 className="text-xl font-bold mb-1">Quản lý tài khoản người dùng {'>'} Chỉnh sửa tài khoản</h1>
                <hr className="mb-6" />

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                    <div>
                        <label className="block text-sm font-medium">Họ</label>
                        <input name="lastName" value={formData.lastName} onChange={handleChange}
                               className="w-full border px-3 py-2 rounded"  />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Tên</label>
                        <input name="firstName" value={formData.firstName} onChange={handleChange}
                               className="w-full border px-3 py-2 rounded" />

                    </div>

                    <div>
                        <label className="block text-sm font-medium">Tên tài khoản</label>
                        <input name="username" value={formData.username} onChange={handleChange}
                               className="w-full border px-3 py-2 rounded" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Mật khẩu mới</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange}
                               placeholder="Để trống nếu không đổi"
                               className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                               className="w-full border px-3 py-2 rounded" />

                    </div>

                    <div>
                        <label className="block text-sm font-medium">Ngày sinh</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange}
                               className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Vai trò</label>
                        <select name="role" value={formData.role} onChange={handleChange}
                                className="w-full border px-3 py-2 rounded">
                            <option value="STAFF">Nhân viên</option>
                            <option value="ADMIN">Quản trị viên</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Giới tính</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}
                                className="w-full border px-3 py-2 rounded">
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                            <option value="OTHER">Khác</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Số điện thoại</label>
                        <input type="number" name="phone" value={formData.phone} onChange={handleChange}
                               className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div className="md:col-span-2 flex justify-end mt-4">
                        <button type="submit" className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700">
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
