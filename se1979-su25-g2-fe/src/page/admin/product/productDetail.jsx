import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById, updateProductById } from "../../../service/productService";

export default function ProductDetail() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchProductById(productId);
                setProduct(data);
            } catch (err) {
                setError("Không thể tải sản phẩm.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [productId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProductById(productId, product);
            alert("Cập nhật thành công!");
            navigate("/admin/products"); // hoặc trang danh sách phù hợp
        } catch (err) {
            alert("Cập nhật thất bại!");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 text-gray-500">Đang tải...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!product) return null;

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Chi tiết sản phẩm</h2>

            <div className="space-y-4">
                <div>
                    <label className="block font-medium">Tên sản phẩm</label>
                    <input
                        name="name"
                        value={product.name || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Thương hiệu</label>
                    <input
                        name="brand"
                        value={product.brand || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Giá</label>
                    <input
                        name="price"
                        type="number"
                        value={product.price || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Danh mục</label>
                    <input
                        name="categoryName"
                        value={product.categoryName || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Trạng thái</label>
                    <select
                        name="isActive"
                        value={product.isActive ? "Active" : "Inactive"}
                        onChange={(e) =>
                            setProduct((prev) => ({
                                ...prev,
                                isActive: e.target.value === "Active",
                            }))
                        }
                        className="w-full px-4 py-2 border rounded"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Ảnh (chỉ hiển thị)</label>
                    <div className="flex gap-2">
                        {(product.imageUrls || []).map((url, i) => (
                            <img
                                key={i}
                                src={url}
                                alt={`Ảnh ${i}`}
                                className="w-20 h-20 object-cover rounded border"
                            />
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            </div>
        </div>
    );
}
