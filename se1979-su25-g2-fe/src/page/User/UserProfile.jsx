"use client"

import { useState } from "react"
import { User, Upload, Edit3 } from "lucide-react"

export default function UserProfile() {
    const [formData, setFormData] = useState({
        lastName: "Nguyen",
        firstName: "Van A",
        gender: "Male",
        birthDate: "01/01/1990",
        phone: "0123456789",
        city: "Ha Noi",
        address: "Thon 3, Thach That - Hoa Lac",
    })

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleUploadAvatar = () => {
        // Xử lý upload avatar
        console.log("Upload avatar")
    }

    const handleEditProfile = () => {
        // Xử lý chỉnh sửa profile
        console.log("Edit profile")
    }

    const handleChangePassword = () => {
        // Xử lý thay đổi mật khẩu
        console.log("Change password")
    }

    const handleChangeEmail = () => {
        // Xử lý thay đổi email
        console.log("Change email")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-blue-200 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-2xl font-medium text-gray-700 text-center">Xin chào, User1</h1>
                </div>
            </div>

            {/* Profile Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-300">
                                <User className="w-8 h-8 text-gray-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">User1</h2>
                                <p className="text-gray-600">User1@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleUploadAvatar}
                                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                <Upload className="w-4 h-4" />
                                <span>Tải lên avatar mới</span>
                            </button>
                            <button
                                onClick={handleEditProfile}
                                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                <Edit3 className="w-4 h-4" />
                                <span>Chỉnh sửa</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Họ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Họ</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nguyen"
                            />
                        </div>

                        {/* Tên */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Van A"
                            />
                        </div>

                        {/* Giới tính */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => handleInputChange("gender", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Ngày sinh */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                            <input
                                type="date"
                                value="1990-01-01"
                                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0123456789"
                            />
                        </div>

                        {/* Thành phố */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố</label>
                            <select
                                value={formData.city}
                                onChange={(e) => handleInputChange("city", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Ha Noi">Hà Nội</option>
                                <option value="Ho Chi Minh">Hồ Chí Minh</option>
                                <option value="Da Nang">Đà Nẵng</option>
                                <option value="Can Tho">Cần Thơ</option>
                                <option value="Hai Phong">Hải Phòng</option>
                            </select>
                        </div>

                        {/* Địa chỉ */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Thon 3, Thach That - Hoa Lac"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 mt-8">
                        <button
                            onClick={handleChangePassword}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                        >
                            Thay đổi mật khẩu
                        </button>
                        <button
                            onClick={handleChangeEmail}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                        >
                            Thay đổi email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
