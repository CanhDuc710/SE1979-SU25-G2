import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../../../service/settingService.js";
import Pagination from "../../../components/Pagination.jsx";

export default function CategorySettings() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [editedName, setEditedName] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchCategories();
    }, [currentPage, searchTerm]);

    const fetchCategories = async () => {
        try {
            const data = await getAllCategories(currentPage, 10, searchTerm);
            setCategories(data.content || []);
            setTotal(data.totalElements || 0);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục:", error);
        }
    };

    const handleAdd = async () => {
        if (!newCategory.trim()) return;
        try {
            await createCategory({ name: newCategory });
            setNewCategory("");
            setCurrentPage(0);
            fetchCategories();
        } catch (error) {
            alert("Lỗi khi thêm danh mục");
        }
    };

    const handleUpdate = async (id) => {
        try {
            await updateCategory(id, { name: editedName });
            setEditingId(null);
            fetchCategories();
        } catch (error) {
            alert("Lỗi khi cập nhật danh mục");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
            try {
                await deleteCategory(id);
                fetchCategories();
            } catch (error) {
                alert("Lỗi khi xóa danh mục");
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className={`transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"} flex-shrink-0`}>
                <Sidebar sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
            </div>

            <div className="flex-1 p-6">
                <h1 className="text-xl font-bold mb-4">Cài đặt {'>'} Cài đặt danh mục</h1>

                <div className="border rounded p-4 shadow bg-white">
                    {/* Search */}
                    <div className="mb-4 flex items-center">
                        <input
                            type="text"
                            placeholder="Tìm kiếm danh mục"
                            className="border px-3 py-2 rounded w-full md:w-1/2"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(0);
                            }}
                        />
                        <FaSearch className="ml-2 text-gray-500" />
                    </div>

                    {/* Table */}
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-2">Tên Danh mục</th>
                            <th className="p-2 w-32">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* Row thêm mới */}
                        <tr>
                            <td className="p-2">
                                <input
                                    className="w-full border px-2 py-1 rounded"
                                    placeholder="Nhập danh mục sản phẩm mới tại đây"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                />
                            </td>
                            <td className="p-2">
                                <button
                                    onClick={handleAdd}
                                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                                >
                                    Lưu
                                </button>
                            </td>
                        </tr>

                        {/* Danh sách */}
                        {categories.map((cat) => (
                            <tr key={cat.categoryId}>
                                <td className="p-2">
                                    {editingId === cat.categoryId ? (
                                        <input
                                            className="w-full border px-2 py-1 rounded"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                        />
                                    ) : (
                                        <span>{cat.name}</span>
                                    )}
                                </td>
                                <td className="p-2 space-x-2">
                                    {editingId === cat.categoryId ? (
                                        <button
                                            onClick={() => handleUpdate(cat.categoryId)}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            Lưu
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setEditingId(cat.categoryId);
                                                setEditedName(cat.name);
                                            }}
                                            className="text-yellow-600 hover:text-yellow-800"
                                        >
                                            <FaEdit />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(cat.categoryId)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="mt-6 flex justify-between items-center text-gray-600 text-sm">
                        <span>Hiển thị {categories.length} / {total} danh mục</span>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
