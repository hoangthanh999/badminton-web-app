// Court List Page - Full implementation
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import courtService from '@/services/courtService';
import Card from '@/components/UI/Card';
import Input from '@/components/UI/Input';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Court } from '@/types/court';
import './Courts.css';

const CourtList: React.FC = () => {
    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadCourts = async () => {
            try {
                const response = await courtService.getAllCourts();
                if (response.success) {
                    setCourts(response.data.content);
                }
            } catch (error) {
                console.error('Error loading courts:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCourts();
    }, []);

    const filteredCourts = courts.filter((court) =>
        court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        court.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="courts-page">
            <header className="page-header">
                <div className="container">
                    <h1>Danh sách sân cầu lông</h1>
                    <p>Tìm và đặt sân phù hợp với bạn</p>
                </div>
            </header>

            <div className="container">
                <div className="search-section">
                    <Input
                        type="text"
                        placeholder="Tìm kiếm sân..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                    />
                </div>

                <div className="courts-grid">
                    {filteredCourts.map((court) => (
                        <Link key={court.id} to={`/courts/${court.id}`}>
                            <Card hoverable className="court-card">
                                {court.images && court.images[0] && (
                                    <img src={court.images[0]} alt={court.name} className="court-image" />
                                )}
                                <div className="court-content">
                                    <h3>{court.name}</h3>
                                    <p className="court-address">📍 {court.address}</p>
                                    <p className="court-price">{court.pricePerHour.toLocaleString('vi-VN')}đ/giờ</p>
                                    <div className="court-meta">
                                        <span>🏸 {court.numberOfCourts} sân</span>
                                        <span>⏰ {court.openTime} - {court.closeTime}</span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                {filteredCourts.length === 0 && (
                    <Card>
                        <div className="empty-state">
                            <h3>Không tìm thấy sân nào</h3>
                            <p>Thử tìm kiếm với từ khóa khác</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default CourtList;
