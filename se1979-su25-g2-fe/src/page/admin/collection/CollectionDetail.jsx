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
                        res.data.productIds.map(pid => axios.get(`${API_BASE_URL}/products/${pid}`).then(r => r.data))
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
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center">
                    <button 
                        onClick={() => navigate('/admin/collections')}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Collections
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Collection Details</h1>
                        <p className="text-gray-600">Manage collection information and banner</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Collection Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Collection Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Name</label>
                                <p className="text-lg font-semibold text-gray-900">{collection.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Description</label>
                                <p className="text-gray-700">{collection.description}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Products</label>
                                <p className="text-gray-900">{collection.productIds?.length || 0} products</p>
                            </div>
                        </div>
                    </div>

                    {/* Banner Management */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Banner Image</h2>
                        <div className="aspect-video mb-4 overflow-hidden rounded-lg bg-gray-100">
                            <img
                                src={bannerPreview || (collection.bannerUrl ? `http://localhost:8080${collection.bannerUrl}` : "/images/default-image.jpg")}
                                alt={collection.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTIwQzEyMCAxMjAgMTIwIDYwIDE2MCA2MFMyMDAgMTIwIDE2MCAxMjBaIiBmaWxsPSIjRDFENUQ5Ii8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjkwIiByPSIxNSIgZmlsbD0iI0QxRDVEOSIvPgo8L3N2Zz4=';
                                }}
                            />
                        </div>
                        <form onSubmit={handleBannerUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Banner</label>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                    accept="image/*" 
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                disabled={!bannerFile}
                            >
                                Update Banner
                            </button>
                            {success && <div className="text-green-600 text-sm text-center">{success}</div>}
                            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                        </form>
                    </div>
                </div>
                {/* Products in Collection */}
                <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Products in Collection</h2>
                    {products && products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map((item) => (
                                <div
                                    key={item.productId}
                                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/admin/products/${item.productId}`)}
                                >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                            src={item.imageUrls?.[0] ? `http://localhost:8080${item.imageUrls[0]}` : "/images/default-image.jpg"}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiA0MkMyMCA0MiAyMCAyMiAzMiAyMlM0NCA0MiAzMiA0MloiIGZpbGw9IiNEMUQ1RDkiLz4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMCIgcj0iNCIgZmlsbD0iI0QxRDVEOSIvPgo8L3N2Zz4=';
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate hover:text-blue-600 transition-colors">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {item.price?.toLocaleString()}₫
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-gray-400 mb-2">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <p className="text-gray-500">No products in this collection yet</p>
                            <p className="text-sm text-gray-400 mt-1">Add products to showcase in this collection</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectionDetail;
