// BookingDetail Page
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingService from '@/services/bookingService';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Booking } from '@/types/booking';

const BookingDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBooking = async () => {
            try {
                if (id) {
                    const response = await bookingService.getBookingById(parseInt(id));
                    if (response.success) {
                        setBooking(response.data);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        loadBooking();
    }, [id]);

    const handleCancel = async () => {
        if (!booking || !window.confirm('Bạn có chắc muốn hủy đặt sân?')) return;

        try {
            await bookingService.cancelBooking(booking.id);
            alert('Đã hủy đặt sân');
            navigate('/bookings');
        } catch (error: any) {
            alert(error.message || 'Hủy đặt sân thất bại');
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    if (!booking) {
        return (
            <div className="container">
                <Card>
                    <div className="empty-state">
                        <h3>Không tìm thấy thông tin đặt sân</h3>
                        <Button onClick={() => navigate('/bookings')}>Quay lại</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-2xl)' }}>
            <Button onClick={() => navigate('/bookings')} variant="outline" className="mb-lg">
                ← Quay lại
            </Button>

            <Card>
                <h1>Chi tiết đặt sân</h1>
                <div className={`booking-status status-${booking.status.toLowerCase()}`}>
                    {booking.status}
                </div>

                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <p><strong>Sân:</strong> {booking.courtName}</p>
                    <p><strong>Địa chỉ:</strong> {booking.courtAddress}</p>
                    <p><strong>Số sân:</strong> {booking.courtNumber}</p>
                    <p><strong>Ngày:</strong> {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Giờ:</strong> {booking.startTime} - {booking.endTime}</p>
                    <p><strong>Tổng tiền:</strong> {booking.totalPrice.toLocaleString('vi-VN')}đ</p>
                    {booking.notes && <p><strong>Ghi chú:</strong> {booking.notes}</p>}
                </div>

                {booking.status === 'PENDING' && (
                    <Button variant="danger" fullWidth onClick={handleCancel} className="mt-lg">
                        Hủy đặt sân
                    </Button>
                )}
            </Card>
        </div>
    );
};

export default BookingDetail;
