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
    const [availableProducts, setAvailableProducts] = useState([]);
    const [loadingAvailableProducts, setLoadingAvailableProducts] = useState(false);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [addingProductId, setAddingProductId] = useState(null);
    const [productError, setProductError] = useState(null);
    const [productSuccess, setProductSuccess] = useState(null);
    const fileInputRef = useRef();

    useEffect(() => {
        if (!id || id === 'undefined') {
            setLoading(false);
            setError("Không tìm thấy BST hợp lệ.");
            return;
        }
        const fetchCollection = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/collections/${id}`);
                setCollection(res.data);
                if (res.data?.productIds?.length > 0) {
                    const details = await Promise.all(
                        res.data.productIds.map(pid =>
                            axios.get(`${API_BASE_URL}/products/${pid}`).then(r => r.data).catch(() => null)
                        )
                    );
                    setProducts(details.filter(p => p !== null));
                } else {
                    setProducts([]);
                }
            } catch (err) {
                setError("Không thể tải dữ liệu BST.");
            } finally {
                setLoading(false);
            }
        };
        fetchCollection();
    }, [id]);

    useEffect(() => {
        if (showAddProductModal) {
            const fetchAvailable = async () => {
                setLoadingAvailableProducts(true);
                try {
                    const res = await axios.get(`${API_BASE_URL}/products`, { params: { page: 0, size: 50 } });
                    let all = Array.isArray(res.data?.content) ? res.data.content : (Array.isArray(res.data) ? res.data : []);
                    const currentIds = products.map(p => p.productId);
                    const filtered = all.filter(p => !currentIds.includes(p.productId));
                    setAvailableProducts(filtered);
                } catch (err) {
                    console.error("Error loading products:", err);
                } finally {
                    setLoadingAvailableProducts(false);
                }
            };
            fetchAvailable();
        }
    }, [showAddProductModal, products]);

    const filteredProducts = searchQuery.trim() === ""
        ? availableProducts
        : availableProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setBannerFile(file);
        if (file) setBannerPreview(URL.createObjectURL(file));
    };

    const handleBannerUpload = async (e) => {
        e.preventDefault();
        setSuccess(null);
        setError(null);
        if (!bannerFile) return;
        const formData = new FormData();
        formData.append("file", bannerFile);
        try {
            await axios.put(`${API_BASE_URL}/collections/${id}/banner`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const res = await axios.get(`${API_BASE_URL}/collections/${id}`);
            setCollection(res.data);
            setBannerFile(null);
            setBannerPreview(null);
            fileInputRef.current.value = "";
            setSuccess("Cập nhật ảnh BST thành công!");
        } catch (err) {
            setError("Không thể cập nhật ảnh.");
        }
    };

    const handleAddProduct = async (productId) => {
        if (addingProductId === productId) return;
        setAddingProductId(productId);
        setProductError(null);
        setProductSuccess(null);
        try {
            const res = await axios.post(`${API_BASE_URL}/collections/${id}/products`, productId, {
                headers: { 'Content-Type': 'application/json' }
            });
            setCollection(res.data);
            const product = await axios.get(`${API_BASE_URL}/products/${productId}`);
            setProducts(prev => [...prev, product.data]);
            setAvailableProducts(prev => prev.filter(p => p.productId !== productId));
            setProductSuccess(`Đã thêm "${product.data.name}" vào BST.`);
            setShowAddProductModal(false);
        } catch (err) {
            const msg = err.response?.data?.message || "Không thể thêm sản phẩm.";
            setProductError(msg);
        } finally {
            setAddingProductId(null);
        }
    };

    const handleRemoveProduct = async (productId) => {
        if (!window.confirm("Xoá sản phẩm khỏi BST?")) return;
        setProductError(null);
        setProductSuccess(null);
        try {
            await axios.delete(`${API_BASE_URL}/collections/${id}/products/${productId}`);
            setProducts(prev => prev.filter(p => p.productId !== productId));
            setProductSuccess("Đã xoá sản phẩm khỏi BST.");
        } catch (err) {
            const msg = err.response?.data?.message || "Không thể xoá sản phẩm.";
            setProductError(msg);
        }
    };

    if (loading) return <div className="p-8">Đang tải...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;
    if (!collection) return <div className="p-8 text-gray-500">Không có dữ liệu.</div>;

    return (
        <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-yellow-50 to-pink-100 rounded-2xl shadow-lg border border-blue-200">
            <button className="mb-4 text-blue-600 hover:underline" onClick={() => navigate(-1)}>&larr; Quay lại</button>
            <h2 className="text-2xl font-extrabold text-blue-700 mb-4 text-center drop-shadow">Chi tiết BST</h2>
            <div className="flex flex-col items-center mb-6">
                <img src={bannerPreview || (collection.bannerUrl ? IMAGE_BASE_URL + collection.bannerUrl : "/images/default-image.jpg")}
                     className="w-full max-w-md h-48 object-cover rounded border mb-4" />
                <div className="text-xl font-bold text-blue-800 mb-1">{collection.name}</div>
                <div className="text-gray-700 text-center">{collection.description}</div>
                <button onClick={() => navigate(`/admin/collections/${id}/edit`)} className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-full font-bold shadow hover:scale-105 hover:from-green-500 hover:to-blue-600 transition-all duration-200 flex items-center gap-2">
                    ✏️ Chỉnh sửa BST
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
                <div className="flex justify-between items-center mb-4">
                    <div className="font-semibold text-blue-800">Sản phẩm trong BST</div>
                    <button onClick={() => setShowAddProductModal(true)} className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-full font-bold shadow hover:scale-105 hover:from-green-500 hover:to-blue-500 transition-all duration-200 text-sm">+ Thêm sản phẩm</button>
                </div>
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products.map((p) => (
                            <div key={p.productId} className="flex justify-between items-center bg-white rounded-lg shadow p-3 hover:shadow-lg transition">
                                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/admin/products/${p.productId}`)}>
                                    <img src={p.imageUrls?.[0] ? IMAGE_BASE_URL + p.imageUrls[0] : "/images/default-image.jpg"} className="w-14 h-14 object-cover rounded border" />
                                    <div>
                                        <div className="font-bold text-blue-700 hover:underline">{p.name}</div>
                                        <div className="text-gray-600 text-sm">{p.price?.toLocaleString()}₫</div>
                                    </div>
                                </div>
                                <button onClick={() => handleRemoveProduct(p.productId)} className="text-red-600 hover:text-red-800 px-2 py-1 rounded">
                                    ❌
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 bg-white border border-gray-200 rounded p-4 text-center">Chưa có sản phẩm nào.</div>
                )}
                {productSuccess && <div className="mt-4 text-green-600 text-sm text-center">{productSuccess}</div>}
                {productError && <div className="mt-4 text-red-600 text-sm text-center">{productError}</div>}
            </div>

            {showAddProductModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-pink-50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-blue-800">Thêm sản phẩm vào BST</h3>
                            <button onClick={() => setShowAddProductModal(false)} className="text-gray-500 hover:text-gray-700">✖</button>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1">
                            <input type="text" placeholder="Tìm kiếm sản phẩm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full mb-4 border border-blue-200 px-3 py-2 rounded-lg" />
                            {loadingAvailableProducts ? (
                                <div className="text-center">Đang tải sản phẩm...</div>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map(p => (
                                    <div key={p.productId} className="flex items-center justify-between gap-3 mb-2 p-2 hover:bg-blue-50 rounded">
                                        <div className="flex items-center gap-2">
                                            <img src={p.imageUrls?.[0] ? IMAGE_BASE_URL + p.imageUrls[0] : "/images/default-image.jpg"} className="w-10 h-10 object-cover rounded border" />
                                            <div>
                                                <div className="font-medium">{p.name}</div>
                                                <div className="text-sm text-gray-500">{p.price?.toLocaleString()}₫</div>
                                            </div>
                                        </div>
                                        <button onClick={() => handleAddProduct(p.productId)} disabled={addingProductId === p.productId} className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-3 py-1 rounded-full hover:from-blue-500 hover:to-pink-500 transition disabled:opacity-50">{addingProductId === p.productId ? "Đang thêm..." : "Thêm"}</button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50">
                            <button onClick={() => setShowAddProductModal(false)} className="w-full bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-medium hover:bg-blue-200">Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollectionDetail;
