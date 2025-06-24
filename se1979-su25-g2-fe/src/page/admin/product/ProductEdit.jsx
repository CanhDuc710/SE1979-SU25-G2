import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../../service/productService";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/constants";

const ProductEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchProduct = async () => {
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
      } catch (err) {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (imageFiles.length > 0) {
        // Use multipart/form-data
        const formData = new FormData();
        formData.append("product", new Blob([JSON.stringify(form)], { type: "application/json" }));
        imageFiles.forEach((file) => formData.append("images", file));
        await axios.put(`${API_BASE_URL}/admin/products/${productId}/with-images`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Use JSON
        await axios.put(`${API_BASE_URL}/products/${productId}`, form);
      }
      setSuccess("Product updated successfully!");
      setTimeout(() => navigate(`/admin/products/${productId}`), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-yellow-50 to-pink-100 rounded-2xl shadow-lg border border-blue-200">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700 drop-shadow">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1 text-blue-800">Product Code</label>
            <input name="productCode" value={form.productCode || ''} onChange={handleChange} className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" required />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-blue-800">Name</label>
            <input name="name" value={form.name || ''} onChange={handleChange} className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" required />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1 text-blue-800">Description</label>
            <textarea name="description" value={form.description || ''} onChange={handleChange} className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" rows={3} />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-blue-800">Category ID</label>
            <input name="categoryId" value={form.categoryId || ''} onChange={handleChange} className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" required />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-blue-800">Brand</label>
            <input name="brand" value={form.brand || ''} onChange={handleChange} className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-blue-800">Material</label>
            <input name="material" value={form.material || ''} onChange={handleChange} className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-blue-800">Gender</label>
            <select name="gender" value={form.gender || ''} onChange={handleChange} className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition">
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="UNISEX">Unisex</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-blue-800">Price</label>
            <input name="price" type="number" value={form.price || ''} onChange={handleChange} className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" required />
          </div>
          <div className="flex items-center gap-2 mt-6 md:mt-0">
            <input name="isActive" type="checkbox" checked={form.isActive || false} onChange={handleChange} className="accent-blue-500 w-5 h-5" />
            <label className="font-semibold text-blue-800">Active</label>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-blue-800">Upload Images</label>
          <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 bg-white" />
        </div>
        <div className="flex gap-4 mt-6 justify-center">
          <button type="submit" className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-8 py-2 rounded-full font-bold shadow hover:scale-105 hover:from-blue-500 hover:to-pink-500 transition-all duration-200">Save</button>
          <button type="button" className="bg-gray-200 text-gray-700 px-8 py-2 rounded-full font-bold shadow hover:bg-gray-300 transition-all duration-200" onClick={() => navigate(-1)}>Cancel</button>
        </div>
        {success && <div className="text-green-600 mt-4 text-center font-semibold animate-pulse">{success}</div>}
        {error && <div className="text-red-600 mt-4 text-center font-semibold animate-pulse">{error}</div>}
      </form>
    </div>
  );
};

export default ProductEdit;

