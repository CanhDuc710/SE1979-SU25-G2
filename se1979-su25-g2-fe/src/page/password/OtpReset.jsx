import { useState } from 'react';
import { resetPasswordWithOtp } from '../../service/authService';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OtpReset() {
    const { state } = useLocation();
    const email = state?.email || '';
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await resetPasswordWithOtp(email, otp, newPassword);
            alert('Đặt lại mật khẩu thành công, vui lòng đăng nhập lại.');
            navigate('/login');
        } catch (err) {
            const msg =
                typeof err.response?.data === 'string'
                    ? err.response.data
                    : err.response?.data?.message || err.message || 'Xác thực OTP thất bại';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Đặt lại mật khẩu</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Mã OTP</label>
                    <input
                        type="text"
                        required
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Mật khẩu mới</label>
                    <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    {loading ? 'Đang xác thực...' : 'Xác nhận'}
                </button>
            </form>
        </div>
    );
}

