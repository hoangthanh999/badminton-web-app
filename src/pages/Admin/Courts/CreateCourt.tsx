// CreateCourt Page - FIX TEXT COLORS
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import courtService from '@/services/courtService';
import Card from '@/components/UI/Card';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';

const CreateCourt: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        pricePerHour: 0,
        numberOfCourts: 1,
        openTime: '06:00',
        closeTime: '22:00',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await courtService.createCourt(formData);
            alert('Tạo sân thành công');
            navigate('/admin/courts');
        } catch (error: any) {
            alert(error.message || 'Tạo sân thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', paddingTop: 'var(--spacing-2xl)' }}>
            <div className="container">
                <Button onClick={() => navigate('/admin/courts')} variant="outline" className="mb-lg">
                    ← Quay lại
                </Button>

                <h1 style={{ color: '#0F172A', marginBottom: 'var(--spacing-xl)' }}>Thêm sân mới</h1>

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
                        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                            Tạo sân
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default CreateCourt;
