import React, { useEffect, useState } from 'react';
import * as storeService from '../../../service/storeService.js';
import { storeInformation } from '../../../validation/storeInformation.js';

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

    const [errors, setErrors] = useState({});
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
            if (data.logo) setLogoPreview(data.logo);
        } catch (error) {
            console.error('Error fetching store data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStoreData();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setErrors((prev) => ({ ...prev, [name]: undefined }));

        if (name === 'logo' && files.length > 0) {
            const file = files[0];
            setStoreData((prev) => ({ ...prev, logo: file }));
            setLogoPreview(URL.createObjectURL(file));
        } else {
            setStoreData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate với Yup
        try {
            await storeInformation.validate(storeData, { abortEarly: false });
            setErrors({});
        } catch (validationError) {
            const validationErrors = {};
            validationError.inner.forEach((err) => {
                if (!validationErrors[err.path]) {
                    validationErrors[err.path] = err.message;
                }
            });
            setErrors(validationErrors);
            return;
        }

        try {
            let updatedStoreData = { ...storeData };

            // Nếu có file logo mới, upload trước
            if (storeData.logo && typeof storeData.logo === 'object') {
                const formData = new FormData();
                formData.append('logo', storeData.logo);

                try {
                    const uploadRes = await storeService.uploadStoreLogo(formData);
                    updatedStoreData.logo = uploadRes.logoUrl;
                } catch (uploadError) {
                    console.error('Error uploading logo:', uploadError);
                    alert(uploadError.message || 'Lỗi khi tải lên logo.');
                    return;
                }
            }

            const updateRes = await storeService.updateStoreInformation(updatedStoreData);
            alert(updateRes.message || 'Cập nhật thành công!');
            await fetchStoreData();
        } catch (error) {
            console.error('Error during store update:', error);
            alert(error.message || 'Cập nhật thông tin cửa hàng thất bại.');
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
                            type="text"
                            name="storeName"
                            value={storeData.storeName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.storeName && <p className="text-red-600 text-sm mt-1">{errors.storeName}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={storeData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Fanpage</label>
                        <input
                            type="url"
                            name="fanpage"
                            value={storeData.fanpage}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.fanpage && <p className="text-red-600 text-sm mt-1">{errors.fanpage}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={storeData.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Địa chỉ</label>
                        <input
                            type="text"
                            name="address"
                            value={storeData.address}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Mô tả</label>
                        <textarea
                            name="description"
                            value={storeData.description}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 min-h-[80px]"
                        />
                        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 border border-gray-300 rounded overflow-hidden flex items-center justify-center bg-gray-50">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo preview" className="object-contain w-full h-full" />
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
                            id="logo-upload"
                            type="file"
                            name="logo"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                        {errors.logo && <p className="text-red-600 text-sm mt-1">{errors.logo}</p>}
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
