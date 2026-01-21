import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Card from '@/components/UI/Card';
import './Login.css';

const Login: React.FC = () => {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(emailOrPhone, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-header">
                    <div className="login-icon">🏸</div>
                    <h1>Badminton Court</h1>
                    <p>Đăng nhập để tiếp tục</p>
                </div>

                <Card className="login-card">
                    <form onSubmit={handleSubmit} className="login-form">
                        <Input
                            label="Email hoặc Số điện thoại"
                            type="text"
                            value={emailOrPhone}
                            onChange={(e) => setEmailOrPhone(e.target.value)}
                            placeholder="Nhập email hoặc số điện thoại"
                            required
                            fullWidth
                            autoComplete="username"
                        />

                        <Input
                            label="Mật khẩu"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            required
                            fullWidth
                            autoComplete="current-password"
                        />

                        {error && <div className="login-error">{error}</div>}

                        <div className="login-forgot">
                            <Link to="/forgot-password" className="login-link">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                            Đăng nhập
                        </Button>

                        <div className="login-divider">
                            <span>HOẶC</span>
                        </div>

                        <div className="login-register">
                            Chưa có tài khoản?{' '}
                            <Link to="/register" className="login-link login-link-primary">
                                Đăng ký ngay
                            </Link>
                        </div>
                    </form>
                </Card>

                <div className="login-footer">
                    <p>© 2026 Badminton Court Management. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
