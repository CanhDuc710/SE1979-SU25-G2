import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { changePasswordSchema } from '../../validation/authSchema.js';
import {changePassword} from "../../service/authService.js";

export default function ChangePassword() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(changePasswordSchema)
    });

    const onSubmit = async (data) => {
        clearErrors();
        try {
            await changePassword(data.currentPassword, data.newPassword);
            alert('Đổi mật khẩu thành công');
            navigate('/');
        } catch (err) {
            const status = err.response?.status;
            if (status === 401) {
                setError('currentPassword', {
                    type: 'server',
                    message: 'Mật khẩu hiện tại không đúng'
                });
            } else {
                setError('root', {
                    type: 'server',
                    message: err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.'
                });
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Đổi mật khẩu</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Mật khẩu hiện tại</label>
                    <input
                        type="password"
                        {...register('currentPassword')}
                        className={`mt-1 block w-full border rounded p-2 ${errors.currentPassword ? 'border-red-500' : ''}`}
                    />
                    {errors.currentPassword && (
                        <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Mật khẩu mới</label>
                    <input
                        type="password"
                        {...register('newPassword')}
                        className={`mt-1 block w-full border rounded p-2 ${errors.newPassword ? 'border-red-500' : ''}`}
                    />
                    {errors.newPassword && (
                        <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        {...register('confirmPassword')}
                        className={`mt-1 block w-full border rounded p-2 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                    )}
                </div>

                {errors.root && (
                    <p className="text-red-500 text-center">{errors.root.message}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Đang lưu...' : 'Đổi mật khẩu'}
                </button>
            </form>
        </div>
    );
}
