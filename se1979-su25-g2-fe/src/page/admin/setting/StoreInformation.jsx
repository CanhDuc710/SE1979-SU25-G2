import React, { useEffect, useState } from 'react';
import * as storeService from "../../../service/storeService.js";

const StoreInformation = () => {
    const [storeData, setStoreData] = useState({
        storeName: '',
        email: '',
        fanpage: '',
        phone: '',
        address: '',
        description: '',
        logo: '',
    });

    const [loading, setLoading] = useState(true);
    const [logoPreview, setLogoPreview] = useState('');

    const fetchStoreData = async () => {
        setLoading(true);
        try {
            const data = await storeService.getStoreInformation();
            setStoreData({
                storeName: data.storeName || '',
                email: data.email || '',
                fanpage: data.fanpage || '',
                phone: data.phone || '',
                address: data.address || '',
                description: data.description || '',
                logo: data.logo || '',
            });
            // Thiết lập logoPreview ban đầu nếu có logo từ backend
            if (data.logo) {
                setLogoPreview(data.logo);
            }
        } catch (error) {
            console.error("Error fetching store data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStoreData();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'logo' && files.length > 0) {
            const file = files[0];
            setStoreData({ ...storeData, logo: file })
            setLogoPreview(URL.createObjectURL(file));
        } else {
            setStoreData({ ...storeData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let updatedStoreData = { ...storeData };
            if (storeData.logo && typeof storeData.logo === 'object') {
                const formData = new FormData();
                formData.append('logo', storeData.logo);

                try {
                    const uploadRes = await storeService.uploadStoreLogo(formData);
                    updatedStoreData.logo = uploadRes.logoUrl;
                } catch (uploadError) {
                    console.error("Error uploading logo:", uploadError);
                    alert(uploadError.message || "Lỗi khi tải lên logo.");
                    return;
                }
            }

            const updateRes = await storeService.updateStoreInformation(updatedStoreData);
            alert(updateRes.message);
            await fetchStoreData(); // Tải lại dữ liệu mới nhất từ server
        } catch (error) {
            console.error("Error during store update:", error);
            alert(error.message || "Cập nhật thông tin cửa hàng thất bại.");
        }
    };


    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Cài đặt thông tin cửa hàng</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <label className="block font-medium">Tên cửa hàng</label>
                        <input
                            type="text" name="storeName"
                            value={storeData.storeName || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2" required
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Email</label>
                        <input
                            type="email" name="email"
                            value={storeData.email || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2" required
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Fanpage</label>
                        <input
                            type="url" name="fanpage"
                            value={storeData.fanpage || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Số điện thoại</label>
                        <input
                            type="text" name="phone"
                            value={storeData.phone || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Địa chỉ</label>
                        <input
                            type="text" name="address"
                            value={storeData.address || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Mô tả</label>
                        <textarea
                            name="description" value={storeData.description || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 min-h-[80px]"
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 border border-gray-300 rounded overflow-hidden flex items-center justify-center bg-gray-50">
                        {logoPreview ? (
                            <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="object-contain w-full h-full"
                            />
                        ) : (
                            <span className="text-gray-400">Logo</span>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="logo-upload"
                            className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 inline-block"
                        >
                            Chọn ảnh mới
                        </label>
                        <input
                            id="logo-upload" type="file" name="logo"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </div>
                </div>

                <div className="md:col-span-3 text-right">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Lưu
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StoreInformation;