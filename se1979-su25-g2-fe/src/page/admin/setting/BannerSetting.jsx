import React, { useState, useRef, useEffect } from 'react';
import { FaTrashAlt, FaEdit, FaPlus } from 'react-icons/fa';
import {
    getActiveBanners,
    uploadBanner,
    deleteBanner as deleteBannerApi,
} from '../../../service/settingService';
import { API_BASE_URL } from '../../../utils/constants';

function BannerSetting() {
    const [banners, setBanners] = useState([]);
    // const [displayBanner, setDisplayBanner] = useState(true);
    const [randomize, setRandomize] = useState(false);
    const [interval, setInterval] = useState(30);
    const [canScroll, setCanScroll] = useState(false);
    const fileInputRefs = useRef({});
    const scrollRef = useRef(null);

    // Chuẩn hóa URL ảnh để đảm bảo có đầy đủ host
    const normalizeImageUrl = (url) => {
        return url.startsWith('/images') ? url : `/images/${url}`;
    };

    // Gọi API lấy danh sách banner khi load component
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await getActiveBanners();
                setBanners(data.map(b => ({ ...b, preview: normalizeImageUrl(b.imageUrl) })));
            } catch (err) {
                console.error('Lỗi khi tải banners:', err);
            }
        };
        fetchBanners();
    }, []);

    // Kiểm tra có cần hiện nút scroll không
    useEffect(() => {
        const checkScroll = () => {
            if (scrollRef.current) {
                const visibleItems = scrollRef.current.clientWidth / 160;
                setCanScroll(banners.length > visibleItems);
            }
        };
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [banners]);

    // Khi người dùng chọn file mới (thêm hoặc thay ảnh)
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
                id: undefined,
                file,
                preview: URL.createObjectURL(file),
            }));
            setBanners((prev) => [...prev, ...newBanners]);
        }
    };

    const handleDelete = async (id) => {
        if (id) {
            // Xóa ảnh đã lưu
            setBanners((prev) => prev.filter((b) => b.id !== id));
            try {
                await deleteBannerApi(id);
            } catch (err) {
                console.error("Lỗi khi xóa banner:", err);
            }
        } else {
            // Xóa toàn bộ ảnh chưa có id
            setBanners((prev) => prev.filter((b) => b.id !== undefined));
        }
    };


    // Trigger click vào input file khi người dùng nhấn nút sửa
    const triggerReplace = (id) => {
        if (fileInputRefs.current[id]) {
            fileInputRefs.current[id].click();
        }
    };

    // Scroll ngang danh sách banner
    const scrollContainer = (direction) => {
        const scrollAmount = 180;
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction * scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const handleSave = async () => {
        // Lấy tất cả ảnh có file mới cần upload (mới hoặc sửa)
        const bannersToUpload = banners.filter((b) => b.file);
        if (bannersToUpload.length === 0) {
            alert("Không có ảnh mới để upload.");
            return;
        }
        try {
            for (const banner of bannersToUpload) {
                const formData = new FormData();
                formData.append("file", banner.file);

                if (banner.id) {
                    formData.append("id", banner.id); // ảnh đã lưu thì có id để update
                }
                await uploadBanner(formData);
            }
            alert("Lưu banner thành công!");
            const updated = await getActiveBanners();
            setBanners(updated.map((b) => ({
                ...b,
                preview: b.imageUrl
            })));
        } catch (err) {
            console.error("Lỗi khi upload:", err);
            alert("Lưu thất bại.");
        }
    };



    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cài đặt Banner</h2>

            <div className="flex items-center space-x-4 mb-4">
                {canScroll && (
                    <button
                        onClick={() => scrollContainer(-1)}
                        className="bg-gray-200 hover:bg-gray-300 p-1 rounded-full"
                    >
                        ◀
                    </button>
                )}

                <div
                    className="flex space-x-4 overflow-hidden"
                    style={{ maxWidth: "calc(5 * 10rem + 4 * 1rem)" }}
                    ref={scrollRef}
                >
                    {banners.map((banner, index) => (
                        <div key={banner.id ? `id-${banner.id}` : `temp-${index}`} className="shrink-0 w-40">
                            <div className="text-center mb-1 font-medium text-sm text-gray-700">
                                Banner {index + 1}
                            </div>
                            <div className="relative w-40 h-28 border rounded-md">
                                <img
                                    src={banner.preview}
                                    alt="banner"
                                    className="w-full h-full object-cover rounded"
                                />
                                <div className="absolute bottom-1 right-1 flex space-x-1">
                                    {banner.id && (
                                        <button
                                            onClick={() => triggerReplace(banner.id)}
                                            className="bg-white text-blue-600 p-1 rounded hover:bg-blue-100"
                                        >
                                            <FaEdit size={14} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(banner.id)}
                                        className="bg-white text-red-500 p-1 rounded hover:bg-red-100"
                                    >
                                        <FaTrashAlt size={14} />
                                    </button>
                                    {banner.id && (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={(el) => (fileInputRefs.current[banner.id] = el)}
                                            onChange={(e) => handleFileChange(e, banner.id)}
                                        />
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {canScroll && (
                    <button
                        onClick={() => scrollContainer(1)}
                        className="bg-gray-200 hover:bg-gray-300 p-1 rounded-full"
                    >
                        ▶
                    </button>
                )}

                <div className="shrink-0 w-40">
                    <div className="text-center mb-1 font-medium text-sm text-gray-700">Thêm banner</div>
                    <label className="w-40 h-28 flex items-center justify-center border-2 border-dashed rounded-md cursor-pointer text-gray-500">
                        <FaPlus size={20} />
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e)}
                        />
                    </label>
                </div>
            </div>

            <div className="space-y-3">
                {/*<div>*/}
                {/*    <label className="mr-2">Hiển thị banner</label>*/}
                {/*    <input type="checkbox" checked={displayBanner} onChange={() => setDisplayBanner(!displayBanner)} />*/}
                {/*</div>*/}

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
                        <option value={30}>30 giây</option>
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
