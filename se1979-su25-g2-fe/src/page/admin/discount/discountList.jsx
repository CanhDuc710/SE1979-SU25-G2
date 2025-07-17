import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "../../../components/Pagination";
import { fetchDiscounts, deleteDiscount, updateDiscount, createDiscount } from "../../../service/discountService";
import EditDiscountModal from "../../../components/EditDiscountModal";
import AddDiscountModal from "../../../components/AddDiscountModal"; // ✅ Modal thêm mới
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DISCOUNTS_PER_PAGE = 8;

export default function DiscountList() {
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [discounts, setDiscounts] = useState([]);

    const [searchCode, setSearchCode] = useState("");
    const [minValue, setMinValue] = useState("");
    const [maxValue, setMaxValue] = useState("");
    const [sortBy, setSortBy] = useState("discountId");
    const [direction, setDirection] = useState("desc");

    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false); // ✅

    // Load data
    const loadDiscounts = async () => {
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

    useEffect(() => {
        loadDiscounts();
    }, [currentPage, searchCode, minValue, maxValue, sortBy, direction]);

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) return;

        try {
            await deleteDiscount(id);
            toast.success("Xóa thành công!");
            loadDiscounts();
        } catch (error) {
            console.error("Lỗi khi xóa discount:", error);
            toast.error("Xóa thất bại!");
        }
    };

    const handleEdit = (discount) => {
        setSelectedDiscount(discount);
        setShowEditModal(true);
    };

    const handleSaveEdit = async (updatedData) => {
        try {
            await updateDiscount(updatedData.discountId, updatedData);
            toast.success("Cập nhật thành công!");
            setShowEditModal(false);
            loadDiscounts();
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            toast.error("Lỗi khi cập nhật!");
        }
    };

    const handleCreateDiscount = async (data) => {
        try {
            await createDiscount(data);
            toast.success("Tạo mã thành công!");
            setShowAddModal(false);
            loadDiscounts(); // refresh lại danh sách
        } catch (error) {
            console.error("Lỗi khi tạo mã:", error);

            if (
                error.response &&
                error.response.status === 400 &&
                error.response.data?.includes("already exists")
            ) {
                toast.error("Tạo mã thất bại!");
            } else {
                toast.error("Mã giảm giá đã tồn tại!");
            }
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Discount Management</h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        + Tạo mã giảm giá mới
                    </button>
                </div>

                {/* Filter / Search / Sort */}
                <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <input
                        type="text"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        placeholder="Tìm theo mã code..."
                        className="bg-white text-black border p-2 rounded"
                    />
                    <input
                        type="number"
                        value={maxValue}
                        onChange={(e) => setMaxValue(e.target.value)}
                        placeholder="Giá trị tối đa"
                        className="bg-white text-black border p-2 rounded"
                    />
                    <input
                        type="number"
                        value={minValue}
                        onChange={(e) => setMinValue(e.target.value)}
                        placeholder="Giá trị tối thiểu"
                        className="bg-white text-black border p-2 rounded"
                    />
                    <div className="flex space-x-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white text-black border p-2 rounded w-1/2"
                        >
                            <option value="discountId">Mặc định</option>
                            <option value="code">Code</option>
                            <option value="discountPercent">Phần trăm giảm</option>
                            <option value="maxDiscountAmount">Số tiền tối đa</option>
                        </select>
                        <select
                            value={direction}
                            onChange={(e) => setDirection(e.target.value)}
                            className="bg-white text-black border p-2 rounded w-1/2"
                        >
                            <option value="asc">Tăng dần</option>
                            <option value="desc">Giảm dần</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
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
                                    <button
                                        onClick={() => handleEdit(d)}
                                        className="bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                                    >
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

                {/* Modals */}
                <EditDiscountModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    discount={selectedDiscount}
                    onSave={handleSaveEdit}
                />
                <AddDiscountModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleCreateDiscount}
                />

                {/* Toast */}
                <ToastContainer position="bottom-right" autoClose={3000} />

                {/* Pagination */}
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
    );
}
