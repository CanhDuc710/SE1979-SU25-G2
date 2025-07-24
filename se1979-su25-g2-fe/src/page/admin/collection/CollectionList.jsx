import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IMAGE_BASE_URL, API_BASE_URL } from "../../../utils/constants";

const CollectionList = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
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

    const handleDelete = async (collectionId, collectionName) => {
        if (window.confirm(`Are you sure you want to delete "${collectionName}"? This action cannot be undone.`)) {
            // Clear previous notifications
            setSuccess(null);
            setDeleteError(null);

            try {
                await axios.delete(`${API_BASE_URL}/collections/${collectionId}`);
                setCollections(collections.filter(col => col.id !== collectionId));
                setSuccess(`Collection "${collectionName}" deleted successfully!`);

                // Auto-hide success message after 3 seconds
                setTimeout(() => setSuccess(null), 3000);
            } catch (err) {
                console.error("Delete error:", err);
                setDeleteError(`Failed to delete collection "${collectionName}". Please try again.`);

                // Auto-hide error message after 5 seconds
                setTimeout(() => setDeleteError(null), 5000);
            }
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-blue-700 drop-shadow">Collections</h2>
                <button
                    className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-6 py-3 rounded-full font-bold shadow hover:scale-105 hover:from-green-500 hover:to-blue-500 transition-all duration-200"
                    onClick={() => navigate("/admin/collections/create")}
                >
                    + Create New Collection
                </button>
            </div>

            {/* Success Notification */}
            {success && (
                <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md animate-pulse">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{success}</span>
                    </div>
                </div>
            )}

            {/* Error Notification */}
            {deleteError && (
                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md animate-pulse">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{deleteError}</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {collections.map((col) => (
                    <div key={col.id} className="bg-white rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition p-4 flex flex-col items-center">
                        <img
                            src={col.bannerUrl ? IMAGE_BASE_URL + col.bannerUrl : "/images/default-image.jpg"}
                            alt={col.name}
                            className="w-full h-40 object-cover rounded mb-4 border"
                        />
                        <div className="font-bold text-lg text-blue-800 mb-2 text-center">{col.name}</div>
                        <div className="text-gray-600 text-sm mb-4 text-center line-clamp-2">{col.description}</div>

                        <div className="flex gap-2 w-full">
                            <button
                                className="flex-1 bg-gradient-to-r from-blue-400 to-pink-400 text-white px-6 py-2 rounded-full font-bold shadow hover:scale-105 hover:from-blue-500 hover:to-pink-500 transition-all duration-200"
                                onClick={() => navigate(`/admin/collections/${col.id}`)}
                            >
                                View / Edit
                            </button>
                            <button
                                className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-2 rounded-full font-bold shadow hover:scale-105 hover:from-red-500 hover:to-pink-600 transition-all duration-200 text-sm"
                                onClick={() => handleDelete(col.id, col.name)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CollectionList;