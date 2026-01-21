// ProductDetail Page
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import productService from '@/services/productService';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { ProductDetail as ProductDetailType } from '@/types/shop';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<ProductDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                if (id) {
                    const response = await productService.getProductById(parseInt(id));
                    if (response.success) {
                        setProduct(response.data);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            productId: product.id,
            productName: product.name,
            productImage: product.images[0] || '',
            price: product.price,
            discountPrice: product.discountPrice,
            stock: product.stock,
            quantity,
        });

        alert('Đã thêm vào giỏ hàng');
        navigate('/shop/cart');
    };

    if (loading) return <LoadingSpinner fullScreen />;
    if (!product) return <div>Không tìm thấy sản phẩm</div>;

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-2xl)' }}>
            <Button onClick={() => navigate('/shop')} variant="outline" className="mb-lg">
                ← Quay lại
            </Button>

            <Card>
                {product.images && product.images[0] && (
                    <img src={product.images[0]} alt={product.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
                )}

                <h1 style={{ marginTop: 'var(--spacing-lg)' }}>{product.name}</h1>
                <p className="court-price-big">{product.price.toLocaleString('vi-VN')}đ</p>

                <p>{product.description}</p>
                <p><strong>Còn lại:</strong> {product.stock} sản phẩm</p>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', marginTop: 'var(--spacing-lg)' }}>
                    <label>Số lượng:</label>
                    <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        style={{ padding: 'var(--spacing-sm)', width: '80px' }}
                    />
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="mt-lg"
                >
                    {product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                </Button>
            </Card>
        </div>
    );
};

export default ProductDetail;
