import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";
import { fetchAllProductsPaged } from "../../../service/productService";
import Pagination from "../../../components/Pagination";
import { IMAGE_BASE_URL } from "../../../utils/constants";

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
        <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white" style={{ minHeight: '100vh' }}>


            {/* Main content */}
            <div className="flex-1 flex flex-col p-6" style={{ minHeight: '100vh' }}>
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
                <div className="overflow-x-auto rounded shadow-md flex-1">
                    <table className="min-w-full w-full text-sm bg-white rounded table-auto">
                        <thead className="bg-gradient-to-r from-blue-100 to-yellow-100 text-gray-700 text-left">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Image</th>
                            <th className="px-4 py-3">Product Name</th>
                            <th className="px-4 py-3">Product Code</th>
                            <th className="px-4 py-3">Brand</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Material</th>
                            <th className="px-4 py-3">Gender</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Available Colors</th>
                            <th className="px-4 py-3">Available Sizes</th>
                            <th className="px-4 py-3">Total Stock</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredProducts.map((product, idx) => {
                            const {
                                productId,
                                productCode,
                                name,
                                brand,
                                categoryName,
                                material,
                                gender,
                                price,
                                imageUrls,
                                isActive,
                                availableColors,
                                availableSizes,
                                totalStock
                            } = product;
                            // Calculate the correct index based on pagination
                            const displayId = currentPage * PRODUCTS_PER_PAGE + idx + 1;
                            return (
                                <tr key={productId} className="border-t hover:bg-gray-50 transition">
                                    <td className="px-4 py-2 font-bold">{displayId}</td>
                                    <td className="px-4 py-2">
                                        <img
                                            src={imageUrls?.[0] ? IMAGE_BASE_URL + imageUrls[0] : undefined}
                                            alt={name}
                                            className="rounded w-12 h-12 object-cover border"
                                        />
                                    </td>
                                    <td className="px-4 py-2 font-semibold text-blue-600">{name}</td>
                                    <td className="px-4 py-2">{productCode}</td>
                                    <td className="px-4 py-2">{brand}</td>
                                    <td className="px-4 py-2">{categoryName}</td>
                                    <td className="px-4 py-2">{material}</td>
                                    <td className="px-4 py-2">{gender}</td>
                                    <td className="px-4 py-2">{price.toLocaleString()}₫</td>
                                    <td className="px-4 py-2">{availableColors && availableColors.length > 0 ? availableColors.join(", ") : '-'}</td>
                                    <td className="px-4 py-2">{availableSizes && availableSizes.length > 0 ? availableSizes.join(", ") : '-'}</td>
                                    <td className="px-4 py-2">{totalStock}</td>
                                    <td className="px-4 py-2">
                                        <span className={getStatusStyle(isActive ? "Active" : "Inactive")}>{isActive ? "Active" : "Inactive"}</span>
                                    </td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 p-1 rounded border border-blue-200 hover:bg-blue-50"
                                            title="Edit product"
                                            onClick={() => alert(`Edit product ${productId}`)}
                                        >
                                            <FaEdit />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
}
