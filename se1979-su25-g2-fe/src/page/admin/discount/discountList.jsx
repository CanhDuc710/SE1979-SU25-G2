import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "../../../components/Pagination";
import { fetchDiscounts, deleteDiscount } from "../../../service/discountService";

const DISCOUNTS_PER_PAGE = 8;

export default function DiscountList() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [discounts, setDiscounts] = useState([]);

    // --- Filter, sort state ---
    const [searchCode, setSearchCode] = useState("");
    const [minValue, setMinValue] = useState("");
    const [maxValue, setMaxValue] = useState("");
    const [sortBy, setSortBy] = useState("discountId");
    const [direction, setDirection] = useState("asc");



    // --- Load data ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchDiscounts({
                    page: currentPage,
                    size: DISCOUNTS_PER_PAGE,
                    code: searchCode,
                    minValue,
                    maxValue,
                    sortBy,
                    direction,
                });
                setDiscounts(data.content);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Lỗi khi tải danh sách discount:", error);
            }
        };
        fetchData();
    }, [currentPage, searchCode, minValue, maxValue, sortBy, direction]);

    // --- Delete handler ---
    const handleDelete = async (id) => {
        const confirm = window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?");
        if (!confirm) return;

        try {
            await deleteDiscount(id);
            alert("Xóa thành công!");
            const data = await fetchDiscounts({
                page: currentPage,
                size: DISCOUNTS_PER_PAGE,
                code: searchCode,
                minValue,
                maxValue,
                sortBy,
                direction,
            });
            setDiscounts(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Lỗi khi xóa discount:", error);
            alert("Xóa thất bại!");
        }
    };

    // --- Search/filter/sort UI ---
    const handleSearchChange = (e) => setSearchCode(e.target.value);
    const handleMinValueChange = (e) => setMinValue(e.target.value);
    const handleMaxValueChange = (e) => setMaxValue(e.target.value);
    const handleSortByChange = (e) => setSortBy(e.target.value);
    const handleDirectionChange = (e) => setDirection(e.target.value);

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className={`transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"} flex-shrink-0`}>
                <Sidebar
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                />
            </div>

            <div className="flex-1 p-6">
                <h2 className="text-2xl font-semibold mb-6">Discount Management</h2>

                {/* --- Search & Filter & Sort --- */}
                <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <input
                        type="text"
                        value={searchCode}
                        onChange={handleSearchChange}
                        placeholder="Tìm theo mã code..."
                        className="bg-white text-black border p-2 rounded"
                    />
                    <input
                        type="number"
                        value={maxValue}
                        onChange={handleMaxValueChange}
                        placeholder="Giá trị tối đa"
                        className="bg-white text-black border p-2 rounded"
                    />
                    <input
                        type="number"
                        value={minValue}
                        onChange={handleMinValueChange}
                        placeholder="Giá trị tối thiểu"
                        className="bg-white text-black border p-2 rounded"
                    />
                    <div className="flex space-x-2">
                        <select
                            value={sortBy}
                            onChange={handleSortByChange}
                            className="bg-white text-black border p-2 rounded w-1/2"
                        >
                            <option value="discountId">Mặc định</option>
                            <option value="code">Code</option>
                            <option value="discountPercent">Phần trăm giảm</option>
                            <option value="maxDiscountAmount">Số tiền tối đa</option>
                        </select>
                        <select
                            value={direction}
                            onChange={handleDirectionChange}
                            className="bg-white text-black border p-2 rounded w-1/2"
                        >
                            <option value="asc">Tăng dần</option>
                            <option value="desc">Giảm dần</option>
                        </select>
                    </div>
                </div>


                {/* --- Table --- */}
                <div className="overflow-x-auto rounded shadow-md">
                    <table className="min-w-full text-sm bg-white rounded">
                        <thead className="bg-gradient-to-r from-blue-100 to-yellow-100 text-gray-700 text-left">
                        <tr>
                            <th className="px-4 py-3">Code</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">% Off</th>
                            <th className="px-4 py-3">Max Amount</th>
                            <th className="px-4 py-3">Min Order</th>
                            <th className="px-4 py-3">Start</th>
                            <th className="px-4 py-3">End</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {discounts.map((d) => (
                            <tr key={d.discountId} className="border-t hover:bg-gray-50 transition">
                                <td className="px-4 py-2 font-semibold">{d.code}</td>
                                <td className="px-4 py-2">{d.description}</td>
                                <td className="px-4 py-2">{d.discountPercent}%</td>
                                <td className="px-4 py-2">{d.maxDiscountAmount.toLocaleString()}₫</td>
                                <td className="px-4 py-2">{d.minOrderValue.toLocaleString()}₫</td>
                                <td className="px-4 py-2">{d.startDate}</td>
                                <td className="px-4 py-2">{d.endDate}</td>
                                <td className="px-4 py-2">
                                        <span className={`font-medium ${d.isActive ? "text-green-600" : "text-red-500"}`}>
                                            {d.isActive ? "Active" : "Inactive"}
                                        </span>
                                </td>
                                <td className="px-4 py-2 space-x-2">
                                    <button className="bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200">
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(d.discountId)}
                                        className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* --- Pagination --- */}
                <div className="mt-6 flex justify-between items-center text-gray-600 text-sm">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                    <div>
                        Trang {currentPage + 1} / {totalPages}
                    </div>
                </div>
            </div>
        </div>
    );
}
