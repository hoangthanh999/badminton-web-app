// CreateBooking Page
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courtService from '@/services/courtService';
import bookingService from '@/services/bookingService';
import Card from '@/components/UI/Card';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Court } from '@/types/court';

const CreateBooking: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [court, setCourt] = useState<Court | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        courtNumber: 1,
        bookingDate: '',
        startTime: '',
        endTime: '',
        notes: '',
    });

    useEffect(() => {
        const loadCourt = async () => {
            try {
                if (id) {
                    const response = await courtService.getCourtById(parseInt(id));
                    if (response.success) {
                        setCourt(response.data);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        loadCourt();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!court) return;

        setSubmitting(true);
        try {
            await bookingService.createBooking({
                courtId: court.id,
                ...formData,
            });
            alert('Đặt sân thành công!');
            navigate('/bookings');
        } catch (error: any) {
            alert(error.message || 'Đặt sân thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-2xl)' }}>
            <Button onClick={() => navigate(`/courts/${id}`)} variant="outline" className="mb-lg">
                ← Quay lại
            </Button>

            <h1>Đặt sân: {court?.name}</h1>

            <Card className="mt-lg">
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Số sân"
                        type="number"
                        min="1"
                        max={court?.numberOfCourts}
                        value={formData.courtNumber}
                        onChange={(e) => setFormData({ ...formData, courtNumber: parseInt(e.target.value) })}
                        required
                        fullWidth
                    />
                    <Input
                        label="Ngày đặt"
                        type="date"
                        value={formData.bookingDate}
                        onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                        required
                        fullWidth
                    />
                    <Input
                        label="Giờ bắt đầu"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        required
                        fullWidth
                    />
                    <Input
                        label="Giờ kết thúc"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        required
                        fullWidth
                    />
                    <Input
                        label="Ghi chú"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        fullWidth
                    />
                    <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting}>
                        Xác nhận đặt sân
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default CreateBooking;
