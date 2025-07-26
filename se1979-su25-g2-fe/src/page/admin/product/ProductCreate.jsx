// src/pages/ProductCreate.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, createProductWithImages, getCategories } from "../../../service/productService";
import { productSchema } from "../../../validation/productSchema.js";

const initialForm = {
  productCode: "",
  name: "",
  description: "",
  categoryId: "",
  brand: "",
  material: "",
  gender: "",
  price: "",
  isActive: true,
};

const ProductCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef();
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    // Chỉ lấy ảnh đầu tiên, nếu chọn ảnh khác sẽ thay thế
    setImageFiles(e.target.files && e.target.files[0] ? [e.target.files[0]] : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await productSchema.validate(form, { abortEarly: false });
    } catch (ve) {
      // gom tất cả thông báo lỗi lại
      const messages = ve.inner.map(err => err.message);
      setError(messages.join("; "));
      setLoading(false);
      return;
    }

    const payload = productSchema.cast(form);

    try {
      if (imageFiles.length > 0) {
        const data = new FormData();
        data.append(
            "product",
            new Blob([JSON.stringify(payload)], { type: "application/json" })
        );
        imageFiles.forEach(file => data.append("images", file));
        await createProductWithImages(data);
      } else {
        await createProduct(payload);
      }
      setSuccess("Product created successfully!");
      setTimeout(() => navigate("/admin/products"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  return (
      <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-yellow-50 to-pink-100 rounded-2xl shadow-lg border border-blue-200">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-pink-700 drop-shadow">
          Thêm sản phẩm mới
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1 text-blue-800">
                Mã sản phẩm
              </label>
              <input
                  name="productCode"
                  value={form.productCode}
                  onChange={handleChange}
                  className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-800">Tên sản phẩm</label>
              <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1 text-blue-800">Mô tả</label>
              <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
                  rows={3}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-800">Danh mục</label>
              <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              >
                <option value="">Chọn danh mục</option>
                {categories.map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.name}
                    </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-800">Thương hiệu</label>
              <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-800">Chất liệu</label>
              <input
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                  className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-800">Giới tính</label>
              <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              >
                <option value="">Chọn giới tính</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="UNISEX">Unisex</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-800">Giá bán (VNĐ)</label>
              <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              />
            </div>
            <div className="flex items-center gap-2 mt-6 md:mt-0">
              <input
                  name="isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="accent-blue-500 w-5 h-5"
              />
              <label className="font-semibold text-blue-800">Kích hoạt</label>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-blue-800">Tải ảnh lên</label>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 bg-white"
                accept="image/*"
            />
            {imageFiles.length > 0 && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(imageFiles[0])}
                  alt="Xem trước"
                  className="h-32 rounded border"
                />
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-6 justify-center">
            <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-8 py-2 rounded-full font-bold shadow hover:scale-105 hover:from-blue-500 hover:to-pink-500 transition-all duration-200 disabled:opacity-60"
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
            <button
                type="button"
                className="bg-gray-200 text-gray-700 px-8 py-2 rounded-full font-bold shadow hover:bg-gray-300 transition-all duration-200"
                onClick={() => navigate(-1)}
            >
              Hủy
            </button>
          </div>
          {success && (
              <div className="text-green-600 mt-4 text-center font-semibold animate-pulse">
                {success === "Product created successfully!" ? "Tạo sản phẩm thành công!" : success}
              </div>
          )}
          {error && (
              <div className="text-red-600 mt-4 text-center font-semibold animate-pulse">
                {error === "Create failed" ? "Tạo sản phẩm thất bại" : error}
              </div>
          )}
        </form>
      </div>
  );
};

export default ProductCreate;
