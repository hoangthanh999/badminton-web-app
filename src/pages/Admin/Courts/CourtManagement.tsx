// Admin CourtManagement - FIX TEXT COLORS
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import courtService from '@/services/courtService';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Court } from '@/types/court';

const CourtManagement: React.FC = () => {
    const navigate = useNavigate();
    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);

    const loadCourts = async () => {
        try {
            const response = await courtService.getAllCourts();
            if (response.success) {
                setCourts(response.data.content);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourts();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bạn có chắc muốn xóa sân này?')) return;

        try {
            await courtService.deleteCourt(id);
            alert('Xóa sân thành công');
            loadCourts();
        } catch (error: any) {
            alert(error.message || 'Xóa thất bại');
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
            {/* ✅ FIX: Header gradient */}
            <header style={{
                background: 'linear-gradient(135deg, #673AB7 0%, #512DA8 100%)',
                color: 'white',
                padding: '1.25rem 0',
                marginBottom: 'var(--spacing-xl)',
            }}>
                <div className="container">
                    <h1 style={{ color: 'white', marginBottom: 0 }}>Quản lý sân</h1>
                </div>
            </header>

            <div className="container">
                <Button variant="primary" size="lg" fullWidth className="mb-lg" onClick={() => navigate('/admin/courts/create')}>
                    + Thêm sân mới
                </Button>

                {courts.map((court) => (
                    <Card key={court.id} className="mb-lg">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                {/* ✅ FIX: Text đen */}
                                <h3 style={{ color: '#0F172A', marginBottom: '0.5rem' }}>{court.name}</h3>
                                <p style={{ color: '#64748B', margin: '0.25rem 0' }}>📍 {court.address}</p>
                                <p style={{ color: '#64748B', margin: '0.25rem 0' }}>
                                    💰 {court.pricePerHour.toLocaleString('vi-VN')}đ/giờ
                                </p>
                                <p style={{ color: '#64748B', margin: '0.25rem 0' }}>🏸 {court.numberOfCourts} sân</p>
                                <p style={{ color: '#64748B', margin: '0.25rem 0' }}>
                                    Trạng thái: <strong style={{ color: '#0F172A' }}>{court.status}</strong>
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                <Button variant="secondary" onClick={() => navigate(`/admin/courts/edit/${court.id}`)}>
                                    Sửa
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(court.id)}>
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CourtManagement;
