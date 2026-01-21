import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import bookingService from '@/services/bookingService';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Booking } from '@/types/booking';
import './HomePage.css';

const HomePage: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await bookingService.getMyBookings({ page: 0, size: 5 });
                if (response.success) {
                    setBookings(response.data.content);
                }
            } catch (error) {
                console.error('Error loading bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="home-page">
            <header className="home-header">
                <div className="container">
                    <h1>Xin chào, {user?.fullName}! 👋</h1>
                    <p>Chào mừng đến với hệ thống đặt sân cầu lông</p>
                </div>
            </header>

            <div className="container">
                <div className="quick-actions">
                    <Link to="/courts">
                        <Card hoverable className="action-card">
                            <div className="action-icon">🏸</div>
                            <h3>Đặt Sân</h3>
                            <p>Tìm và đặt sân ngay</p>
                        </Card>
                    </Link>

                    <Link to="/bookings">
                        <Card hoverable className="action-card">
                            <div className="action-icon">📋</div>
                            <h3>Lịch Đặt</h3>
                            <p>Xem lịch đặt sân</p>
                        </Card>
                    </Link>

                    <Link to="/shop">
                        <Card hoverable className="action-card">
                            <div className="action-icon">🛒</div>
                            <h3>Cửa Hàng</h3>
                            <p>Mua dụng cụ cầu lông</p>
                        </Card>
                    </Link>

                    <Link to="/profile">
                        <Card hoverable className="action-card">
                            <div className="action-icon">👤</div>
                            <h3>Hồ Sơ</h3>
                            <p>Quản lý tài khoản</p>
                        </Card>
                    </Link>
                </div>

                <section className="recent-bookings">
                    <div className="section-header">
                        <h2>Đặt sân gần đây</h2>
                        <Link to="/bookings">
                            <Button>Xem tất cả →</Button>
                        </Link>
                    </div>

                    {bookings.length > 0 ? (
                        <div className="bookings-list">
                            {bookings.map((booking) => (
                                <Link key={booking.id} to={`/bookings/${booking.id}`}>
                                    <Card hoverable className="booking-card">
                                        <div className="booking-info">
                                            <h3>{booking.courtName}</h3>
                                            <p>{booking.courtAddress}</p>
                                            <p>
                                                {new Date(booking.bookingDate).toLocaleDateString('vi-VN')} •{' '}
                                                {booking.startTime} - {booking.endTime}
                                            </p>
                                        </div>
                                        <div className={`booking-status status-${booking.status.toLowerCase()}`}>
                                            {booking.status}
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <div className="empty-state">
                                <div className="empty-icon">🏸</div>
                                <h3>Chưa có lịch đặt sân</h3>
                                <p>Bắt đầu đặt sân ngay để chơi cầu lông!</p>
                                <Link to="/courts">
                                    <Button variant="primary">Đặt sân ngay</Button>
                                </Link>
                            </div>
                        </Card>
                    )}
                </section>
            </div>
        </div>
    );
};

export default HomePage;
