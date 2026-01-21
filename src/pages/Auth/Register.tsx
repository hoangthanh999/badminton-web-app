import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Card from '@/components/UI/Card';
import './Login.css'; // Reuse login styles

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);

        try {
            await register({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content" style={{ maxWidth: '500px' }}>
                <div className="login-header">
                    <div className="login-icon">🏸</div>
                    <h1>Tạo tài khoản mới</h1>
                    <p>Đăng ký để bắt đầu đặt sân</p>
                </div>

                <Card className="login-card">
                    <form onSubmit={handleSubmit} className="login-form">
                        <Input
                            label="Họ và tên"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên"
                            required
                            fullWidth
                        />

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            required
                            fullWidth
                        />

                        <Input
                            label="Số điện thoại"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                            required
                            fullWidth
                        />

                        <Input
                            label="Mật khẩu"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                            required
                            fullWidth
                        />

                        <Input
                            label="Xác nhận mật khẩu"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu"
                            required
                            fullWidth
                        />

                        {error && <div className="login-error">{error}</div>}

                        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                            Đăng ký
                        </Button>

                        <div className="login-register">
                            Đã có tài khoản?{' '}
                            <Link to="/login" className="login-link login-link-primary">
                                Đăng nhập ngay
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Register;
