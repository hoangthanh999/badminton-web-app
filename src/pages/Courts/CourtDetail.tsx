// Court Detail Page - Full implementation  
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courtService from '@/services/courtService';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Court } from '@/types/court';
import './Courts.css';

const CourtDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [court, setCourt] = useState<Court | null>(null);
    const [loading, setLoading] = useState(true);

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
                console.error('Error loading court:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCourt();
    }, [id]);

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    if (!court) {
        return (
            <div className="container">
                <Card>
                    <div className="empty-state">
                        <h3>Không tìm thấy thông tin sân</h3>
                        <Button onClick={() => navigate('/courts')}>Quay lại</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="court-detail-page">
            <div className="container">
                <Button onClick={() => navigate('/courts')} variant="outline" className="mb-lg">
                    ← Quay lại
                </Button>

                {court.images && court.images.length > 0 && (
                    <div className="court-images">
                        <img src={court.images[0]} alt={court.name} className="main-image" />
                    </div>
                )}

                <Card className="mt-lg">
                    <h1>{court.name}</h1>
                    <p className="court-address">📍 {court.address}</p>
                    <p className="court-price-big">{court.pricePerHour.toLocaleString('vi-VN')}đ/giờ</p>

                    <div className="court-info-grid">
                        <div className="info-item">
                            <strong>Số sân:</strong> {court.numberOfCourts}
                        </div>
                        <div className="info-item">
                            <strong>Giờ mở cửa:</strong> {court.openTime} - {court.closeTime}
                        </div>
                        <div className="info-item">
                            <strong>Trạng thái:</strong> {court.status}
                        </div>
                    </div>

                    <div className="description-section">
                        <h3>Mô tả</h3>
                        <p>{court.description}</p>
                    </div>

                    {court.facilities && court.facilities.length > 0 && (
                        <div className="facilities-section">
                            <h3>Tiện ích</h3>
                            <div className="facilities-list">
                                {court.facilities.map((facility, index) => (
                                    <span key={index} className="facility-tag">
                                        ✓ {facility}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={() => navigate(`/courts/${court.id}/book`)}
                    >
                        Đặt sân ngay
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default CourtDetail;
