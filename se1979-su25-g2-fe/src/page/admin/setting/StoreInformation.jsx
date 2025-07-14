import React, { useState } from 'react';

const StoreInformation = () => {
    const [formData, setFormData] = useState({
        storeName: 'WE',
        email: 'weshopclothest@gmail.com',
        fanpage: 'https://www.facebook.com/canhdz710',
        phone: '0123456789',
        address: 'Số 1 đường ABC phố XYZ',
        description: 'Shop quần áo thời trang uy tín nhất Hà Nội. Nguồn hàng từ các thương hiệu nổi tiếng ,....',
        logo: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'logo') {
            setFormData({ ...formData, logo: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gửi formData đến backend sau
        console.log('Form submitted:', formData);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Cài đặt &gt; Cài đặt thông tin</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <label className="block font-medium">Tên cửa hàng</label>
                        <input
                            type="text"
                            name="storeName"
                            value={formData.storeName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Fanpage</label>
                        <input
                            type="url"
                            name="fanpage"
                            value={formData.fanpage}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Địa chỉ</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Mô tả</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 min-h-[80px]"
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 border border-gray-300 rounded overflow-hidden flex items-center justify-center bg-gray-50">
                        {formData.logo ? (
                            <img
                                src={URL.createObjectURL(formData.logo)}
                                alt="Logo preview"
                                className="object-contain w-full h-full"
                            />
                        ) : (
                            <span className="text-gray-400">Logo</span>
                        )}
                    </div>
                    <label htmlFor="logo-upload" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 inline-block">
                        Chọn ảnh mới
                    </label>
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
