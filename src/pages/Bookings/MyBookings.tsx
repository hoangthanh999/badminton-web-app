// MyBookings Page
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import bookingService from '@/services/bookingService';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Booking } from '@/types/booking';

const MyBookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const response = await bookingService.getMyBookings();
                if (response.success) {
                    setBookings(response.data.content);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        loadBookings();
    }, []);

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div className="page-header">
            <header className="page-header">
                <div className="container">
                    <h1>Lịch đặt sân của tôi</h1>
                </div>
            </header>

            <div className="container">
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
                                        <p>Giá: {booking.totalPrice.toLocaleString('vi-VN')}đ</p>
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
                            <h3>Chưa có lịch đặt sân</h3>
                            <Link to="/courts">
                                <Button variant="primary">Đặt sân ngay</Button>
                            </Link>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
