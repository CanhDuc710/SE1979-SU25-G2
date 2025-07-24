import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { sendOtp } from '../../service/authService';
import { forgotPasswordSchema } from '../../validation/authSchema.js';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(forgotPasswordSchema)
    });

    const onSubmit = async ({ email }) => {
        clearErrors();
        try {
            await sendOtp(email);
            alert('OTP đã được gửi tới email của bạn');
            navigate('/reset-otp', { state: { email } });
        } catch (err) {
            const status = err.response?.status;
            if (status === 404) {
                setError('email', {
                    type: 'server',
                    message: 'Email này chưa được đăng ký.'
                });
            } else {
                setError('root', {
                    type: 'server',
                    message: err.response?.data?.message || 'Gửi mã OTP thất bại. Vui lòng thử lại.'
                });
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Quên mật khẩu</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        className={`mt-1 block w-full border rounded p-2 ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                </div>

                {errors.root && (
                    <p className="text-red-500 text-center">{errors.root.message}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi mã OTP'}
                </button>
            </form>
        </div>
    );
}
