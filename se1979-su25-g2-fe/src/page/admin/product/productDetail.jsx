// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  createVariant,
  updateVariant,
  deleteVariant,
} from "../../../service/productService";
import { IMAGE_BASE_URL } from "../../../utils/constants";
import { variantSchema } from "../../../validation/variantSchema";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [variantForm, setVariantForm] = useState({
    color: "",
    size: "",
    stockQuantity: "",
    isActive: true,
  });
  const [variantError, setVariantError] = useState(null);
  const [variantSuccess, setVariantSuccess] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch {
        setError("Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  const handleVariantChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVariantForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setVariantError(null);
    setVariantSuccess(null);
  };

  const openAddVariant = () => {
    setEditingVariant(null);
    setVariantForm({ color: "", size: "", stockQuantity: "", isActive: true });
    setShowVariantForm(true);
    setVariantError(null);
    setVariantSuccess(null);
  };

  const openEditVariant = (variant) => {
    setEditingVariant(variant);
    setVariantForm({
      color: variant.color,
      size: variant.size,
      stockQuantity: variant.stockQuantity,
      isActive: variant.isActive,
    });
    setShowVariantForm(true);
    setVariantError(null);
    setVariantSuccess(null);
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa biến thể này?")) return;
    try {
      await deleteVariant(productId, variantId);
      const data = await getProductById(productId);
      setProduct(data);
    } catch {
      alert("Xóa biến thể thất bại");
    }
  };

  const handleVariantSubmit = async (e) => {
    e.preventDefault();
    setVariantError(null);
    setVariantSuccess(null);

    // Yup validation
    try {
      await variantSchema.validate(variantForm, { abortEarly: false });
    } catch (ve) {
      setVariantError(ve.inner.map((err) => err.message).join("; "));
      return;
    }

    try {
      if (editingVariant) {
        await updateVariant(productId, editingVariant.variantId, variantForm);
        setVariantSuccess("Cập nhật biến thể thành công!");
      } else {
        await createVariant(productId, variantForm);
        setVariantSuccess("Thêm biến thể thành công!");
      }
      setShowVariantForm(false);
      const data = await getProductById(productId);
      setProduct(data);
    } catch (err) {
      setVariantError(err.response?.data?.message || "Lưu biến thể thất bại");
    }
  };

  if (loading) return <div className="p-8">Đang tải...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!product) return null;

  // Sửa logic hiển thị ảnh để giống ProductList
  const imageSrc =
      product.imageUrls && product.imageUrls.length > 0
          ? IMAGE_BASE_URL + product.imageUrls[0]
          : "/default-image.jpg";

  return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow">
        {/* Product header */}
        <div className="flex items-center mb-6">
          <img
              src={imageSrc}
              alt={product.name}
              className="w-32 h-32 object-cover rounded mr-6 border"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-image.jpg";
              }}
          />
          <div>
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <div className="text-gray-600 mb-1">{product.brand}</div>
            <div className="text-gray-500">{product.categoryName}</div>
          </div>
        </div>

        {/* Product details table */}
        <table className="w-full mb-6 text-sm">
          <tbody>
          <tr>
            <td className="font-semibold py-2 pr-4">Mã sản phẩm:</td>
            <td>{product.productCode}</td>
          </tr>
          <tr>
            <td className="font-semibold py-2 pr-4">Chất liệu:</td>
            <td>{product.material}</td>
          </tr>
          <tr>
            <td className="font-semibold py-2 pr-4">Giới tính:</td>
            <td>
              {product.gender === "FEMALE"
                ? "Nữ"
                : product.gender === "MALE"
                ? "Nam"
                : product.gender === "UNISEX"
                ? "Unisex"
                : product.gender}
            </td>
          </tr>
          <tr>
            <td className="font-semibold py-2 pr-4">Giá:</td>
            <td>{product.price.toLocaleString()}₫</td>
          </tr>
          <tr>
            <td className="font-semibold py-2 pr-4">Tổng kho:</td>
            <td>{product.totalStock}</td>
          </tr>
          <tr>
            <td className="font-semibold py-2 pr-4">Trạng thái:</td>
            <td>{product.isActive ? "Đang bán" : "Ngừng bán"}</td>
          </tr>
          </tbody>
        </table>

        {/* Description */}
        <div className="mb-4">
          <div className="font-semibold mb-1">Mô tả:</div>
          <div className="bg-gray-50 p-3 rounded border text-gray-700">
            {product.description}
          </div>
        </div>

        {/* Variants list */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="font-semibold">Biến thể sản phẩm:</div>
            <button
                className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-4 py-1 rounded-full font-bold shadow hover:scale-105 hover:from-blue-500 hover:to-pink-500 transition-all duration-200"
                onClick={openAddVariant}
            >
              + Thêm biến thể
            </button>
          </div>
          <table className="w-full text-xs border">
            <thead>
            <tr className="bg-gray-100">
              <th className="py-1 px-2 border">Màu sắc</th>
              <th className="py-1 px-2 border">Kích cỡ</th>
              <th className="py-1 px-2 border">Tồn kho</th>
              <th className="py-1 px-2 border">Trạng thái</th>
              <th className="py-1 px-2 border">Thao tác</th>
            </tr>
            </thead>
            <tbody>
            {product.variants?.length > 0 ? (
                product.variants.map((v) => (
                    <tr key={v.variantId}>
                      <td className="py-1 px-2 border">{v.color}</td>
                      <td className="py-1 px-2 border">{v.size}</td>
                      <td className="py-1 px-2 border">{v.stockQuantity}</td>
                      <td className="py-1 px-2 border">
                        {v.isActive ? "Đang bán" : "Ngừng bán"}
                      </td>
                      <td className="py-1 px-2 border flex gap-2 justify-center">
                        <button
                            className="text-blue-500 hover:text-blue-700 font-bold"
                            onClick={() => openEditVariant(v)}
                        >
                          Sửa
                        </button>
                        <button
                            className="text-red-500 hover:text-red-700 font-bold"
                            onClick={() => handleDeleteVariant(v.variantId)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan="5" className="py-2 text-center text-gray-400">
                    Chưa có biến thể nào
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>

        {/* Variant Form Modal */}
        {showVariantForm && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border-2 border-blue-200">
                <h3 className="text-xl font-bold mb-4 text-blue-700">
                  {editingVariant ? "Chỉnh sửa biến thể" : "Thêm biến thể"}
                </h3>
                <form
                    onSubmit={handleVariantSubmit}
                    className="space-y-4"
                >
                  <div>
                    <label className="block font-semibold mb-1 text-blue-800">
                      Màu sắc
                    </label>
                    <input
                        name="color"
                        value={variantForm.color}
                        onChange={handleVariantChange}
                        className="w-full border-2 border-blue-200 rounded-lg px-3 py-2"
                        required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-blue-800">
                      Kích cỡ
                    </label>
                    <input
                        name="size"
                        value={variantForm.size}
                        onChange={handleVariantChange}
                        className="w-full border-2 border-blue-200 rounded-lg px-3 py-2"
                        required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-blue-800">
                      Số lượng tồn kho
                    </label>
                    <input
                        name="stockQuantity"
                        type="number"
                        value={variantForm.stockQuantity}
                        onChange={handleVariantChange}
                        className="w-full border-2 border-blue-200 rounded-lg px-3 py-2"
                        required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                        name="isActive"
                        type="checkbox"
                        checked={variantForm.isActive}
                        onChange={handleVariantChange}
                        className="accent-blue-500 w-5 h-5"
                    />
                    <label className="font-semibold text-blue-800">
                      Đang bán
                    </label>
                  </div>

                  <div className="flex gap-4 mt-4 justify-center">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-6 py-2 rounded-full font-bold shadow hover:scale-105 hover:from-blue-500 hover:to-pink-500 transition-all duration-200"
                    >
                      {editingVariant ? "Lưu" : "Thêm"}
                    </button>
                    <button
                        type="button"
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-bold shadow hover:bg-gray-300 transition-all duration-200"
                        onClick={() => setShowVariantForm(false)}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
                {variantSuccess && (
                    <div className="text-green-600 mt-2 text-center animate-pulse">
                      {variantSuccess}
                    </div>
                )}
                {variantError && (
                    <div className="text-red-600 mt-2 text-center animate-pulse">
                      {variantError}
                    </div>
                )}
              </div>
            </div>
        )}

        {/* Edit/Back buttons */}
        <div className="flex gap-2 mt-6">
          <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate(`/admin/products/${productId}/edit`)}
          >
            Sửa sản phẩm
          </button>
          <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              onClick={() => navigate(-1)}
          >
            Quay lại
          </button>
        </div>
      </div>
  );
};

export default ProductDetail;
