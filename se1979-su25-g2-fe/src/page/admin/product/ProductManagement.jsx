import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";
import { fetchAllProductsPaged } from "../../../service/productService";
import Pagination from "../../../components/Pagination";

const PRODUCTS_PER_PAGE = 5;

export default function ProductManagement() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState(0); // Backend dùng index = 0
    const [totalPages, setTotalPages] = useState(0);
    const [products, setProducts] = useState([]);
    const [filterCategory, setFilterCategory] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    // Lấy dữ liệu từ API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAllProductsPaged(currentPage, PRODUCTS_PER_PAGE);
                setProducts(data.content);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            }
        };
        fetchData();
    }, [currentPage]);

    const getStatusStyle = (status) => {
        switch (status) {
            case "Active":
                return "text-blue-600 font-semibold underline cursor-pointer";
            case "Inactive":
                return "text-gray-600 font-semibold underline cursor-pointer";
            case "Out of Stock":
                return "text-red-600 font-semibold underline cursor-pointer";
            default:
                return "";
        }
    };

    const filteredProducts = products.filter((p) => {
        const matchCategory = filterCategory ? p.categoryName === filterCategory : true;
        const matchStatus = filterStatus
            ? (p.isActive ? "Active" : "Inactive") === filterStatus
            : true;
        return matchCategory && matchStatus;
    });


    const categories = [...new Set(products.map((p) => p.categoryName))];

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Sidebar */}
            <div
                className={`transition-all duration-300 ${
                    sidebarCollapsed ? "w-16" : "w-64"
                } flex-shrink-0`}
            >
                <Sidebar
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                />
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-semibold mb-6">Product Management</h2>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by name (not functional)"
                        className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-white text-black"
                        // (Optional) future implementation
                    />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 border rounded bg-white text-black"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border rounded bg-white text-black"
                    >
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded shadow-md">
                    <table className="min-w-full text-sm bg-white rounded">
                        <thead className="bg-gradient-to-r from-blue-100 to-yellow-100 text-gray-700 text-left">
                        <tr>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3">Brand</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredProducts.map(
                            ({
                                 productId,
                                 name,
                                 brand,
                                 categoryName,
                                 price,
                                 imageUrls,
                                 isActive,
                             }) => (
                                <tr
                                    key={productId}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 py-2 flex items-center gap-2">
                                        <img
                                            src={imageUrls?.[0]}
                                            alt={name}
                                            className="rounded-full w-8 h-8 object-cover"
                                        />
                                        <span className="font-semibold text-blue-600 hover:underline cursor-pointer">
                        {name}
                      </span>
                                    </td>
                                    <td className="px-4 py-2">{brand}</td>
                                    <td className="px-4 py-2">{categoryName}</td>
                                    <td className="px-4 py-2">
                                        {price.toLocaleString("vi-VN")} VND
                                    </td>
                                    <td
                                        className={`px-4 py-2 ${
                                            getStatusStyle(isActive ? "Active" : "Inactive")
                                        }`}
                                    >
                                        {isActive ? "Active" : "Inactive"}
                                    </td>
                                    <td className="px-4 py-2 space-x-2">
                                        <button className="bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200">
                                            <FaEdit />
                                        </button>
                                        <button className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            )
                        )}
                        </tbody>
                    </table>
                </div>

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
