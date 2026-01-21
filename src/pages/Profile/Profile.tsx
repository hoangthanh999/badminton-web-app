// Profile Page - FIX TEXT COLORS
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import userService from '@/services/userService';
import Card from '@/components/UI/Card';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';

const Profile: React.FC = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert('Mật khẩu mới không khớp');
            return;
        }

        setLoading(true);
        try {
            await userService.changePassword({
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword,
            });
            alert('Đổi mật khẩu thành công');
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            alert(error.message || 'Đổi mật khẩu thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
            {/* ✅ FIX: Header gradient */}
            <header style={{
                background: 'linear-gradient(135deg, #00D563 0%, #0EA5E9 100%)',
                color: 'white',
                padding: '1.25rem 0',
                marginBottom: 'var(--spacing-xl)',
            }}>
                <div className="container">
                    <h1 style={{ color: 'white', marginBottom: 0 }}>Hồ sơ cá nhân</h1>
                </div>
            </header>

            <div className="container">
                {/* ✅ FIX: Text đen trong Card */}
                <Card className="mb-lg">
                    <h2 style={{ color: '#0F172A', marginBottom: '1rem' }}>Thông tin tài khoản</h2>
                    <p style={{ color: '#64748B', margin: '0.5rem 0' }}>
                        <strong style={{ color: '#0F172A' }}>Họ tên:</strong> {user?.fullName}
                    </p>
                    <p style={{ color: '#64748B', margin: '0.5rem 0' }}>
                        <strong style={{ color: '#0F172A' }}>Email:</strong> {user?.email}
                    </p>
                    <p style={{ color: '#64748B', margin: '0.5rem 0' }}>
                        <strong style={{ color: '#0F172A' }}>Điện thoại:</strong> {user?.phone}
                    </p>
                    <p style={{ color: '#64748B', margin: '0.5rem 0' }}>
                        <strong style={{ color: '#0F172A' }}>Vai trò:</strong> {user?.role}
                    </p>

                    {isAdmin && (
                        <Button variant="primary" fullWidth className="mt-lg" onClick={() => navigate('/admin')}>
                            Vào trang quản trị
                        </Button>
                    )}
                </Card>

                <Card className="mb-lg">
                    <h2 style={{ color: '#0F172A', marginBottom: '1rem' }}>Đổi mật khẩu</h2>
                    <form onSubmit={handleChangePassword}>
                        <Input
                            label="Mật khẩu cũ"
                            type="password"
                            value={passwords.oldPassword}
                            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                            required
                            fullWidth
                        />
                        <Input
                            label="Mật khẩu mới"
                            type="password"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            required
                            fullWidth
                        />
                        <Input
                            label="Xác nhận mật khẩu mới"
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            required
                            fullWidth
                        />
                        <Button type="submit" variant="primary" fullWidth loading={loading}>
                            Đổi mật khẩu
                        </Button>
                    </form>
                </Card>

                <Button variant="danger" fullWidth onClick={handleLogout}>
                    Đăng xuất
                </Button>
            </div>
        </div>
    );
};

export default Profile;
