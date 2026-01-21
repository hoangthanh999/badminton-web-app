// Admin BookingManagement - FIX TEXT COLORS
import React, { useEffect, useState } from 'react';
import bookingService from '@/services/bookingService';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Booking } from '@/types/booking';

const BookingManagement: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const loadBookings = async () => {
        try {
            const response = await bookingService.getAllBookings();
            if (response.success) {
                setBookings(response.data.content);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const handleStatusChange = async (id: number, status: string) => {
        try {
            await bookingService.updateBookingStatus(id, status);
            alert('Cập nhật trạng thái thành công');
            loadBookings();
        } catch (error: any) {
            alert(error.message || 'Cập nhật thất bại');
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
            {/* ✅ FIX: Header gradient với text trắng */}
            <header style={{
                background: 'linear-gradient(135deg, #673AB7 0%, #512DA8 100%)',
                color: 'white',
                padding: '1.25rem 0',
                marginBottom: 'var(--spacing-xl)',
            }}>
                <div className="container">
                    <h1 style={{ color: 'white', marginBottom: 0 }}>Quản lý đặt sân</h1>
                </div>
            </header>

            <div className="container">
                {bookings.map((booking) => (
                    <Card key={booking.id} className="mb-lg">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                {/* ✅ FIX: Text đen trong Card */}
                                <h3 style={{ color: '#0F172A', marginBottom: '0.5rem' }}>{booking.courtName}</h3>
                                <p style={{ color: '#64748B', margin: '0.25rem 0' }}>Sân: {booking.courtNumber}</p>
                                <p style={{ color: '#64748B', margin: '0.25rem 0' }}>
                                    Khách hàng: {booking.user?.fullName} - {booking.user?.phone}
                                </p>
                                <p style={{ color: '#64748B', margin: '0.25rem 0' }}>
                                    {new Date(booking.bookingDate).toLocaleDateString('vi-VN')} • {booking.startTime} - {booking.endTime}
                                </p>
                                <p style={{ color: '#0F172A', margin: '0.25rem 0', fontWeight: 600 }}>
                                    Giá: {booking.totalPrice.toLocaleString('vi-VN')}đ
                                </p>
                                <p style={{ color: '#64748B', margin: '0.25rem 0' }}>
                                    Trạng thái: <strong style={{ color: '#0F172A' }}>{booking.status}</strong>
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {booking.status === 'PENDING' && (
                                    <>
                                        <Button variant="success" onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}>
                                            Xác nhận
                                        </Button>
                                        <Button variant="danger" onClick={() => handleStatusChange(booking.id, 'CANCELLED')}>
                                            Hủy
                                        </Button>
                                    </>
                                )}
                                {booking.status === 'CONFIRMED' && (
                                    <Button variant="primary" onClick={() => handleStatusChange(booking.id, 'COMPLETED')}>
                                        Hoàn thành
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BookingManagement;
