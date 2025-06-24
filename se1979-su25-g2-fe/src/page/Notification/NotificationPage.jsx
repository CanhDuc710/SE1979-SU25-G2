import React, { useEffect, useState } from "react";
import { FaStar, FaSearch, FaTrashAlt, FaArchive } from "react-icons/fa";
import { fetchNotifications } from "../../service/notificationService";
import { format } from "date-fns";

export default function NotificationPage() {
    const [notifications, setNotifications] = useState([]);
    const [tab, setTab] = useState("all");
    const [month, setMonth] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchNotifications().then(setNotifications);
    }, []);

    const countAll = notifications.filter(n => !n.isArchived).length;
    const countArchive = notifications.filter(n => n.isArchived).length;
    const countFavorite = notifications.filter(n => n.isFavorite && !n.isArchived).length;

    const filtered = notifications.filter(n => {
        if (tab === "archive" && !n.isArchived) return false;
        if (tab === "favorite" && (!n.isFavorite || n.isArchived)) return false;
        if (tab === "all" && n.isArchived) return false;
        if (month) {
            const notiMonth = new Date(n.time).getMonth() + 1;
            if (notiMonth !== parseInt(month)) return false;
        }
        if (search) {
            const query = search.toLowerCase();
            if (!n.title.toLowerCase().includes(query) && !n.content.toLowerCase().includes(query)) return false;
        }
        return true;
    });

    const displayed = filtered.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">List Notification</h1>

            {/* Tabs + Filter */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
                <button onClick={() => setTab("all")} className={`px-4 py-2 rounded ${tab === "all" ? "bg-black text-white" : "bg-gray-100"}`}>
                    All <span className="ml-1 text-xs bg-gray-300 rounded px-2">{countAll}</span>
                </button>
                <button onClick={() => setTab("archive")} className={`px-4 py-2 rounded ${tab === "archive" ? "bg-black text-white" : "bg-gray-100"}`}>
                    Archive <span className="ml-1 text-xs bg-gray-300 rounded px-2">{countArchive}</span>
                </button>
                <button onClick={() => setTab("favorite")} className={`px-4 py-2 rounded ${tab === "favorite" ? "bg-black text-white" : "bg-gray-100"}`}>
                    Favorite <span className="ml-1 text-xs bg-gray-300 rounded px-2">{countFavorite}</span>
                </button>
                <select
                    className="border px-3 py-1 rounded"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                >
                    <option value="">All Months</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i} value={i + 1}>Tháng {i + 1}</option>
                    ))}
                </select>
                <div className="relative ml-auto">
                    <input
                        type="text"
                        placeholder="Search notification..."
                        className="border pl-8 pr-2 py-1 rounded"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <FaSearch className="absolute left-2 top-2 text-gray-400" />
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white shadow rounded divide-y">
                {displayed.length === 0 ? (
                    <div className="p-6 text-gray-500 text-center">No notifications</div>
                ) : (
                    displayed.map(n => (
                        <div key={n.id} className="flex justify-between items-center p-4 hover:bg-gray-50 transition">
                            <div className="flex gap-3 items-center w-full">
                                <FaStar className={`text-yellow-400 ${n.isFavorite ? "" : "opacity-20"}`} />
                                <div className="flex-1 overflow-hidden">
                                    <div className="font-semibold truncate">{n.title}</div>
                                    <div className="text-gray-500 text-sm truncate">{n.content}</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                {n.time ? format(new Date(n.time), "dd MMM, yyyy") : ""}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`px-3 py-1 rounded ${i === page ? "bg-black text-white" : "bg-gray-200"}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
