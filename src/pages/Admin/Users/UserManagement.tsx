import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import userService from '@/services/userService';
import DataTable, { Column } from '@/components/Admin/Tables/DataTable';
import TablePagination from '@/components/Admin/Tables/TablePagination';
import StatusBadge from '@/components/UI/StatusBadge';
import RoleBadge from '@/components/UI/RoleBadge';
import Button from '@/components/UI/Button';
import FormInput from '@/components/Admin/Forms/FormInput';
import FormSelect from '@/components/Admin/Forms/FormSelect';
import ConfirmDialog from '@/components/Admin/Modals/ConfirmDialog';
import UserDetailModal from '@/pages/Admin/Users/UserDetailModal';
import UserFormModal from '@/pages/Admin/Users/UserFormModal';
import { UserDetail } from '@/types/user';
import { Plus, Edit2, Trash2, Eye, Lock, Unlock } from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagement: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [users, setUsers] = useState<UserDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [statistics, setStatistics] = useState<any>(null);

    const currentPage = parseInt(searchParams.get('page') || '0');
    const pageSize = parseInt(searchParams.get('size') || '10');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserDetail | null>(null);

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers(currentPage, pageSize);

            if (data.success) {
                setUsers(data.data.content);
                setTotalItems(data.data.totalElements);
                setTotalPages(data.data.totalPages);
            }
        } catch (error) {
            console.error('Error loading users:', error);
            toast.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const loadStatistics = async () => {
        try {
            const data = await userService.getUserStatistics();
            if (data.success) {
                setStatistics(data.data);
            }
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    };

    useEffect(() => {
        loadUsers();
        loadStatistics();
    }, [currentPage, pageSize]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            setDeleting(true);
            await userService.deleteUser(deleteId);
            toast.success('Xóa người dùng thành công');
            loadUsers();
            setIsDeleteOpen(false);
        } catch (error) {
            toast.error('Xóa thất bại');
        } finally {
            setDeleting(false);
        }
    };

    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            await userService.toggleUserStatus(id, !currentStatus);
            toast.success('Cập nhật trạng thái thành công');
            loadUsers();
        } catch (error) {
            toast.error('Cập nhật thất bại');
        }
    };

    const handleCreate = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    const handleEdit = (user: UserDetail) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        loadUsers();
        loadStatistics();
    };

    const columns: Column<UserDetail>[] = [
        {
            key: 'avatar',
            label: 'Avatar',
            width: '80px',
            render: (_, row) => (
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    {row.avatar ? (
                        <img src={row.avatar} alt={row.fullName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <span className="text-primary-600 dark:text-primary-400 font-semibold">
                            {row.fullName.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'fullName',
            label: 'Họ tên',
            sortable: true,
            render: (name, row) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{name}</div>
                    <div className="text-xs text-gray-500">{row.email}</div>
                </div>
            ),
        },
        {
            key: 'phone',
            label: 'Điện thoại',
            render: (phone) => <span className="font-mono text-sm">{phone}</span>,
        },
        {
            key: 'role',
            label: 'Vai trò',
            render: (role) => <RoleBadge role={role} />,
        },
        {
            key: 'active',
            label: 'Trạng thái',
            render: (active) => (
                <StatusBadge status={active ? 'ACTIVE' : 'INACTIVE'} />
            ),
        },
        {
            key: 'totalBookings',
            label: 'Đặt sân',
            render: (count) => <span className="font-mono">{count || 0}</span>,
        },
        {
            key: 'totalOrders',
            label: 'Đơn hàng',
            render: (count) => <span className="font-mono">{count || 0}</span>,
        },
        {
            key: 'createdAt',
            label: 'Ngày tạo',
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            key: 'actions',
            label: 'Thao tác',
            width: '180px',
            render: (_, row) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(row);
                            setIsDetailOpen(true);
                        }}
                        title="Xem chi tiết"
                    >
                        <Eye className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(row);
                        }}
                        title="Chỉnh sửa"
                    >
                        <Edit2 className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(row.id, row.active);
                        }}
                        title={row.active ? 'Khóa' : 'Mở khóa'}
                    >
                        {row.active ? (
                            <Lock className="w-4 h-4 text-yellow-500" />
                        ) : (
                            <Unlock className="w-4 h-4 text-green-500" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(row.id);
                            setIsDeleteOpen(true);
                        }}
                        title="Xóa"
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Quản lý người dùng
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Quản lý tài khoản người dùng trong hệ thống
                    </p>
                </div>
                <Button variant="primary" onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm người dùng
                </Button>
            </div>

            {/* Statistics */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Tổng người dùng</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {statistics.totalUsers}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Đang hoạt động</div>
                        <div className="text-2xl font-bold text-green-600">
                            {statistics.activeUsers}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Khóa</div>
                        <div className="text-2xl font-bold text-red-600">
                            {statistics.inactiveUsers}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Mới tháng này</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {statistics.newUsersThisMonth}
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <FormInput
                        placeholder="Tìm kiếm người dùng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="w-full sm:w-48">
                    <FormSelect
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        options={[
                            { value: '', label: 'Tất cả vai trò' },
                            { value: 'USER', label: 'Người dùng' },
                            { value: 'OWNER', label: 'Chủ sân' },
                            { value: 'ADMIN', label: 'Quản trị viên' },
                        ]}
                    />
                </div>
                <div className="w-full sm:w-48">
                    <FormSelect
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={[
                            { value: '', label: 'Tất cả trạng thái' },
                            { value: 'active', label: 'Hoạt động' },
                            { value: 'inactive', label: 'Khóa' },
                        ]}
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="space-y-4">
                <DataTable
                    columns={columns}
                    data={users}
                    loading={loading}
                    onRowClick={(row) => {
                        setSelectedUser(row);
                        setIsDetailOpen(true);
                    }}
                    emptyMessage="Chưa có người dùng nào."
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
            <UserDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                user={selectedUser}
                onRefresh={loadUsers}
            />

            {/* Form Modal */}
            <UserFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                user={editingUser}
                onSuccess={handleFormSuccess}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Xóa người dùng"
                message="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
                confirmText="Xóa"
                variant="danger"
            />
        </div>
    );
};

export default UserManagement;
