import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Modal from '@/components/Admin/Modals/Modal';
import Button from '@/components/UI/Button';
import StatusBadge from '@/components/UI/StatusBadge';
import { Booking } from '@/types/booking';
import { Calendar, Clock, MapPin, User, CreditCard, FileText } from 'lucide-react';

interface BookingDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking | null;
    onUpdateStatus: (id: number, status: string) => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
    isOpen,
    onClose,
    booking,
    onUpdateStatus,
}) => {
    if (!booking) return null;

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'EEEE, dd/MM/yyyy', { locale: vi });
        } catch {
            return dateString;
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Chi tiết đặt sân"
            size="lg"
        >
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            Booking #{booking.id}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Tạo lúc: {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                        </p>
                    </div>
                    <StatusBadge status={booking.status} className="text-sm px-3 py-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Court Info */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary-600" />
                            Thông tin sân
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
                            <p className="font-medium text-lg">{booking.courtName}</p>
                            <p className="text-gray-600 dark:text-gray-300">
                                Sân số: {booking.courtNumber}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {booking.courtAddress}
                            </p>
                        </div>
                    </div>

                    {/* Time Info */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary-600" />
                            Thời gian
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(booking.bookingDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400">
                                <Clock className="w-5 h-5" />
                                <span>
                                    {booking.startTime} - {booking.endTime}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-primary-600" />
                            Khách hàng
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
                            <p className="font-medium">{booking.user?.fullName || 'N/A'}</p>
                            <p className="text-gray-600 dark:text-gray-300">
                                {booking.user?.phone || 'N/A'}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {booking.user?.email || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary-600" />
                            Thanh toán
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300">Tổng tiền:</span>
                                <span className="text-lg font-bold text-primary-600">
                                    {booking.totalPrice.toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                            {booking.payment && (
                                <>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Đã cọc:</span>
                                        <span>{booking.payment.depositAmount.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Còn lại:</span>
                                        <span className="font-medium text-red-500">
                                            {booking.payment.remainingAmount.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                    <div className="mt-2 text-xs">
                                        <StatusBadge status={booking.payment.status} />
                                        <span className="ml-2 text-gray-500">
                                            {booking.payment.paymentType}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {booking.notes && (
                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary-600" />
                            Ghi chú
                        </h4>
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg text-yellow-800 dark:text-yellow-200 text-sm">
                            {booking.notes}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="secondary" onClick={onClose}>
                        Đóng
                    </Button>

                    {booking.status === 'PENDING' && (
                        <>
                            <Button
                                variant="danger"
                                onClick={() => onUpdateStatus(booking.id, 'CANCELLED')}
                            >
                                Hủy đặt sân
                            </Button>
                            <Button
                                variant="success"
                                onClick={() => onUpdateStatus(booking.id, 'CONFIRMED')}
                            >
                                Xác nhận
                            </Button>
                        </>
                    )}

                    {booking.status === 'CONFIRMED' && (
                        <Button
                            variant="primary"
                            onClick={() => onUpdateStatus(booking.id, 'COMPLETED')}
                        >
                            Hoàn thành
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default BookingDetailsModal;
