// src/admin/setting/BannerSetting.jsx
import React, { useState, useRef } from 'react';
import { FaTrashAlt, FaEdit, FaPlus } from 'react-icons/fa';

function BannerSetting() {
    const [banners, setBanners] = useState([]);
    const [displayBanner, setDisplayBanner] = useState(true);
    const [randomize, setRandomize] = useState(false);
    const [interval, setInterval] = useState(30);
    const fileInputRefs = useRef({});

    const handleFileChange = (e, replaceId = null) => {
        const files = Array.from(e.target.files);
        if (replaceId !== null && files[0]) {
            const newBanners = banners.map((b) =>
                b.id === replaceId
                    ? {
                        ...b,
                        file: files[0],
                        preview: URL.createObjectURL(files[0]),
                    }
                    : b
            );
            setBanners(newBanners);
        } else {
            const newBanners = files.map((file) => ({
                id: Date.now() + Math.random(),
                file,
                preview: URL.createObjectURL(file),
            }));
            setBanners((prev) => [...prev, ...newBanners]);
        }
    };

    const handleDelete = (id) => {
        setBanners((prev) => prev.filter((b) => b.id !== id));
    };

    const triggerReplace = (id) => {
        if (fileInputRefs.current[id]) {
            fileInputRefs.current[id].click();
        }
    };

    const handleSave = () => {
        // TODO: Gửi dữ liệu về server (upload ảnh + cấu hình)
        console.log('Banners:', banners);
        console.log('Hiển thị:', displayBanner);
        console.log('Ngẫu nhiên:', randomize);
        console.log('Thời gian:', interval);
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cài đặt Banner</h2>

            <div className="relative mb-4">
                <div className="flex space-x-4 overflow-x-scroll pb-4 max-w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                    {banners.map((banner, index) => (
                        <div key={banner.id} className="shrink-0">
                            <div className="text-center mb-1 font-medium text-sm text-gray-700">Banner {index + 1}</div>
                            <div className="relative w-40 h-28 border rounded-md">
                                <img
                                    src={banner.preview || banner.image_url}
                                    alt="banner"
                                    className="w-full h-full object-cover rounded"
                                />
                                <div className="absolute bottom-1 right-1 flex space-x-1">
                                    <button
                                        onClick={() => triggerReplace(banner.id)}
                                        className="bg-white text-blue-600 p-1 rounded hover:bg-blue-100"
                                    >
                                        <FaEdit size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(banner.id)}
                                        className="bg-white text-red-500 p-1 rounded hover:bg-red-100"
                                    >
                                        <FaTrashAlt size={14} />
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={(el) => (fileInputRefs.current[banner.id] = el)}
                                        onChange={(e) => handleFileChange(e, banner.id)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="shrink-0">
                        <div className="text-center mb-1 font-medium text-sm text-gray-700">Thêm banner</div>
                        <label className="w-40 h-28 flex items-center justify-center border-2 border-dashed rounded-md cursor-pointer text-gray-500">
                            <FaPlus size={20} />
                            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFileChange(e)} />
                        </label>
                    </div>
                </div>
                <div className="h-2 bg-gray-300 rounded-full mt-2 w-1/3 mx-auto">
                    <div className="h-full bg-gray-500 rounded-full w-full"></div>
                </div>

            </div>

            <div className="space-y-3">
                <div>
                    <label className="mr-2">Hiển thị banner</label>
                    <input type="checkbox" checked={displayBanner} onChange={() => setDisplayBanner(!displayBanner)} />
                </div>

                <div>
                    <label className="mr-2">Hiển thị banner ngẫu nhiên</label>
                    <input type="checkbox" checked={randomize} onChange={() => setRandomize(!randomize)} />
                </div>

                <div>
                    <label className="mr-2">Thời gian chuyển banner</label>
                    <select
                        value={interval}
                        onChange={(e) => setInterval(Number(e.target.value))}
                        className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value={10}>10 giây</option>
                        <option value={20}>20 giây</option>
                        <option value={30} className="bg-blue-100 font-bold">30 giây</option>
                        <option value={60}>60 giây</option>
                    </select>
                </div>
            </div>

            <button
                onClick={handleSave}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
                Lưu
            </button>
        </div>
    );
}

export default BannerSetting;
