import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import courtService from '@/services/courtService';
import DataTable, { Column } from '@/components/Admin/Tables/DataTable';
import TablePagination from '@/components/Admin/Tables/TablePagination';
import StatusBadge from '@/components/UI/StatusBadge';
import Button from '@/components/UI/Button';
import FormInput from '@/components/Admin/Forms/FormInput';
import ConfirmDialog from '@/components/Admin/Modals/ConfirmDialog';
import { Court } from '@/types/court';
import { Edit2, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const CourtManagement: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const currentPage = parseInt(searchParams.get('page') || '0');
    const pageSize = parseInt(searchParams.get('size') || '10');
    const [searchTerm, setSearchTerm] = useState('');

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadCourts = async () => {
        try {
            setLoading(true);
            // Backend search API might differ, defaulting to getAll first
            const data = await courtService.getAllCourts({
                page: currentPage,
                size: pageSize,
            });

            if (data.success) {
                setCourts(data.data.content);
                setTotalItems(data.data.totalElements);
                setTotalPages(data.data.totalPages);
            }
        } catch (error) {
            console.error('Error loading courts:', error);
            toast.error('Không thể tải danh sách sân');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourts();
    }, [currentPage, pageSize]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            setDeleting(true);
            await courtService.deleteCourt(deleteId);
            toast.success('Xóa sân thành công');
            loadCourts();
            setIsDeleteOpen(false);
        } catch (error) {
            toast.error('Xóa thất bại');
        } finally {
            setDeleting(false);
        }
    };

    const columns: Column<Court>[] = [
        {
            key: 'image',
            label: 'Hình ảnh',
            width: '100px',
            render: (_, row) => (
                <div className="w-16 h-12 rounded overflow-hidden bg-gray-100">
                    {row.images && row.images.length > 0 ? (
                        <img src={row.images[0]} alt={row.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                    )}
                </div>
            )
        },
        {
            key: 'name',
            label: 'Tên sân',
            sortable: true,
            render: (name, row) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{name}</div>
                    <div className="text-xs text-gray-500">{row.address}</div>
                </div>
            )
        },
        {
            key: 'numberOfCourts',
            label: 'Số sân',
            width: '100px',
            render: (num) => <span className="font-mono">{num}</span>
        },
        {
            key: 'pricePerHour',
            label: 'Giá/Giờ',
            sortable: true,
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
            width: '120px',
            render: (_, row) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/courts/edit/${row.id}`);
                        }}
                    >
                        <Edit2 className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(row.id);
                            setIsDeleteOpen(true);
                        }}
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý sân cầu lông</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Quản lý danh sách sân, giá cả và tình trạng
                    </p>
                </div>
                <Button variant="primary" onClick={() => navigate('/admin/courts/create')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm sân mới
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <FormInput
                    placeholder="Tìm kiếm sân..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
            </div>

            <div className="space-y-4">
                <DataTable
                    columns={columns}
                    data={courts}
                    loading={loading}
                    onRowClick={(row) => navigate(`/admin/courts/edit/${row.id}`)}
                    emptyMessage="Chưa có sân nào được tạo."
                />

                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageChange={(page) => setSearchParams(prev => { prev.set('page', page.toString()); return prev; })}
                    onPageSizeChange={(size) => setSearchParams(prev => { prev.set('size', size.toString()); return prev; })}
                />
            </div>

            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Xóa sân cầu lông"
                message="Bạn có chắc chắn muốn xóa sân này? Hành động này không thể hoàn tác."
                confirmText="Xóa sân"
                variant="danger"
            />
        </div>
    );
};

export default CourtManagement;
