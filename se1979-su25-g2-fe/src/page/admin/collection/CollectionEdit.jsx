import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/constants";

const CollectionEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const collectionRes = await axios.get(`${API_BASE_URL}/collections/${id}`);
                const collection = collectionRes.data;
                setFormData({
                    name: collection.name || "",
                    description: collection.description || ""
                });
            } catch (err) {
                setError("Không thể tải dữ liệu bộ sưu tập");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            // Make sure we have at least a name
            if (!formData.name || formData.name.trim() === '') {
                setError("Tên bộ sưu tập là bắt buộc");
                setSaving(false);
                return;
            }
            
            // Create a copy of the form data to ensure we send valid data
            const dataToSend = {
                name: formData.name.trim(),
                description: formData.description || ""
            };
            
            // Get the current collection to preserve productIds
            const currentCollection = await axios.get(`${API_BASE_URL}/collections/${id}`);
            dataToSend.productIds = currentCollection.data.productIds || [];
            
            await axios.put(`${API_BASE_URL}/collections/${id}`, dataToSend);
            setSuccess("Cập nhật bộ sưu tập thành công!");
            setTimeout(() => {
                navigate(`/admin/collections/${id}`);
            }, 1500);
        } catch (err) {
            console.error("Error updating collection:", err);
            setError(err.response?.data?.message || "Không thể cập nhật bộ sưu tập");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Đang tải...</div>;
    if (error && !formData.name) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-yellow-50 to-pink-100 rounded-2xl shadow-lg border border-blue-200">
            <button 
                className="mb-4 text-blue-600 hover:underline" 
                onClick={() => navigate(`/admin/collections/${id}`)}
            >
                &larr; Quay lại chi tiết bộ sưu tập
            </button>
            
            <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700 drop-shadow">
                Chỉnh sửa bộ sưu tập
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

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-gradient-to-r from-blue-400 to-pink-400 text-white px-8 py-3 rounded-full font-bold shadow hover:scale-105 hover:from-blue-500 hover:to-pink-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate(`/admin/collections/${id}`)}
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

export default CollectionEdit;