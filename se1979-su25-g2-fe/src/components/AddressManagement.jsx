import React, { useState, useEffect } from 'react';
import {
    getUserAddresses,
    createUserAddress,
    updateUserAddress,
    deleteUserAddress,
    setDefaultAddress,
    getProvinces,
    getDistricts,
    getWards
} from '../service/addressService';

export default function AddressManagement() {
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    // Form data
    const [formData, setFormData] = useState({
        recipientName: '',
        recipientPhone: '',
        addressLine: '',
        provinceId: '',
        districtId: '',
        wardId: '',
        postalCode: '',
        isDefault: false
    });

    // Address data
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        loadAddresses();
        loadProvinces();
    }, []);

    const loadAddresses = async () => {
        try {
            setLoading(true);
            const data = await getUserAddresses();
            setAddresses(data);
        } catch (error) {
            setError('Không thể tải danh sách địa chỉ');
            console.error('Error loading addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadProvinces = async () => {
        try {
            const data = await getProvinces();
            setProvinces(data);
        } catch (error) {
            console.error('Error loading provinces:', error);
        }
    };

    const handleProvinceChange = async (provinceId) => {
        setFormData(prev => ({
            ...prev,
            provinceId,
            districtId: '',
            wardId: ''
        }));

        setDistricts([]);
        setWards([]);

        if (provinceId) {
            try {
                const data = await getDistricts(parseInt(provinceId));
                setDistricts(data);
            } catch (error) {
                console.error('Error loading districts:', error);
            }
        }
    };

    const handleDistrictChange = async (districtId) => {
        setFormData(prev => ({
            ...prev,
            districtId,
            wardId: ''
        }));

        setWards([]);

        if (districtId) {
            try {
                const data = await getWards(parseInt(districtId));
                setWards(data);
            } catch (error) {
                console.error('Error loading wards:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            recipientName: '',
            recipientPhone: '',
            addressLine: '',
            provinceId: '',
            districtId: '',
            wardId: '',
            postalCode: '',
            isDefault: false
        });
        setDistricts([]);
        setWards([]);
        setEditingAddress(null);
    };

    const handleShowForm = () => {
        resetForm();
        setShowForm(true);
    };

    const handleEditAddress = async (address) => {
        setEditingAddress(address);
        setFormData({
            recipientName: address.recipientName || '',
            recipientPhone: address.recipientPhone || '',
            addressLine: address.addressLine || '',
            provinceId: address.provinceId?.toString() || '',
            districtId: address.districtId?.toString() || '',
            wardId: address.wardId?.toString() || '',
            postalCode: address.postalCode || '',
            isDefault: address.isDefault || false
        });

        // Load districts and wards for editing
        if (address.provinceId) {
            try {
                const districtsData = await getDistricts(address.provinceId);
                setDistricts(districtsData);

                if (address.districtId) {
                    const wardsData = await getWards(address.districtId);
                    setWards(wardsData);
                }
            } catch (error) {
                console.error('Error loading location data for editing:', error);
            }
        }

        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');

        try {
            const addressData = {
                ...formData,
                provinceId: parseInt(formData.provinceId),
                districtId: parseInt(formData.districtId),
                wardId: parseInt(formData.wardId)
            };

            if (editingAddress) {
                await updateUserAddress(editingAddress.addressId, addressData);
            } else {
                await createUserAddress(addressData);
            }

            await loadAddresses();
            setShowForm(false);
            resetForm();
        } catch (error) {
            setError(error.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (addressId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
            try {
                await deleteUserAddress(addressId);
                await loadAddresses();
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            await setDefaultAddress(addressId);
            await loadAddresses();
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Đang tải...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Quản lý địa chỉ</h3>
                <button
                    onClick={handleShowForm}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Thêm địa chỉ mới
                </button>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Address List */}
            <div className="space-y-4 mb-6">
                {addresses.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Chưa có địa chỉ nào</p>
                ) : (
                    addresses.map((address) => (
                        <div
                            key={address.addressId}
                            className={`border rounded-lg p-4 ${address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold">{address.recipientName}</span>
                                        <span className="text-gray-600">|</span>
                                        <span className="text-gray-600">{address.recipientPhone}</span>
                                        {address.isDefault && (
                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                Mặc định
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 mb-1">{address.addressLine}</p>
                                    <p className="text-gray-600 text-sm">
                                        {address.wardName}, {address.districtName}, {address.provinceName}
                                    </p>
                                    {address.postalCode && (
                                        <p className="text-gray-600 text-sm">Mã bưu điện: {address.postalCode}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditAddress(address)}
                                        className="text-blue-500 hover:text-blue-700 text-sm"
                                    >
                                        Chỉnh sửa
                                    </button>
                                    {!address.isDefault && (
                                        <>
                                            <button
                                                onClick={() => handleSetDefault(address.addressId)}
                                                className="text-green-500 hover:text-green-700 text-sm"
                                            >
                                                Đặt mặc định
                                            </button>
                                            <button
                                                onClick={() => handleDelete(address.addressId)}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Xóa
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Address Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold">
                                {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                            </h4>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên người nhận *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.recipientName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.recipientPhone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, recipientPhone: e.target.value }))}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Địa chỉ cụ thể *
                                </label>
                                <input
                                    type="text"
                                    value={formData.addressLine}
                                    onChange={(e) => setFormData(prev => ({ ...prev, addressLine: e.target.value }))}
                                    placeholder="Số nhà, tên đường..."
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tỉnh/Thành phố *
                                    </label>
                                    <select
                                        value={formData.provinceId}
                                        onChange={(e) => handleProvinceChange(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Chọn tỉnh/thành</option>
                                        {provinces.map((province) => (
                                            <option key={province.provinceId} value={province.provinceId}>
                                                {province.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quận/Huyện *
                                    </label>
                                    <select
                                        value={formData.districtId}
                                        onChange={(e) => handleDistrictChange(e.target.value)}
                                        required
                                        disabled={!formData.provinceId}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    >
                                        <option value="">Chọn quận/huyện</option>
                                        {districts.map((district) => (
                                            <option key={district.districtId} value={district.districtId}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phường/Xã *
                                    </label>
                                    <select
                                        value={formData.wardId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, wardId: e.target.value }))}
                                        required
                                        disabled={!formData.districtId}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    >
                                        <option value="">Chọn phường/xã</option>
                                        {wards.map((ward) => (
                                            <option key={ward.wardId} value={ward.wardId}>
                                                {ward.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mã bưu điện
                                </label>
                                <input
                                    type="text"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                                    className="mr-2"
                                />
                                <label htmlFor="isDefault" className="text-sm text-gray-700">
                                    Đặt làm địa chỉ mặc định
                                </label>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {formLoading ? 'Đang lưu...' : (editingAddress ? 'Cập nhật' : 'Thêm mới')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
