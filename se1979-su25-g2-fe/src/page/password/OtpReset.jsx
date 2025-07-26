import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPasswordWithOtp } from '../../service/authService';
import { otpResetSchema } from '../../validation/authSchema.js';

export default function OtpReset() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialEmail = location.state?.email || '';

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(otpResetSchema),
        defaultValues: { email: initialEmail, otp: '', newPassword: '', confirmPassword: '' }
    });

    const onSubmit = async ({ email, otp, newPassword }) => {
        clearErrors();
        try {
            await resetPasswordWithOtp(email, otp, newPassword);
            alert('Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.');
            navigate('/login');
        } catch (err) {
            const status = err.response?.status;
            if (status === 401) {
                setError('otp', {
                    type: 'server',
                    message: 'OTP không đúng hoặc đã hết hạn'
                });
            } else if (status === 404) {
                setError('email', {
                    type: 'server',
                    message: 'Email không tồn tại'
                });
            } else {
                setError('root', {
                    type: 'server',
                    message: err.response?.data?.message || 'Xác thực OTP thất bại. Vui lòng thử lại.'
                });
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Xác thực OTP & Đặt lại mật khẩu</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        disabled
                        className="mt-1 block w-full border rounded p-2 bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Mã OTP</label>
                    <input
                        type="text"
                        {...register('otp')}
                        className={`mt-1 block w-full border rounded p-2 ${errors.otp ? 'border-red-500' : ''}`}
                    />
                    {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Mật khẩu mới</label>
                    <input
                        type="password"
                        {...register('newPassword')}
                        className={`mt-1 block w-full border rounded p-2 ${errors.newPassword ? 'border-red-500' : ''}`}
                    />
                    {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        {...register('confirmPassword')}
                        className={`mt-1 block w-full border rounded p-2 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                </div>

                {errors.root && <p className="text-red-500 text-center">{errors.root.message}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Đang xác thực...' : 'Xác nhận'}
                </button>
            </form>
        </div>
    );
}
