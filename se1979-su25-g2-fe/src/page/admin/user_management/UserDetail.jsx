import {useNavigate, useParams, useLocation} from "react-router-dom"; // Thêm useLocation
import { useEffect, useState } from "react";
import { getAccountDetail, banAccount, unbanAccount } from "../../../service/accountService";
import { FaArrowCircleLeft ,FaUser, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import OrderHistory from "./OrderHistory.jsx";

export default function UserDetail() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("info");
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [userStatus, setUserStatus] = useState("");
    const navigate = useNavigate();
    const { pathname } = useLocation(); // Lấy pathname hiện tại

    const sexLabel = {
        MALE: "Nam",
        FEMALE: "Nữ",
        OTHER: "Khác",
    };

    const roleLabels = {
        ADMIN: "Quản trị viên",
        STAFF: "Nhân viên",
        CUSTOMER: "Người dùng",
    };

    // Đồng bộ activeTab với URL khi component mount hoặc URL thay đổi
    useEffect(() => {
        if (pathname.endsWith(`/admin/accounts/${id}/orders`)) {
            setActiveTab("orders");
        } else if (pathname.endsWith(`/admin/accounts/${id}`)) {
            setActiveTab("info");
        }
    }, [pathname, id]);

    useEffect(() => {
        const fetchUser = async () => {
            // Hiển thị trạng thái tải khi đang fetch user data
            setUser(null); // Clear user data while loading
            setLoadingStatus(true);
            try {
                const data = await getAccountDetail(id);
                setUser(data);
                setUserStatus(data.status);
            } catch (err) {
                console.error("Lỗi khi tải thông tin tài khoản:", err);
                // Xử lý lỗi: có thể hiển thị thông báo cho người dùng
                alert("Lỗi khi tải thông tin tài khoản. Vui lòng thử lại!");
            } finally {
                setLoadingStatus(false);
            }
        };
        if (id) fetchUser();
    }, [id]);

    const handleToggleStatus = async () => {
        if (!id || loadingStatus) return; // Ngăn chặn nhiều lần click khi đang tải
        setLoadingStatus(true);

        try {
            if (userStatus === "INACTIVE" || userStatus === "BANNED") {
                await unbanAccount(id);
            } else {
                await banAccount(id);
            }
            const updated = await getAccountDetail(id); // Lấy lại thông tin sau khi update
            setUser(updated);
            setUserStatus(updated.status);
            alert(`Trạng thái tài khoản đã được cập nhật thành: ${updated.status === "ACTIVE" ? "HOẠT ĐỘNG" : "BỊ CẤM"}`);
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            alert("Cập nhật trạng thái thất bại. Vui lòng thử lại!");
        } finally {
            setLoadingStatus(false);
        }
    };

    // Hiển thị trạng thái tải ban đầu
    if (!user && loadingStatus) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-blue-500 text-lg flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tải dữ liệu...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-red-500 text-lg">Không tìm thấy thông tin người dùng hoặc có lỗi xảy ra.</p>
            </div>
        );
    }


    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="flex-1 p-6">
                {/* Dữ liệu người dùng đã được fetch ở trên, nên bỏ kiểm tra user ở đây */}
                <>
                    <button
                        className="bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                        onClick={() => navigate(`/admin/accounts`)}
                    >
                        <FaArrowCircleLeft />
                    </button>
                    <h2 className="text-2xl font-bold mb-6">Quản lý tài khoản người dùng</h2>
                    <div className="flex space-x-2 mb-4">
                        <button
                            className={`px-4 py-2 rounded-t ${activeTab === "info" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={() => navigate(`/admin/accounts/${id}`)} // Chuyển URL khi click
                        >
                            Thông tin cá nhân
                        </button>
                        <button
                            className={`px-4 py-2 rounded-t ${activeTab === "orders" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={() => navigate(`/admin/accounts/${id}/orders`)} // Chuyển URL khi click
                        >
                            Đơn hàng
                        </button>
                    </div>

                    {activeTab === "info" ? (
                        <div className="bg-white p-6 rounded shadow-md space-y-4 max-w-xl">
                            <Field label="Họ và tên" value={`${user.firstName || ""} ${user.lastName || ""}`} />
                            <Field label="Tên tài khoản" value={user.username || ""} />
                            <Field label="Vai trò" value={roleLabels[user.role] || ""} />
                            <Field label="Ngày sinh" value={user.dob || ""} />
                            <Field label="Giới tính" value={sexLabel[user.sex] || ""} />
                            <Field label="Email" value={user.email || ""} />
                            <Field label="Số điện thoại" value={user.phoneNumber || ""} />

                            {/* STATUS with Toggle Button */}
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="flex items-center mb-1 text-blue-700">
                                    <FaUser className="mr-2" />
                                    <span className="text-sm font-medium">Trạng thái</span>
                                </div>
                                <div className="flex items-center justify-between pl-6">
                                    <div className="flex items-center">
                                        {userStatus === "ACTIVE" ? (
                                            <FaCheckCircle className="text-green-500 mr-2" />
                                        ) : (
                                            <FaTimesCircle className="text-red-500 mr-2" />
                                        )}
                                        <span className={`font-medium ${userStatus === "ACTIVE" ? "text-green-600" : "text-red-600"}`}>
                                            {userStatus}
                                        </span>
                                    </div>

                                    {/* Toggle button */}
                                    <div className="flex items-center">
                                        <label htmlFor="toggleSwitch" className="relative inline-block w-12 h-6">
                                            <input
                                                id="toggleSwitch"
                                                type="checkbox"
                                                className="opacity-0 w-0 h-0"
                                                checked={userStatus === "ACTIVE"}
                                                onChange={handleToggleStatus}
                                                disabled={loadingStatus}
                                            />
                                            <span
                                                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${userStatus === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}
                                            ></span>
                                            <span
                                                className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${userStatus === "ACTIVE" ? "translate-x-6" : "translate-x-0"}`}
                                            ></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded shadow-md">
                            <OrderHistory userId={id} />
                        </div>
                    )}
                </>
            </div>
        </div>
    );
}

function Field({ label, value }) {
    return (
        <div>
            <div className="text-sm text-gray-600">{label}</div>
            <div className="font-medium">{value}</div>
        </div>
    );
}