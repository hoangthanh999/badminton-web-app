// EditCourt Page - FIX TEXT COLORS
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courtService from '@/services/courtService';
import Card from '@/components/UI/Card';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

const EditCourt: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        pricePerHour: 0,
        numberOfCourts: 1,
        openTime: '06:00',
        closeTime: '22:00',
    });

    useEffect(() => {
        const loadCourt = async () => {
            try {
                if (id) {
                    const response = await courtService.getCourtById(parseInt(id));
                    if (response.success) {
                        setFormData(response.data);
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
        if (!id) return;

        setSubmitting(true);
        try {
            await courtService.updateCourt(parseInt(id), formData);
            alert('Cập nhật sân thành công');
            navigate('/admin/courts');
        } catch (error: any) {
            alert(error.message || 'Cập nhật thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', paddingTop: 'var(--spacing-2xl)' }}>
            <div className="container">
                <Button onClick={() => navigate('/admin/courts')} variant="outline" className="mb-lg">
                    ← Quay lại
                </Button>

                <h1 style={{ color: '#0F172A', marginBottom: 'var(--spacing-xl)' }}>Sửa thông tin sân</h1>

                <Card>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Tên sân"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            fullWidth
                        />
                        <Input
                            label="Địa chỉ"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                            fullWidth
                        />
                        <Input
                            label="Mô tả"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            fullWidth
                        />
                        <Input
                            label="Giá/giờ (VNĐ)"
                            type="number"
                            value={formData.pricePerHour}
                            onChange={(e) => setFormData({ ...formData, pricePerHour: parseInt(e.target.value) })}
                            required
                            fullWidth
                        />
                        <Input
                            label="Số sân"
                            type="number"
                            min="1"
                            value={formData.numberOfCourts}
                            onChange={(e) => setFormData({ ...formData, numberOfCourts: parseInt(e.target.value) })}
                            required
                            fullWidth
                        />
                        <Input
                            label="Giờ mở cửa"
                            type="time"
                            value={formData.openTime}
                            onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                            required
                            fullWidth
                        />
                        <Input
                            label="Giờ đóng cửa"
                            type="time"
                            value={formData.closeTime}
                            onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                            required
                            fullWidth
                        />
                        <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting}>
                            Cập nhật
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default EditCourt;
