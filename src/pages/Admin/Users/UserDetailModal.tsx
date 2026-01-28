import React from 'react';
import Modal from '@/components/Admin/Modals/Modal';
import Button from '@/components/UI/Button';
import StatusBadge from '@/components/UI/StatusBadge';
import RoleBadge from '@/components/UI/RoleBadge';
import { UserDetail } from '@/types/user';
import { User, Mail, Phone, Calendar, ShoppingCart, MapPin } from 'lucide-react';

interface UserDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserDetail | null;
    onRefresh: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
    isOpen,
    onClose,
    user,
}) => {
    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Thông tin người dùng" size="lg">
            <div className="space-y-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.fullName} className="w-20 h-20 rounded-full object-cover" />
                        ) : (
                            <span className="text-3xl text-primary-600 dark:text-primary-400 font-bold">
                                {user.fullName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.fullName}</h3>
                        <div className="flex items-center gap-3 mt-2">
                            <RoleBadge role={user.role} />
                            <StatusBadge status={user.active ? 'ACTIVE' : 'INACTIVE'} />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-primary-600" />
                        Thông tin liên hệ
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700 dark:text-gray-200">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700 dark:text-gray-200">{user.phone}</span>
                        </div>
                        {user.address && (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700 dark:text-gray-200">{user.address}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Activity Statistics */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-primary-600" />
                        Hoạt động
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">{user.totalBookings || 0}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Lượt đặt sân</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">{user.totalOrders || 0}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Đơn hàng</div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {(user.totalSpent || 0).toLocaleString('vi-VN')}đ
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Tổng chi tiêu</div>
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-600" />
                        Thời gian
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Ngày tạo:</span>
                            <span className="font-medium">{new Date(user.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                        {user.lastLogin && (
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Đăng nhập cuối:</span>
                                <span className="font-medium">{new Date(user.lastLogin).toLocaleString('vi-VN')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="secondary" onClick={onClose}>
                        Đóng
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default UserDetailModal;
