// frontend/src/pages/Admin/Orders/OrderDetailModal.tsx

import React from 'react';
import Modal from '@/components/Admin/Modals/Modal';
import Button from '@/components/UI/Button';
import StatusBadge from '@/components/UI/StatusBadge';
import { Order } from '@/types/shop';
import { Package, MapPin, CreditCard, User } from 'lucide-react';

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onUpdateStatus: (id: number, status: string) => void;
}
const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
    isOpen,
    onClose,
    order,
    onUpdateStatus,
}) => {
    if (!order) return null;

    // ✅ Helper to get order status
    const getOrderStatus = () => order.status || order.orderStatus || 'PENDING';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết đơn hàng" size="lg">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {/* ✅ Handle all order number variants */}
                            Đơn hàng {order.orderNumber || order.orderCode || `#${order.id}`}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Ngày tạo: {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </p>
                    </div>
                    <StatusBadge status={getOrderStatus()} className="text-sm px-3 py-1" />
                </div>

                {/* ... Customer and Shipping Info remain same ... */}

                {/* Order Items */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary-600" />
                        Sản phẩm ({order.items?.length || 0})
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg divide-y divide-gray-200 dark:divide-gray-600">
                        {order.items?.map((item) => (
                            <div key={item.id} className="p-4 flex gap-4">
                                {item.productImage && (
                                    <img
                                        src={item.productImage}
                                        alt={item.productName}
                                        className="w-16 h-16 object-cover rounded"
                                        onError={(e) => {
                                            e.currentTarget.src = '/placeholder-product.png';
                                        }}
                                    />
                                )}
                                <div className="flex-1">
                                    <div className="font-medium">{item.productName}</div>
                                    <div className="text-sm text-gray-500">
                                        {item.price.toLocaleString('vi-VN')}đ x {item.quantity}
                                    </div>
                                </div>
                                <div className="text-right font-medium text-primary-600">
                                    {/* ✅ Handle both subtotal and totalPrice */}
                                    {(item.subtotal || item.totalPrice || 0).toLocaleString('vi-VN')}đ
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary-600" />
                        Thanh toán
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Tạm tính:</span>
                            <span>{(order.subtotal || 0).toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Phí vận chuyển:</span>
                            <span>{order.shippingFee.toLocaleString('vi-VN')}đ</span>
                        </div>
                        {/* ✅ Check if discount exists and > 0 */}
                        {order.discount && order.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Giảm giá:</span>
                                <span>-{order.discount.toLocaleString('vi-VN')}đ</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                            <span className="font-semibold">Tổng cộng:</span>
                            <span className="text-lg font-bold text-primary-600">
                                {/* ✅ Handle both totalAmount and finalAmount */}
                                {(order.totalAmount || order.finalAmount || 0).toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                        <div className="pt-2 text-sm">
                            <span className="text-gray-500">Phương thức: </span>
                            <span className="font-medium">
                                {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'MoMo'}
                            </span>
                            {' '}
                            <StatusBadge status={order.paymentStatus} />
                        </div>
                    </div>
                </div>

                {order.note && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg">
                        <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                            Ghi chú:
                        </div>
                        <div className="text-sm text-yellow-700 dark:text-yellow-300">{order.note}</div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="secondary" onClick={onClose}>
                        Đóng
                    </Button>

                    {/* ✅ Use helper function for status checks */}
                    {getOrderStatus() === 'PENDING' && (
                        <>
                            <Button
                                variant="danger"
                                onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                            >
                                Hủy đơn
                            </Button>
                            <Button
                                variant="success"
                                onClick={() => onUpdateStatus(order.id, 'CONFIRMED')}
                            >
                                Xác nhận
                            </Button>
                        </>
                    )}

                    {getOrderStatus() === 'CONFIRMED' && (
                        <Button
                            variant="primary"
                            onClick={() => onUpdateStatus(order.id, 'PROCESSING')}
                        >
                            Bắt đầu xử lý
                        </Button>
                    )}

                    {getOrderStatus() === 'PROCESSING' && (
                        <Button
                            variant="primary"
                            onClick={() => onUpdateStatus(order.id, 'SHIPPING')}
                        >
                            Bắt đầu giao hàng
                        </Button>
                    )}

                    {getOrderStatus() === 'SHIPPING' && (
                        <Button
                            variant="success"
                            onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
                        >
                            Đã giao hàng
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default OrderDetailModal;