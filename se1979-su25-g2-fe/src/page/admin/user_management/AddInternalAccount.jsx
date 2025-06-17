import { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../../../service/accountService";

export default function AddInternalAccount() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createAccount(formData);
            alert("Tạo tài khoản thành công!");
            navigate("/admin/accounts");
        } catch (err) {
            console.error("Lỗi khi tạo tài khoản:", err);
            alert("Tạo tài khoản thất bại!");
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Sidebar */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"} flex-shrink-0`}>
                <Sidebar sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
                {/* Quay lại */}
                <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline">
                    ← Quay lại
                </button>

                {/* Tiêu đề */}
                <h1 className="text-xl font-bold mb-1">Quản lý tài khoản người dùng {'>'} Thêm tài khoản</h1>
                <hr className="mb-6" />

                {/* Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                    <div>
                        <label className="block text-sm font-medium">Họ</label>
                        <input name="lastName" value={formData.lastName} onChange={handleChange}
                               className="w-full border px-3 py-2 rounded" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Tên</label>
                        <input name="firstName" value={formData.firstName} onChange={handleChange}
                               className="w-full border px-3 py-2 rounded" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Tên tài khoản</label>
                        <input name="username" value={formData.username} onChange={handleChange}
                               className="w-full border px-3 py-2 rounded" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Mật khẩu</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange}
                               className="w-full border px-3 py-2 rounded" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                               className="w-full border px-3 py-2 rounded" required />
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
                        <input name="phone" value={formData.phone} onChange={handleChange}
                               className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div className="md:col-span-2 flex justify-end mt-4">
                        <button type="submit" className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700">
                            Thêm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
