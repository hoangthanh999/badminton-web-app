import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import bookingService from '@/services/bookingService';
import DataTable, { Column } from '@/components/Admin/Tables/DataTable';
import TablePagination from '@/components/Admin/Tables/TablePagination';
import StatusBadge from '@/components/UI/StatusBadge';
import Button from '@/components/UI/Button';

import BookingDetailsModal from './BookingDetailsModal';
import { Booking } from '@/types/booking';
import { Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/Admin/Modals/ConfirmDialog';
import FormInput from '@/components/Admin/Forms/FormInput';
import FormSelect from '@/components/Admin/Forms/FormSelect';

const BookingManagement: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Filters state
    const currentPage = parseInt(searchParams.get('page') || '0');
    const pageSize = parseInt(searchParams.get('size') || '10');
    const statusFilter = searchParams.get('status') || '';
    const [searchTerm, setSearchTerm] = useState('');

    // Modals state
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [actionPending, setActionPending] = useState(false);
    const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{ id: number, status: string } | null>(null);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingService.getAllBookings({
                page: currentPage,
                size: pageSize,
                // Backend needs to support these query params too
                // status: statusFilter || undefined 
            });

            if (data.success) {
                setBookings(data.data.content);
                setTotalItems(data.data.totalElements);
                setTotalPages(data.data.totalPages);
            }
        } catch (error) {
            console.error('Error loading bookings:', error);
            toast.error('Không thể tải danh sách đặt sân');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, [currentPage, pageSize, statusFilter]);

    const handlePageChange = (page: number) => {
        setSearchParams(prev => {
            prev.set('page', page.toString());
            return prev;
        });
    };

    const handlePageSizeChange = (size: number) => {
        setSearchParams(prev => {
            prev.set('size', size.toString());
            prev.set('page', '0'); // Reset to first page
            return prev;
        });
    };

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value;
        setSearchParams(prev => {
            if (status) prev.set('status', status);
            else prev.delete('status');
            prev.set('page', '0');
            return prev;
        });
    };

    const confirmStatusUpdate = (id: number, status: string) => {
        setPendingStatusUpdate({ id, status });
        setIsConfirmOpen(true);
    };

    const handleStatusUpdate = async () => {
        if (!pendingStatusUpdate) return;

        try {
            setActionPending(true);
            await bookingService.updateBookingStatus(pendingStatusUpdate.id, pendingStatusUpdate.status);
            toast.success('Cập nhật trạng thái thành công');
            loadBookings(); // Reload data
            setIsConfirmOpen(false);

            // Also update detail modal if open
            if (selectedBooking && selectedBooking.id === pendingStatusUpdate.id) {
                setSelectedBooking(prev => prev ? { ...prev, status: pendingStatusUpdate.status as any } : null);
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Cập nhật thất bại');
        } finally {
            setActionPending(false);
        }
    };

    const columns: Column<Booking>[] = [
        {
            key: 'id',
            label: 'ID',
            sortable: true,
            width: '80px',
            render: (id) => <span className="font-mono text-xs">#{id}</span>
        },
        {
            key: 'user',
            label: 'Khách hàng',
            render: (_, row) => (
                <div>
                    <div className="font-medium">{row.user?.fullName}</div>
                    <div className="text-xs text-gray-500">{row.user?.phone}</div>
                </div>
            )
        },
        {
            key: 'courtName',
            label: 'Sân',
            render: (_, row) => (
                <div>
                    <div className="font-medium">{row.courtName}</div>
                    <div className="text-xs text-gray-500">Sân số {row.courtNumber}</div>
                </div>
            )
        },
        {
            key: 'bookingDate',
            label: 'Thời gian',
            render: (_, row) => (
                <div>
                    <div>{new Date(row.bookingDate).toLocaleDateString('vi-VN')}</div>
                    <div className="text-xs text-gray-500 font-mono">
                        {row.startTime} - {row.endTime}
                    </div>
                </div>
            )
        },
        {
            key: 'totalPrice',
            label: 'Tổng tiền',
            render: (price) => (
                <span className="font-medium text-primary-600">
                    {price.toLocaleString('vi-VN')}đ
                </span>
            )
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (status) => <StatusBadge status={status} />
        },
        {
            key: 'actions',
            label: 'Thao tác',
            render: (_, row) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(row);
                            setIsDetailOpen(true);
                        }}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý đặt sân</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Quản lý tất cả lịch đặt sân trong hệ thống
                    </p>
                </div>
                {/* <Button variant="primary" onClick={() => {}}>
           + Tạo booking mới
        </Button> */}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <FormInput
                        placeholder="Tìm kiếm theo tên, SĐT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="w-full sm:w-48">
                    <FormSelect
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        options={[
                            { value: '', label: 'Tất cả trạng thái' },
                            { value: 'PENDING', label: 'Chờ xác nhận' },
                            { value: 'CONFIRMED', label: 'Đã xác nhận' },
                            { value: 'COMPLETED', label: 'Hoàn thành' },
                            { value: 'CANCELLED', label: 'Đã hủy' }
                        ]}
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="space-y-4">
                <DataTable
                    columns={columns}
                    data={bookings}
                    loading={loading}
                    onRowClick={(row) => {
                        setSelectedBooking(row);
                        setIsDetailOpen(true);
                    }}
                    emptyMessage="Chưa có lịch đặt sân nào."
                />

                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>

            {/* Detail Modal */}
            <BookingDetailsModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                booking={selectedBooking}
                onUpdateStatus={(id, status) => {
                    setIsDetailOpen(false); // Close detail modal first if needed, or keep it open
                    confirmStatusUpdate(id, status);
                }}
            />

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleStatusUpdate}
                loading={actionPending}
                title="Xác nhận thay đổi"
                message={`Bạn có chắc chắn muốn chuyển trạng thái booking #${pendingStatusUpdate?.id} thành ${pendingStatusUpdate?.status}?`}
                confirmText="Xác nhận"
                variant={pendingStatusUpdate?.status === 'CANCELLED' ? 'danger' : 'info'}
            />
        </div>
    );
};

export default BookingManagement;
