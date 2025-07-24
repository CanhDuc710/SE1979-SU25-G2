import { useState } from 'react';
import { changePassword } from '../../service/authService';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('jwtToken');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await changePassword(currentPassword, newPassword, token);
            alert('Đổi mật khẩu thành công');
            navigate('/profile');
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || err.message || 'Đổi mật khẩu thất bại';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Đổi mật khẩu</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Mật khẩu hiện tại</label>
                    <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
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
                    className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"
                >
                    {loading ? 'Đang lưu...' : 'Đổi mật khẩu'}
                </button>
            </form>
        </div>
    );
}
