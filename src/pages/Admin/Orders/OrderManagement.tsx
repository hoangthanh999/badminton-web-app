import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import orderService from '@/services/orderService';
import DataTable, { Column } from '@/components/Admin/Tables/DataTable';
import TablePagination from '@/components/Admin/Tables/TablePagination';
import StatusBadge from '@/components/UI/StatusBadge';
import Button from '@/components/UI/Button';
import FormSelect from '@/components/Admin/Forms/FormSelect';
import OrderDetailModal from '@/pages/Admin/Orders/OrderDetailModal';
import { Order } from '@/types/shop';
import { Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderManagement: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [statistics, setStatistics] = useState<any>(null);

    const currentPage = parseInt(searchParams.get('page') || '0');
    const pageSize = parseInt(searchParams.get('size') || '10');
    const statusFilter = searchParams.get('status') || '';

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = statusFilter
                ? await orderService.getOrdersByStatus(statusFilter, currentPage, pageSize)
                : await orderService.getAllOrders(currentPage, pageSize);

            if (data.success) {
                console.log('📦 Orders data from backend:', data.data.content);
                setOrders(data.data.content);
                setTotalItems(data.data.totalElements);
                setTotalPages(data.data.totalPages);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            toast.error('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const loadStatistics = async () => {
        try {
            const data = await orderService.getOrderStatistics();
            if (data.success) {
                setStatistics(data.data);
            }
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    };

    useEffect(() => {
        loadOrders();
        loadStatistics();
    }, [currentPage, pageSize, statusFilter]);
    const STATUS_MAP: Record<string, string> = {
        'PENDING': 'Chờ xác nhận',
        'CONFIRMED': 'Đã xác nhận',
        'PROCESSING': 'Đang xử lý',
        'SHIPPING': 'Đang giao',
        'DELIVERED': 'Đã giao',
        'CANCELLED': 'Đã hủy',
        'RETURNED': 'Đã trả hàng',
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            // ✅ SỬA: Backend expect UpdateOrderStatusRequest
            await orderService.updateOrderStatus(id, {
                status: status,
                note: '' // Optional note
            });
            toast.success('Cập nhật trạng thái thành công');
            loadOrders();
            setIsDetailOpen(false);
        } catch (error: any) {
            console.error('❌ Update status error:', error);
            const errorMessage = error.response?.data?.message || 'Cập nhật thất bại';
            toast.error(errorMessage);
        }
    };

    const columns: Column<Order>[] = [
        {
            key: 'id',
            label: 'Mã đơn',
            width: '120px',
            render: (_, row) => (
                <span className="font-mono text-xs">
                    {row.orderNumber || row.orderCode || `#${row.id}`} {/* ✅ Handle all cases */}
                </span>
            ),
        },
        {
            key: 'recipientName',
            label: 'Khách hàng',
            render: (name, row) => (
                <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-xs text-gray-500">{row.recipientPhone}</div>
                </div>
            ),
        },
        {
            key: 'items',
            label: 'Sản phẩm',
            render: (items) => (
                <span className="text-sm text-gray-600">
                    {items?.length || 0} sản phẩm
                </span>
            ),
        },
        {
            key: 'totalAmount',
            label: 'Tổng tiền',
            render: (amount, row) => (
                <span className="font-medium text-primary-600">
                    {/* ✅ Handle both totalAmount and finalAmount */}
                    {(amount || row.finalAmount || 0).toLocaleString('vi-VN')}đ
                </span>
            ),
        },
        {
            key: 'paymentMethod',
            label: 'Thanh toán',
            render: (method) => (
                <span className="text-sm">
                    {method === 'COD' ? 'COD' : 'MoMo'}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (status, row) => (
                /* ✅ Handle both status and orderStatus */
                <StatusBadge status={status || row.orderStatus || 'PENDING'} />
            ),
        },
        {
            key: 'createdAt',
            label: 'Ngày tạo',
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            key: 'actions',
            label: 'Thao tác',
            width: '80px',
            render: (_, row) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(row);
                        setIsDetailOpen(true);
                    }}
                    title="Xem chi tiết"
                >
                    <Eye className="w-4 h-4" />
                </Button>
            ),
        },
    ];
    return (
        <div className="space-y-6">
            {/* Header & Statistics */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý đơn hàng</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Quản lý tất cả đơn hàng trong hệ thống
                </p>
            </div>

            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Tổng doanh thu</div>
                        <div className="text-2xl font-bold text-primary-600">
                            {statistics.totalRevenue?.toLocaleString('vi-VN')}đ
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Tổng đơn hàng</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {statistics.totalOrders}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Chờ xử lý</div>
                        <div className="text-2xl font-bold text-yellow-600">
                            {statistics.pendingOrders}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Hoàn thành</div>
                        <div className="text-2xl font-bold text-green-600">
                            {statistics.completedOrders}
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="w-full sm:w-64">
                    <FormSelect
                        value={statusFilter}
                        onChange={(e) => {
                            const status = e.target.value;
                            setSearchParams((prev) => {
                                if (status) prev.set('status', status);
                                else prev.delete('status');
                                prev.set('page', '0');
                                return prev;
                            });
                        }}
                        options={[
                            { value: '', label: 'Tất cả trạng thái' },
                            { value: 'PENDING', label: 'Chờ xác nhận' },
                            { value: 'CONFIRMED', label: 'Đã xác nhận' },
                            { value: 'SHIPPING', label: 'Đang giao' },
                            { value: 'DELIVERED', label: 'Đã giao' },
                            { value: 'CANCELLED', label: 'Đã hủy' },
                        ]}
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="space-y-4">
                <DataTable
                    columns={columns}
                    data={orders}
                    loading={loading}
                    onRowClick={(row) => {
                        setSelectedOrder(row);
                        setIsDetailOpen(true);
                    }}
                    emptyMessage="Chưa có đơn hàng nào."
                />

                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageChange={(page) =>
                        setSearchParams((prev) => {
                            prev.set('page', page.toString());
                            return prev;
                        })
                    }
                    onPageSizeChange={(size) =>
                        setSearchParams((prev) => {
                            prev.set('size', size.toString());
                            prev.set('page', '0');
                            return prev;
                        })
                    }
                />
            </div>

            {/* Detail Modal */}
            <OrderDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                order={selectedOrder}
                onUpdateStatus={handleStatusUpdate}
            />
        </div>
    );
};

export default OrderManagement;
