// Checkout Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import orderService from '@/services/orderService';
import Card from '@/components/UI/Card';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { items, totalAmount, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        recipientName: '',
        recipientPhone: '',
        shippingAddress: '',
        shippingProvince: '',
        shippingDistrict: '',
        shippingWard: '',
        note: '',
        paymentMethod: 'COD' as 'COD' | 'MOMO' | 'VNPAY' | 'ZALOPAY',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await orderService.createOrder(formData);
            alert('Đặt hàng thành công!');
            clearCart();
            navigate('/shop/orders');
        } catch (error: any) {
            alert(error.message || 'Đặt hàng thất bại');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        navigate('/shop');
        return null;
    }

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-2xl)' }}>
            <h1>Thanh toán</h1>

            <Card className="mt-lg">
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Họ tên người nhận"
                        value={formData.recipientName}
                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                        required
                        fullWidth
                    />
                    <Input
                        label="Số điện thoại"
                        value={formData.recipientPhone}
                        onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                        required
                        fullWidth
                    />
                    <Input
                        label="Địa chỉ"
                        value={formData.shippingAddress}
                        onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                        required
                        fullWidth
                    />
                    <Input
                        label="Tỉnh/Thành phố"
                        value={formData.shippingProvince}
                        onChange={(e) => setFormData({ ...formData, shippingProvince: e.target.value })}
                        required
                        fullWidth
                    />
                    <Input
                        label="Quận/Huyện"
                        value={formData.shippingDistrict}
                        onChange={(e) => setFormData({ ...formData, shippingDistrict: e.target.value })}
                        required
                        fullWidth
                    />
                    <Input
                        label="Phường/Xã"
                        value={formData.shippingWard}
                        onChange={(e) => setFormData({ ...formData, shippingWard: e.target.value })}
                        required
                        fullWidth
                    />
                    <Input
                        label="Ghi chú"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        fullWidth
                    />

                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        <h3>Tổng thanh toán: {totalAmount.toLocaleString('vi-VN')}đ</h3>
                    </div>

                    <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} className="mt-lg">
                        Đặt hàng
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Checkout;
