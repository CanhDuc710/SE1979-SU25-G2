import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/constants";

const CollectionCreate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Make sure we have at least a name
            if (!formData.name || formData.name.trim() === '') {
                setError("Tên bộ sưu tập là bắt buộc");
                setLoading(false);
                return;
            }
            
            // Create a copy of the form data to ensure we send valid data
            const dataToSend = {
                name: formData.name.trim(),
                description: formData.description || "",
                productIds: [] // Start with empty product list
            };
            
            const res = await axios.post(`${API_BASE_URL}/collections`, dataToSend);
            setSuccess("Tạo bộ sưu tập thành công!");
            setTimeout(() => {
                navigate(`/admin/collections/${res.data.id}`);
            }, 1500);
        } catch (err) {
            console.error("Error creating collection:", err);
            setError(err.response?.data?.message || "Không thể tạo bộ sưu tập");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-yellow-50 to-pink-100 rounded-2xl shadow-lg border border-blue-200">
            <button 
                className="mb-4 text-blue-600 hover:underline" 
                onClick={() => navigate("/admin/collections")}
            >
                &larr; Quay lại danh sách bộ sưu tập
            </button>
            
            <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700 drop-shadow">
                Tạo bộ sưu tập mới
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block font-semibold mb-2 text-blue-800">Tên bộ sưu tập</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 bg-white focus:border-blue-400 focus:outline-none transition"
                        placeholder="Nhập tên bộ sưu tập"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2 text-blue-800">Mô tả</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 bg-white focus:border-blue-400 focus:outline-none transition resize-none"
                        placeholder="Nhập mô tả bộ sưu tập"
                    />
                </div>

                <div className="text-gray-600 text-sm italic">
                    Bạn có thể thêm sản phẩm vào bộ sưu tập sau khi tạo.
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-blue-400 to-pink-400 text-white px-8 py-3 rounded-full font-bold shadow hover:scale-105 hover:from-blue-500 hover:to-pink-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Đang tạo..." : "Tạo bộ sưu tập"}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate("/admin/collections")}
                        className="px-8 py-3 border-2 border-blue-400 text-blue-600 rounded-full font-bold hover:bg-blue-50 transition"
                    >
                        Hủy
                    </button>
                </div>

                {success && (
                    <div className="text-green-600 text-center animate-pulse font-semibold">
                        {success}
                    </div>
                )}
                
                {error && (
                    <div className="text-red-600 text-center animate-pulse font-semibold">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
};

export default CollectionCreate;