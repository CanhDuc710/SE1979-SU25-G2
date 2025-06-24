import React, { useState, useEffect } from "react";

export default function EditDiscountModal({ isOpen, onClose, discount, onSave }) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (discount) setFormData(discount);
    }, [discount]);

    if (!isOpen) return null;

    const today = new Date().toISOString().split("T")[0];

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        let newValue = value;

        if (type === "number") {
            newValue = value === "" ? "" : parseFloat(value);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const validate = () => {
        const newErrors = {};
        const percent = parseFloat(formData.discountPercent);
        const min = parseFloat(formData.minOrderValue);
        const max = parseFloat(formData.maxDiscountAmount);
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const now = new Date(today);

        if (isNaN(percent) || percent < 0 || percent > 100) {
            newErrors.discountPercent = "Phần trăm giảm phải từ 0 đến 100";
        }

        if (isNaN(min)) {
            newErrors.minOrderValue = "Chỉ được nhập số";
        }

        if (isNaN(max)) {
            newErrors.maxDiscountAmount = "Chỉ được nhập số";
        }

        if (!formData.startDate || start < now.setHours(0, 0, 0, 0)) {
            newErrors.startDate = "Ngày bắt đầu phải từ hôm nay trở đi";
        }

        if (!formData.endDate || end < start) {
            newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSave(formData);
        }
    };

    const renderError = (field) =>
        errors[field] ? (
            <span className="text-red-500 text-xs mt-1">{errors[field]}</span>
        ) : null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[500px] shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Chỉnh sửa mã giảm giá</h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-700">Mã code</label>
                        <input name="code" value={formData.code || ''} onChange={handleChange}
                               className="border p-2 rounded bg-white"/>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-700">% Giảm</label>
                        <input
                            name="discountPercent"
                            type="number"
                            value={formData.discountPercent || ''}
                            onChange={handleChange}
                            className="border p-2 rounded bg-white"
                            min={0}
                            max={100}
                        />
                        {renderError("discountPercent")}
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-700">Giá trị tối đa</label>
                        <input
                            name="maxDiscountAmount"
                            type="number"
                            value={formData.maxDiscountAmount || ''}
                            onChange={handleChange}
                            className="border p-2 rounded bg-white"
                        />
                        {renderError("maxDiscountAmount")}
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-700">Giá trị đơn tối thiểu</label>
                        <input
                            name="minOrderValue"
                            type="number"
                            value={formData.minOrderValue || ''}
                            onChange={handleChange}
                            className="border p-2 rounded bg-white"
                        />
                        {renderError("minOrderValue")}
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-700">Ngày bắt đầu</label>
                        <input
                            name="startDate"
                            type="date"
                            value={formData.startDate || ''}
                            onChange={handleChange}
                            className="border p-2 rounded bg-white"
                            min={today}
                        />
                        {renderError("startDate")}
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-700">Ngày kết thúc</label>
                        <input
                            name="endDate"
                            type="date"
                            value={formData.endDate || ''}
                            onChange={handleChange}
                            className="border p-2 rounded bg-white"
                            min={formData.startDate || today}
                        />
                        {renderError("endDate")}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Trạng thái</label>
                        <select
                            name="isActive"
                            value={formData.isActive}
                            onChange={(e) => setFormData({...formData, isActive: e.target.value === "true"})}
                            className="w-full p-2 border rounded bg-white"
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>


                    <div className="col-span-2 flex flex-col">
                        <label className="mb-1 text-gray-700">Mô tả</label>
                        <input
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            className="border p-2 rounded bg-white"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-6 space-x-3 text-sm">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Hủy</button>
                    <button onClick={handleSubmit}
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}
