import {useNavigate, useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { getAccountDetail, banAccount, unbanAccount } from "../../../service/accountService";
import { FaArrowCircleLeft	,FaUser, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function UserDetail() {
    const { id } = useParams();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("info");
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [userStatus, setUserStatus] = useState("");
    const navigate = useNavigate();

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
    useEffect(() => {
        const fetchUser = async () => {
            const data = await getAccountDetail(id);
            setUser(data);
            setUserStatus(data.status);
        };
        if (id) fetchUser();
    }, [id]);

    const handleToggleStatus = async () => {
        if (!id || loadingStatus) return;
        setLoadingStatus(true);

        try {
            if (userStatus === "INACTIVE" || userStatus === "BANNED") {
                await unbanAccount(id);
            } else {
                await banAccount(id);
            }
            const updated = await getAccountDetail(id);
            setUser(updated);
            setUserStatus(updated.status);
        } catch (error) {
            console.error("Error toggling status:", error);
        } finally {
            setLoadingStatus(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className={`transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"} flex-shrink-0`}>
                <Sidebar sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
            </div>

            <div className="flex-1 p-6">
                {user ? (
                    <>
                        <button
                            className="bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                            onClick={() =>
                                navigate(`/admin/accounts`)
                            }
                        >
                            <FaArrowCircleLeft	 />
                        </button>
                        <h2 className="text-2xl font-bold mb-6">Quản lý tài khoản người dùng</h2>
                        <div className="flex space-x-2 mb-4">
                            <button
                                className={`px-4 py-2 rounded-t ${activeTab === "info" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                onClick={() => setActiveTab("info")}
                            >
                                Thông tin cá nhân
                            </button>
                            <button
                                className={`px-4 py-2 rounded-t ${activeTab === "orders" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                onClick={() => setActiveTab("orders")}
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
                                {/*<Field label="Địa chỉ" value={user.address || ""} />*/}

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
                                                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${userStatus === "ACTIVE" ? "bg-red-500" : "bg-green-500"}`}
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
                                <p>Lịch sử đơn hàng đang code hẹ hẹ hẹ</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-gray-600">Đang tải dữ liệu</div>
                )}
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
