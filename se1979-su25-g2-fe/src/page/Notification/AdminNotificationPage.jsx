import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/constants";

export default function AdminNotificationPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [target, setTarget] = useState("all");
    const [userId, setUserId] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [search, setSearch] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/notifications`);
            setNotifications(res.data);
        } catch (error) {
            console.error("❌ Lỗi lấy thông báo:", error);
        }
    };

    const handleSend = async () => {
        if (!title || !content) return alert("Điền tiêu đề và nội dung");

        try {
            const payload = {
                title,
                content,
                userId: target === "user" ? Number(userId) : null,
            };
            await axios.post(`${API_BASE_URL}/notifications`, payload);
            alert("✅ Gửi thành công!");
            setTitle("");
            setContent("");
            setUserId("");
            setTarget("all");
            fetchNotifications();
        } catch (error) {
            console.error("❌ Gửi thất bại:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xoá thông báo này?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/notifications/${id}`);
            fetchNotifications();
        } catch (error) {
            console.error("❌ Lỗi xoá:", error);
        }
    };

    const filtered = notifications.filter((n) => {
        const time = new Date(n.time);
        const matchesMonth = !month || time.getMonth() + 1 === parseInt(month);
        const matchesYear = !year || time.getFullYear() === parseInt(year);
        const matchesSearch =
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.content.toLowerCase().includes(search.toLowerCase());

        return matchesMonth && matchesYear && matchesSearch;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="max-w-6xl mx-auto py-10 px-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
                🎯 Quản lý Thông Báo - Admin
            </h1>

            {/* Form gửi thông báo */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-10">
                <h2 className="text-xl font-semibold mb-4">✉️ Gửi Thông Báo Mới</h2>

                <input
                    type="text"
                    placeholder="Nhập tiêu đề..."
                    className="w-full border px-4 py-2 rounded mb-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-200"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    placeholder="Nhập nội dung..."
                    className="w-full border px-4 py-2 rounded mb-4 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-200"
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <div className="flex items-center gap-4 mb-4 flex-wrap">
                    <label className="text-sm">Gửi đến:</label>
                    <select
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        className="border px-3 py-1 rounded bg-gray-800 text-white placeholder-gray-400"
                    >
                        <option value="all">Tất cả</option>
                        <option value="user">Người dùng cụ thể</option>
                    </select>
                    {target === "user" && (
                        <input
                            type="number"
                            placeholder="ID người dùng"
                            className="border px-3 py-1 rounded w-32 bg-gray-800 text-white placeholder-gray-400"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    )}
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                        onClick={handleSend}
                    >
                        Gửi
                    </button>
                </div>
            </div>

            {/* Bộ lọc */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="🔍 Tìm theo từ khoá..."
                    className="border px-4 py-2 rounded flex-1 bg-gray-800 text-white placeholder-gray-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="border px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
                >
                    <option value="">Tháng</option>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            Tháng {i + 1}
                        </option>
                    ))}
                </select>
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="border px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
                >
                    <option value="">Năm</option>
                    {[2024, 2025, 2026].map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>

            {/* Danh sách thông báo */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">📃 Danh sách thông báo</h2>
                {filtered.length === 0 ? (
                    <p className="text-gray-500">Không có thông báo nào.</p>
                ) : (
                    <ul className="divide-y">
                        {paginated.map((n) => (
                            <li
                                key={n.id}
                                className="py-4 flex justify-between items-start hover:bg-gray-50 transition"
                            >
                                <div>
                                    <div className="font-bold text-gray-800">{n.title}</div>
                                    <div className="text-sm text-gray-600">{n.content}</div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {n.userId ? `👤 User #${n.userId}` : "🌐 Tất cả"} |{" "}
                                        {new Date(n.time).toLocaleString()}
                                    </div>
                                </div>
                                <button
                                    className="text-red-500 hover:underline text-sm"
                                    onClick={() => handleDelete(n.id)}
                                >
                                    Xoá
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i)}
                                className={`px-4 py-2 rounded font-medium ${
                                    i === currentPage
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
