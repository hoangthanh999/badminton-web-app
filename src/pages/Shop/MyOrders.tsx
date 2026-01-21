// MyOrders Page
import React, { useEffect, useState } from 'react';
import orderService from '@/services/orderService';
import Card from '@/components/UI/Card';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Order } from '@/types/shop';

const MyOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const response = await orderService.getMyOrders();
                if (response.success) {
                    setOrders(response.data.content);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, []);

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div className="page-header">
            <header className="page-header">
                <div className="container">
                    <h1>Đơn hàng của tôi</h1>
                </div>
            </header>

            <div className="container">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <Card key={order.id} className="mb-lg">
                            <h3>Đơn hàng #{order.orderCode}</h3>
                            <p>Tổng tiền: {order.finalAmount.toLocaleString('vi-VN')}đ</p>
                            <p>Trạng thái: {order.orderStatus}</p>
                            <p>Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <div className="empty-state">
                            <h3>Chưa có đơn hàng nào</h3>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
