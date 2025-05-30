import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";

// Sample data
const productsData = [
    // giữ nguyên data bạn đã có
    {
        id: 1,
        image: "https://via.placeholder.com/60x60?text=T1",
        name: "T-Shirt Groot Black",
        brand: "Diorr",
        category: "T-Shirt",
        price: "300.000 VND",
        discount: "15%",
        stock: 200,
        status: "Active",
    },
    // ... các sản phẩm còn lại
];

const PRODUCTS_PER_PAGE = 5;

export default function ProductManagement() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterCategory, setFilterCategory] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const filteredProducts = productsData.filter((p) => {
        const matchCategory = filterCategory ? p.category === filterCategory : true;
        const matchStatus = filterStatus ? p.status === filterStatus : true;
        return matchCategory && matchStatus;
    });

    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

    const pagedProducts = filteredProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

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

    const renderPageButtons = () => {
        const buttons = [];

        buttons.push(
            <button
                key="prev"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded font-bold ${
                    currentPage === 1
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-black text-gray-300 hover:bg-gray-700 cursor-pointer"
                }`}
            >
                Trước
            </button>
        );

        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-10 h-10 rounded font-bold mx-1 ${
                        i === currentPage
                            ? "bg-blue-600 text-white"
                            : "bg-black text-gray-300 hover:bg-gray-700"
                    }`}
                >
                    {i}
                </button>
            );
        }

        buttons.push(
            <button
                key="next"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded font-bold ${
                    currentPage === totalPages
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-black text-gray-300 hover:bg-gray-700 cursor-pointer"
                }`}
            >
                Sau
            </button>
        );

        return buttons;
    };

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
                        className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        // Chưa xử lý search
                    />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 border rounded"
                    >
                        <option value="">All Categories</option>
                        {[...new Set(productsData.map((p) => p.category))].map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border rounded"
                    >
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Out of Stock">Out of Stock</option>
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
                            <th className="px-4 py-3">Discount</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pagedProducts.map(
                            ({
                                 id,
                                 image,
                                 name,
                                 brand,
                                 category,
                                 price,
                                 discount,
                                 stock,
                                 status,
                             }) => (
                                <tr
                                    key={id}
                                    className="border-t hover:bg-gray-50 transition"
                                    style={{ verticalAlign: "middle" }}
                                >
                                    <td className="px-4 py-2 flex items-center gap-2">
                                        <img
                                            src={image}
                                            alt={name}
                                            className="rounded-full w-8 h-8 object-cover"
                                        />
                                        <span className="font-semibold text-blue-600 hover:underline cursor-pointer">
                        {name}
                      </span>
                                    </td>
                                    <td className="px-4 py-2">{brand}</td>
                                    <td className="px-4 py-2">{category}</td>
                                    <td className="px-4 py-2">{price}</td>
                                    <td className="px-4 py-2">{discount}</td>
                                    <td className="px-4 py-2">{stock}</td>
                                    <td className={`px-4 py-2 ${getStatusStyle(status)}`}>
                                        {status}
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
                    <div className="flex gap-2">{renderPageButtons()}</div>
                    <div>
                        Hiển thị{" "}
                        {pagedProducts.length === 0
                            ? 0
                            : (currentPage - 1) * PRODUCTS_PER_PAGE + 1}{" "}
                        -{" "}
                        {(currentPage - 1) * PRODUCTS_PER_PAGE + pagedProducts.length} trên{" "}
                        {filteredProducts.length} mục
                    </div>
                </div>
            </div>
        </div>
    );
}
