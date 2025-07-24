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
    const [productSuccess, setProductSuccess] = useState(null);
    const [productError, setProductError] = useState(null);
    const [products, setProducts] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [loadingAvailableProducts, setLoadingAvailableProducts] = useState(false);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [addingProductId, setAddingProductId] = useState(null);
    const fileInputRef = useRef();

    // Main effect to fetch collection data
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
                console.log('Collection has productIds:', res.data.productIds ? `Yes, ${res.data.productIds.length} products` : 'No products');
                setCollection(res.data);
                // Fetch product details for each productId
                if (res.data && res.data.productIds && res.data.productIds.length > 0) {
                    try {
                        const productDetails = await Promise.all(
                            res.data.productIds.map(pid =>
                                axios.get(`${API_BASE_URL}/products/${pid}`)
                                    .then(r => r.data)
                                    .catch(e => {
                                        console.error(`Error fetching product ${pid}:`, e);
                                        return null;
                                    })
                            )
                        );
                        // Filter out any null values from failed requests
                        setProducts(productDetails.filter(p => p !== null));
                    } catch (err) {
                        console.error("Error fetching product details:", err);
                        setProducts([]);
                    }
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

    // Load available products when modal is opened
    useEffect(() => {
        if (showAddProductModal) {
            const fetchAvailableProducts = async () => {
                setLoadingAvailableProducts(true);
                try {
                    // The products endpoint returns a paginated response
                    const res = await axios.get(`${API_BASE_URL}/products`, {
                        params: {
                            page: 0,
                            size: 50 // Fetch up to 50 products
                        }
                    });

                    console.log("Products API response structure:", {
                        hasContent: !!res.data.content,
                        contentType: res.data.content ? typeof res.data.content : 'N/A',
                        isArray: res.data.content ? Array.isArray(res.data.content) : 'N/A',
                        contentLength: res.data.content ? res.data.content.length : 'N/A',
                        fullData: res.data
                    });

                    // Extract the content array from the paginated response
                    let allProducts = [];

                    // Handle different response structures
                    if (res.data.content && Array.isArray(res.data.content)) {
                        // Standard Spring Data pagination response
                        allProducts = res.data.content;
                    } else if (Array.isArray(res.data)) {
                        // Direct array response
                        allProducts = res.data;
                    } else {
                        console.error("Unexpected API response format:", res.data);
                    }

                    console.log("All products count:", allProducts.length);

                    // Filter out products that are already in the collection
                    const currentProductIds = products.map(p => p.productId);
                    console.log("Current product IDs in collection:", currentProductIds);

                    const available = allProducts.filter(p => !currentProductIds.includes(p.productId));

                    console.log("Available products count:", available.length);
                    setAvailableProducts(available);
                } catch (err) {
                    console.error("Failed to load available products:", err);
                } finally {
                    setLoadingAvailableProducts(false);
                }
            };
            fetchAvailableProducts();
        }
    }, [showAddProductModal, products]);

    // Filter products based on search query
    const filteredProducts = searchQuery.trim() === ""
        ? availableProducts
        : availableProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );

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

    // Function to handle deleting a collection
    const handleDelete = async () => {
        if (!collection) return;
        if (window.confirm(`Are you sure you want to delete "${collection.name}"? This action cannot be undone.`)) {
            try {
                await axios.delete(`${API_BASE_URL}/collections/${id}`);
                navigate("/admin/collections");
            } catch (err) {
                setError("Failed to delete collection");
            }
        }
    };

    // Function to handle adding a product to the collection
    const handleAddProduct = async (productId) => {
        // Prevent multiple clicks
        if (addingProductId === productId) return;

        try {
            console.log("Adding product with ID:", productId);
            setAddingProductId(productId);

            // Clear any previous notifications
            setProductError(null);
            setProductSuccess(null);

            // Send the productId as a raw integer in the request body
            console.log("Request URL:", `${API_BASE_URL}/collections/${id}/products`);
            console.log("Request payload:", productId);
            console.log("Request payload type:", typeof productId);

            const res = await axios.post(`${API_BASE_URL}/collections/${id}/products`, productId, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Add product response:", res.data);
            console.log("Updated productIds in collection:", res.data.productIds);

            // Update the collection state
            setCollection(res.data);

            // Fetch the product details and add to products list
            const productRes = await axios.get(`${API_BASE_URL}/products/${productId}`);
            console.log("Product details:", productRes.data);
            setProducts(prev => [...prev, productRes.data]);

            // Remove from available products
            setAvailableProducts(prev => prev.filter(p => p.productId !== productId));

            // Show success notification
            setProductSuccess(`Product "${productRes.data.name}" added to collection successfully!`);
            setTimeout(() => setProductSuccess(null), 4000);

            // Close the modal after adding
            setShowAddProductModal(false);
        } catch (err) {
            console.error("Error adding product:", err);
            console.error("Error details:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });

            const errorMessage = err.response?.data?.message || err.response?.data || "Failed to add product to collection";
            setProductError(errorMessage);
            setTimeout(() => setProductError(null), 5000);
        } finally {
            setAddingProductId(null);
        }
    };

    // Function to handle removing a product from the collection
    const handleRemoveProduct = async (productId) => {
        if (window.confirm("Are you sure you want to remove this product from the collection?")) {
            // Clear previous notifications
            setProductError(null);
            setProductSuccess(null);

            try {
                // Find the product name before removing it
                const productToRemove = products.find(p => p.productId === productId);
                const productName = productToRemove ? productToRemove.name : "Product";

                const res = await axios.delete(`${API_BASE_URL}/collections/${id}/products/${productId}`);
                setCollection(res.data);

                // Remove from products list
                setProducts(prev => prev.filter(p => p.productId !== productId));

                // Show success notification
                setProductSuccess(`"${productName}" removed from collection successfully!`);
                setTimeout(() => setProductSuccess(null), 4000);
            } catch (err) {
                console.error("Error removing product:", err);
                const errorMessage = err.response?.data?.message || err.response?.data || "Failed to remove product from collection";
                setProductError(errorMessage);
                setTimeout(() => setProductError(null), 5000);
            }
        }
    };

    // Early returns after all hooks
    if (loading) return <div className="p-8">Loading...</div>;
    if (error && !collection) return <div className="p-8 text-red-500">{error}</div>;
    if (!collection) return <div className="p-8 text-gray-500">No collection data found for this ID.</div>;

    return (
        <div className="max-w-xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-yellow-50 to-pink-100 rounded-2xl shadow-lg border border-blue-200">
            <button className="mb-4 text-blue-600 hover:underline" onClick={() => navigate("/admin/collections")}>&larr; Back to Collections</button>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-blue-700 drop-shadow">Collection Detail</h2>
                <div className="flex gap-2">
                    <button
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full font-bold shadow hover:scale-105 hover:from-yellow-500 hover:to-orange-500 transition-all duration-200 text-sm"
                        onClick={() => navigate(`/admin/collections/${id}/edit`)}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-2 rounded-full font-bold shadow hover:scale-105 hover:from-red-500 hover:to-pink-600 transition-all duration-200 text-sm"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
            <div className="flex flex-col items-center mb-6">
                <img
                    src={bannerPreview || (collection.bannerUrl ? IMAGE_BASE_URL + collection.bannerUrl : "/images/default-image.jpg")}
                    alt={collection.name}
                    className="w-full max-w-md h-48 object-cover rounded border mb-4"
                />
                <div className="font-bold text-lg text-blue-800 mb-2">{collection.name}</div>
                <div className="text-gray-700 mb-2 text-center">{collection.description}</div>
            </div>
            <form onSubmit={handleBannerUpload} className="space-y-4">
                <div>
                    <label className="block font-semibold mb-1 text-blue-800">Upload New Banner</label>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 bg-white" accept="image/*" />
                </div>
                <button type="submit" className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-8 py-2 rounded-full font-bold shadow hover:scale-105 hover:from-blue-500 hover:to-pink-500 transition-all duration-200">Update Banner</button>
                {success && <div className="text-green-600 mt-2 text-center animate-pulse">{success}</div>}
                {error && <div className="text-red-600 mt-2 text-center animate-pulse">{error}</div>}
            </form>

            {/* Product Success Notification */}
            {productSuccess && (
                <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md animate-pulse">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{productSuccess}</span>
                    </div>
                </div>
            )}

            {/* Product Error Notification */}
            {productError && (
                <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md animate-pulse">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{productError}</span>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <div className="font-semibold text-blue-800">Products in this Collection:</div>
                    <button
                        onClick={() => setShowAddProductModal(true)}
                        className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-full font-bold shadow hover:scale-105 hover:from-green-500 hover:to-blue-500 transition-all duration-200 text-sm"
                    >
                        + Add Product
                    </button>
                </div>

                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products.map((item) => (
                            <div
                                key={item.productId}
                                className="flex items-center justify-between gap-4 bg-white rounded-lg shadow p-3 hover:shadow-lg transition"
                            >
                                <div
                                    className="flex items-center gap-4 cursor-pointer flex-1"
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
                                <button
                                    onClick={() => handleRemoveProduct(item.productId)}
                                    className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition"
                                    title="Remove from collection"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 bg-white p-6 rounded-lg text-center border border-gray-200">
                        No products in this collection. Click "Add Product" to add products.
                    </div>
                )}

                {/* Add Product Modal */}
                {showAddProductModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-pink-50">
                                <h3 className="text-xl font-bold text-blue-800">Add Products to Collection</h3>
                                <button
                                    onClick={() => setShowAddProductModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-4 flex-1 overflow-y-auto">
                                {loadingAvailableProducts ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                        <div>Loading products...</div>
                                    </div>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 mb-4"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />

                                        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map(product => (
                                                    <div
                                                        key={product.productId}
                                                        className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded border border-gray-100 mb-2"
                                                    >
                                                        <img
                                                            src={product.imageUrls?.[0] ? `${IMAGE_BASE_URL}${product.imageUrls[0]}` : "/images/default-image.jpg"}
                                                            alt={product.name}
                                                            className="w-12 h-12 object-cover rounded border"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="font-medium text-blue-700">{product.name}</div>
                                                            <div className="text-gray-600 text-sm">{product.price?.toLocaleString()}₫</div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleAddProduct(product.productId)}
                                                            disabled={addingProductId === product.productId}
                                                            className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-3 py-1 rounded-full text-sm hover:from-blue-500 hover:to-pink-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {addingProductId === product.productId ? "Adding..." : "Add"}
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                    <p className="text-gray-500">No products found matching your search.</p>
                                                    <p className="text-gray-400 text-sm mt-1">Try a different search term or add new products.</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="p-4 border-t bg-gray-50">
                                <button
                                    onClick={() => setShowAddProductModal(false)}
                                    className="w-full bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionDetail;