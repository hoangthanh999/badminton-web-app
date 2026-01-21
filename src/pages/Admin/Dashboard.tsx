// Admin Dashboard - FIX TEXT COLORS
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import bookingService from '@/services/bookingService';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Booking } from '@/types/booking';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await bookingService.getAllBookings({ page: 0, size: 100 });
                if (response.success) {
                    const allBookings = response.data.content;
                    setBookings(allBookings.slice(0, 10));
                    setStats({
                        total: allBookings.length,
                        pending: allBookings.filter((b) => b.status === 'PENDING').length,
                        confirmed: allBookings.filter((b) => b.status === 'CONFIRMED').length,
                        completed: allBookings.filter((b) => b.status === 'COMPLETED').length,
                    });
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
            {/* ✅ FIX: Header gradient với text trắng */}
            <header style={{
                background: 'linear-gradient(135deg, #673AB7 0%, #512DA8 100%)',
                color: 'white', /* ✅ Chỉ header mới có chữ trắng */
                padding: '1.25rem 0',
                marginBottom: 'var(--spacing-2xl)',
            }}>
                <div className="container">
                    <h1 style={{ color: 'white', marginBottom: '0.25rem' }}>Admin Dashboard</h1>
                    <p style={{ color: 'white', opacity: 0.95, margin: 0 }}>Xin chào, {user?.fullName}</p>
                </div>
            </header>

            <div className="container">
                {/* ✅ Stats cards - CHỮ ĐEN */}
                <div className="quick-actions">
                    <Card onClick={() => navigate('/admin/bookings')} hoverable className="action-card">
                        <div className="action-icon">📋</div>
                        <h2 style={{ color: '#0F172A', margin: '0.5rem 0' }}>{stats.total}</h2>
                        <p style={{ color: '#64748B', margin: 0 }}>Tổng đặt sân</p>
                    </Card>
                    <Card onClick={() => navigate('/admin/bookings')} hoverable className="action-card">
                        <div className="action-icon">⏳</div>
                        <h2 style={{ color: '#0F172A', margin: '0.5rem 0' }}>{stats.pending}</h2>
                        <p style={{ color: '#64748B', margin: 0 }}>Chờ xác nhận</p>
                    </Card>
                    <Card onClick={() => navigate('/admin/courts')} hoverable className="action-card">
                        <div className="action-icon">🏸</div>
                        <h2 style={{ color: '#0F172A', margin: '0.5rem 0' }}>{stats.confirmed}</h2>
                        <p style={{ color: '#64748B', margin: 0 }}>Đã xác nhận</p>
                    </Card>
                    <Card hoverable className="action-card">
                        <div className="action-icon">✓</div>
                        <h2 style={{ color: '#0F172A', margin: '0.5rem 0' }}>{stats.completed}</h2>
                        <p style={{ color: '#64748B', margin: 0 }}>Hoàn thành</p>
                    </Card>
                </div>

                {/* ✅ Management buttons */}
                <Card className="mt-lg">
                    <div className="section-header">
                        <h2 style={{ color: '#0F172A' }}>Quản lý nhanh</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/admin/bookings')}>
                            Quản lý đặt sân
                        </Button>
                        <Button variant="secondary" size="lg" fullWidth onClick={() => navigate('/admin/courts')}>
                            Quản lý sân
                        </Button>
                        <Button variant="outline" size="lg" fullWidth onClick={() => navigate('/')}>
                            Về trang chủ
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
