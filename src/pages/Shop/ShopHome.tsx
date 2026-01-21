// ShopHome Page - Simple implementation
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '@/services/productService';
import Card from '@/components/UI/Card';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Product } from '@/types/shop';

const ShopHome: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await productService.getAllProducts();
                if (response.success) {
                    setProducts(response.data.content);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div className="page-header">
            <header className="page-header">
                <div className="container">
                    <h1>Cửa hàng dụng cụ cầu lông</h1>
                </div>
            </header>

            <div className="container">
                <div className="courts-grid">
                    {products.map((product) => (
                        <Link key={product.id} to={`/shop/products/${product.id}`}>
                            <Card hoverable className="court-card">
                                {product.images && product.images[0] && (
                                    <img src={product.images[0]} alt={product.name} className="court-image" />
                                )}
                                <div className="court-content">
                                    <h3>{product.name}</h3>
                                    <p className="court-price">{product.price.toLocaleString('vi-VN')}đ</p>
                                    {product.stock > 0 ? (
                                        <span style={{ color: 'var(--color-success)' }}>Còn hàng</span>
                                    ) : (
                                        <span style={{ color: 'var(--color-error)' }}>Hết hàng</span>
                                    )}
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShopHome;
