import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IMAGE_BASE_URL, API_BASE_URL } from "../../../utils/constants";

const CollectionList = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const res = await axios.get(API_BASE_URL + "/collections");
                setCollections(res.data);
            } catch (err) {
                setError("Failed to load collections");
            } finally {
                setLoading(false);
            }
        };
        fetchCollections();
    }, []);

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Collection Management</h1>
                    <p className="text-gray-600">Manage and organize product collections</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {collections.map((col) => (
                    <div key={col.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6">
                        <div className="aspect-video mb-4 overflow-hidden rounded-lg bg-gray-100">
                            <img
                                src={col.bannerUrl ? `http://localhost:8080${col.bannerUrl}` : "/images/default-image.jpg"}
                                alt={col.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTIwQzEyMCAxMjAgMTIwIDYwIDE2MCA2MFMyMDAgMTIwIDE2MCAxMjBaIiBmaWxsPSIjRDFENUQ5Ii8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjkwIiByPSIxNSIgZmlsbD0iI0QxRDVEOSIvPgo8L3N2Zz4=';
                                }}
                            />
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg text-gray-900">{col.name}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{col.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    {col.productIds?.length || 0} products
                                </span>
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    onClick={() => navigate(`/admin/collections/${col.id}`)}
                                >
                                    Manage
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default CollectionList;
