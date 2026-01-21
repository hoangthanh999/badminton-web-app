import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '@/services/authService';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Card from '@/components/UI/Card';
import './Login.css';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.forgotPassword({ email });
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-header">
                    <div className="login-icon">🔑</div>
                    <h1>Quên mật khẩu</h1>
                    <p>Nhập email để nhận liên kết đặt lại mật khẩu</p>
                </div>

                <Card className="login-card">
                    {success ? (
                        <div className="login-form">
                            <div style={{ textAlign: 'center', padding: 'var(--spacing-lg) 0' }}>
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>✅</div>
                                <h3>Email đã được gửi!</h3>
                                <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--spacing-md) 0' }}>
                                    Vui lòng kiểm tra email để đặt lại mật khẩu của bạn.
                                </p>
                            </div>
                            <Link to="/login">
                                <Button variant="primary" fullWidth>
                                    Quay lại đăng nhập
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="login-form">
                            <Input
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email của bạn"
                                required
                                fullWidth
                            />

                            {error && <div className="login-error">{error}</div>}

                            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                                Gửi yêu cầu
                            </Button>

                            <div className="login-register">
                                <Link to="/login" className="login-link">
                                    ← Quay lại đăng nhập
                                </Link>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
