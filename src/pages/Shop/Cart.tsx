// Cart Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const { items, totalAmount, updateQuantity, removeFromCart, itemCount } = useCart();

    if (itemCount === 0) {
        return (
            <div className="container" style={{ paddingTop: 'var(--spacing-2xl)' }}>
                <Card>
                    <div className="empty-state">
                        <h3>Giỏ hàng trống</h3>
                        <Button onClick={() => navigate('/shop')} variant="primary">
                            Tiếp tục mua sắm
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="page-header">
            <header className="page-header">
                <div className="container">
                    <h1>Giỏ hàng ({itemCount} sản phẩm)</h1>
                </div>
            </header>

            <div className="container">
                {items.map((item) => (
                    <Card key={item.productId} className="mb-lg">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3>{item.productName}</h3>
                                <p>{(item.discountPrice || item.price).toLocaleString('vi-VN')}đ x {item.quantity}</p>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                                <input
                                    type="number"
                                    min="1"
                                    max={item.stock}
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                                    style={{ width: '60px', padding: 'var(--spacing-sm)' }}
                                />
                                <Button variant="danger" onClick={() => removeFromCart(item.productId)}>
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}

                <Card>
                    <h2>Tổng cộng: {totalAmount.toLocaleString('vi-VN')}đ</h2>
                    <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/shop/checkout')} className="mt-lg">
                        Thanh toán
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default Cart;
