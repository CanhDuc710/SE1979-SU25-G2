import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IMAGE_BASE_URL, API_BASE_URL } from "../../../utils/constants";

const CollectionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [success, setSuccess] = useState(null);
    const [products, setProducts] = useState([]);
    const fileInputRef = useRef();

    useEffect(() => {
        console.log('CollectionDetail useEffect id:', id, typeof id); // Debug log
        if (!id || id === 'undefined' || id === undefined || id === null) {
            setLoading(false);
            setError("No collection ID provided in URL.");
            return;
        }
        const fetchCollection = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/collections/${id}`);
                console.log('Fetched collection:', res.data); // Debug log
                setCollection(res.data);
                // Fetch product details for each productId
                if (res.data && res.data.productIds && res.data.productIds.length > 0) {
                    const productDetails = await Promise.all(
                        res.data.productIds.map(pid => axios.get(`/api/products/${pid}`).then(r => r.data))
                    );
                    setProducts(productDetails);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                setError("Failed to load collection");
            } finally {
                setLoading(false);
            }
        };
        fetchCollection();
    }, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setBannerFile(file);
        if (file) {
            setBannerPreview(URL.createObjectURL(file));
        } else {
            setBannerPreview(null);
        }
    };

    const handleBannerUpload = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!bannerFile) return;
        const formData = new FormData();
        formData.append("file", bannerFile);
        try {
            await axios.put(`${API_BASE_URL}/collections/${id}/banner`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSuccess("Banner updated!");
            // Refresh collection
            const res = await axios.get(`${API_BASE_URL}/collections/${id}`);
            setCollection(res.data);
            setBannerFile(null);
            setBannerPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            setError("Failed to update banner");
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!collection) return <div className="p-8 text-gray-500">No collection data found for this ID.</div>;

    return (
        <div className="max-w-xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-yellow-50 to-pink-100 rounded-2xl shadow-lg border border-blue-200">
            <button className="mb-4 text-blue-600 hover:underline" onClick={() => navigate(-1)}>&larr; Quay lại</button>
            <h2 className="text-2xl font-extrabold mb-6 text-center text-blue-700 drop-shadow">Chi tiết BST</h2>
            <div className="flex flex-col items-center mb-6">
                <img
                    src={bannerPreview || (collection.bannerUrl ? IMAGE_BASE_URL + collection.bannerUrl : "/images/default-image.jpg")}
                    alt={collection.name}
                    className="w-full max-w-md h-48 object-cover rounded border mb-4"
                />
                <div className="font-bold text-lg text-blue-800 mb-2">{collection.name}</div>
                <div className="text-gray-700 mb-2 text-center">{collection.description}</div>

                {/* Edit Button */}
                <button
                    onClick={() => navigate(`/admin/collections/${id}/edit`)}
                    className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-full font-bold shadow hover:scale-105 hover:from-green-500 hover:to-blue-600 transition-all duration-200 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Chỉnh sửa BST
                </button>
            </div>
            <form onSubmit={handleBannerUpload} className="space-y-4">
                <div>
                    <label className="block font-semibold mb-1 text-blue-800">Ảnh BST</label>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 bg-white" accept="image/*" />
                </div>
                <button type="submit" className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-8 py-2 rounded-full font-bold shadow hover:scale-105 hover:from-blue-500 hover:to-pink-500 transition-all duration-200">Cập nhật ảnh BST</button>
                {success && <div className="text-green-600 mt-2 text-center animate-pulse">{success}</div>}
                {error && <div className="text-red-600 mt-2 text-center animate-pulse">{error}</div>}
            </form>
            <div className="mt-8">
                <div className="font-semibold text-blue-800 mb-2">Sản phẩm trong BST</div>
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products.map((item) => (
                            <div
                                key={item.productId}
                                className="flex items-center gap-4 bg-white rounded-lg shadow p-3 hover:shadow-lg transition cursor-pointer"
                                onClick={() => navigate(`/admin/products/${item.productId}`)}
                            >
                                <img
                                    src={item.imageUrls?.[0] ? `${IMAGE_BASE_URL}${item.imageUrls[0]}` : "/images/default-image.jpg"}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded border"
                                />
                                <div>
                                    <div className="font-bold text-blue-700 hover:underline">{item.name}</div>
                                    <div className="text-gray-600 text-sm">{item.price?.toLocaleString()}₫</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500">No products in this collection.</div>
                )}
            </div>
        </div>
    );
};

export default CollectionDetail;

