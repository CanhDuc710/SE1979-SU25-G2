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
        <div className="max-w-5xl mx-auto p-8">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700 drop-shadow">Collections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {collections.map((col) => (
                    <div key={col.id} className="bg-white rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition p-4 flex flex-col items-center">
                        <img
                            src={col.bannerUrl ? IMAGE_BASE_URL + col.bannerUrl : "/images/default-image.jpg"}
                            alt={col.name}
                            className="w-full h-40 object-cover rounded mb-4 border"
                        />
                        <div className="font-bold text-lg text-blue-800 mb-2">{col.name}</div>
                        <button
                            className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-6 py-2 rounded-full font-bold shadow hover:scale-105 hover:from-blue-500 hover:to-pink-500 transition-all duration-200"
                            onClick={() => navigate(`/admin/collections/${col.id}`)}
                        >
                            View / Edit
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CollectionList;