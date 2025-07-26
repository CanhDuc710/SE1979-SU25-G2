// src/pages/ProductEdit.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  updateProduct,
  updateProductWithImages,
  getCategories,
} from "../../../service/productService";
// Thêm import Yup schema (chú ý đường dẫn)
import { productSchema } from "../../../validation/productSchema";

const ProductEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(productId);
        setProduct(data);
        setForm({
          productCode: data.productCode,
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
          brand: data.brand,
          material: data.material,
          gender: data.gender,
          price: data.price,
          isActive: data.isActive,
        });
      } catch {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    getCategories()
        .then((data) => setCategories(data))
        .catch(() => setCategories([]));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // clear field error
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setError(null);
  };

  const handleFileChange = (e) => {
    // Chỉ lấy ảnh đầu tiên, nếu chọn ảnh khác sẽ thay thế
    setImageFiles(e.target.files && e.target.files[0] ? [e.target.files[0]] : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setErrors({});

    // --- YUP VALIDATION ---
    try {
      await productSchema.validate(form, { abortEarly: false });
    } catch (ve) {
      const fieldErrors = {};
      ve.inner.forEach((err) => {
        if (err.path) fieldErrors[err.path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    // --- END VALIDATION ---

    try {
      if (imageFiles.length > 0) {
        const data = new FormData();
        data.append(
            "product",
            new Blob([JSON.stringify(form)], { type: "application/json" })
        );
        imageFiles.forEach((file) => data.append("images", file));
        await updateProductWithImages(productId, data);
      } else {
        await updateProduct(productId, form);
      }
      setSuccess("Product updated successfully!");
      setTimeout(() => navigate(`/admin/products/${productId}`), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error && !product) return <div className="p-8 text-red-500">{error}</div>;
  if (!product) return null;

  return (
      <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-yellow-50 to-pink-100 rounded-2xl shadow-lg border border-blue-200">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700 drop-shadow">
          Chỉnh sửa sản phẩm
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
              <div className="text-red-600 text-center font-semibold">{error}</div>
          )}
          {success && (
              <div className="text-green-600 text-center font-semibold">{success}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1 text-blue-800">
                Mã sản phẩm              </label>
              <input
                  name="productCode"
                  value={form.productCode || ""}
                  onChange={handleChange}
                  className={`w-full border-2 rounded-lg px-3 py-2 focus:ring-2 ${
                      errors.productCode
                          ? "border-red-500 focus:ring-red-200"
                          : "border-blue-200 focus:ring-blue-300"
                  } transition`}
                  required
              />
              {errors.productCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productCode}
                  </p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-blue-800">Name</label>
              <input
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                  className={`w-full border-2 rounded-lg px-3 py-2 focus:ring-2 ${
                      errors.name
                          ? "border-red-500 focus:ring-red-200"
                          : "border-blue-200 focus:ring-blue-300"
                  } transition`}
                  required
              />
              {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold mb-1 text-blue-800">
                Mô tả
              </label>
              <textarea
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full border-2 rounded-lg px-3 py-2 focus:ring-2 ${
                      errors.description
                          ? "border-red-500 focus:ring-red-200"
                          : "border-blue-200 focus:ring-blue-300"
                  } transition`}
              />
              {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-blue-800">Kiểu dáng</label>
              <select
                  name="categoryId"
                  value={form.categoryId || ""}
                  onChange={handleChange}
                  className={`w-full border-2 rounded-lg px-3 py-2 focus:ring-2 ${
                      errors.categoryId
                          ? "border-red-500 focus:ring-red-200"
                          : "border-blue-200 focus:ring-blue-300"
                  } transition`}
                  required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.name}
                    </option>
                ))}
              </select>
              {errors.categoryId && (
                  <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-blue-800">Thương Hiệu</label>
              <input
                  name="brand"
                  value={form.brand || ""}
                  onChange={handleChange}
                  className={`w-full border-2 rounded-lg px-3 py-2 focus:ring-2 ${
                      errors.brand
                          ? "border-red-500 focus:ring-red-200"
                          : "border-blue-200 focus:ring-blue-300"
                  } transition`}
              />
              {errors.brand && (
                  <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-blue-800">Chất liệu</label>
              <input
                  name="material"
                  value={form.material || ""}
                  onChange={handleChange}
                  className={`w-full border-2 rounded-lg px-3 py-2 focus:ring-2 ${
                      errors.material
                          ? "border-red-500 focus:ring-red-200"
                          : "border-blue-200 focus:ring-blue-300"
                  } transition`}
              />
              {errors.material && (
                  <p className="text-red-500 text-sm mt-1">{errors.material}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-blue-800">Giới tính</label>
              <select
                  name="gender"
                  value={form.gender || ""}
                  onChange={handleChange}
                  className={`w-full border-2 rounded-lg px-3 py-2 focus:ring-2 ${
                      errors.gender
                          ? "border-red-500 focus:ring-red-200"
                          : "border-blue-200 focus:ring-blue-300"
                  } transition`}
              >
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="UNISEX">Unisex</option>
              </select>
              {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-blue-800">Giá</label>
              <input
                  name="price"
                  type="number"
                  value={form.price || ""}
                  onChange={handleChange}
                  className={`w-full border-2 rounded-lg px-3 py-2 focus:ring-2 ${
                      errors.price
                          ? "border-red-500 focus:ring-red-200"
                          : "border-blue-200 focus:ring-blue-300"
                  } transition`}
                  required
              />
              {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div className="flex items-center gap-2 mt-6 md:mt-0">
              <input
                  name="isActive"
                  type="checkbox"
                  checked={form.isActive || false}
                  onChange={handleChange}
                  className="accent-blue-500 w-5 h-5"
              />
              <label className="font-semibold text-blue-800">Active</label>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-blue-800">Ảnh</label>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="w-full border-2 rounded-lg px-3 py-2 bg-white"
                accept="image/*"
            />
            {imageFiles.length > 0 && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(imageFiles[0])}
                  alt="Preview"
                  className="h-32 rounded border"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-6 justify-center">
            <button
                type="submit"
                className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-8 py-2 rounded-full font-bold shadow hover:scale-105 transition-all duration-200"
            >
Lưu            </button>
            <button
                type="button"
                className="bg-gray-200 text-gray-700 px-8 py-2 rounded-full font-bold shadow hover:bg-gray-300 transition-all duration-200"
                onClick={() => navigate(-1)}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
  );
};

export default ProductEdit;