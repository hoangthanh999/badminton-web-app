import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import productService from '@/services/productService';
import DataTable, { Column } from '@/components/Admin/Tables/DataTable';
import TablePagination from '@/components/Admin/Tables/TablePagination';
import StatusBadge from '@/components/UI/StatusBadge';
import Button from '@/components/UI/Button';
import FormInput from '@/components/Admin/Forms/FormInput';
import FormSelect from '@/components/Admin/Forms/FormSelect';
import ConfirmDialog from '@/components/Admin/Modals/ConfirmDialog';
import { Product } from '@/types/shop';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductManagement: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const currentPage = parseInt(searchParams.get('page') || '0');
    const pageSize = parseInt(searchParams.get('size') || '10');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getAllProducts(
                currentPage,
                pageSize,
                'createdAt',
                'DESC'
            );

            if (data.success) {
                setProducts(data.data.content);
                setTotalItems(data.data.totalElements);
                setTotalPages(data.data.totalPages);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            toast.error('Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [currentPage, pageSize]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            setDeleting(true);
            await productService.deleteProduct(deleteId);
            toast.success('Xóa sản phẩm thành công');
            loadProducts();
            setIsDeleteOpen(false);
        } catch (error) {
            toast.error('Xóa thất bại');
        } finally {
            setDeleting(false);
        }
    };

    const handleStatusToggle = async (id: number, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            await productService.updateProductStatus(id, newStatus);
            toast.success('Cập nhật trạng thái thành công');
            loadProducts();
        } catch (error) {
            toast.error('Cập nhật thất bại');
        }
    };

    const columns: Column<Product>[] = [
        {
            key: 'image',
            label: 'Hình ảnh',
            width: '100px',
            render: (_, row) => (
                <div className="w-16 h-16 rounded overflow-hidden bg-gray-100">
                    {row.images && row.images.length > 0 ? (
                        <img src={row.images[0]} alt={row.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Img
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'name',
            label: 'Tên sản phẩm',
            sortable: true,
            render: (name, row) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{name}</div>
                    <div className="text-xs text-gray-500">{row.categoryName}</div>
                </div>
            ),
        },
        {
            key: 'price',
            label: 'Giá',
            sortable: true,
            render: (price, row) => (
                <div>
                    <div className="font-medium text-primary-600">
                        {(price || 0).toLocaleString('vi-VN')}đ
                    </div>
                    {row.discountPrice && (
                        <div className="text-xs text-gray-500 line-through">
                            {(row.discountPrice || 0).toLocaleString('vi-VN')}đ
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'stock',
            label: 'Tồn kho',
            render: (stock) => (
                <span
                    className={`font-mono ${stock < 10 ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'
                        }`}
                >
                    {stock}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (status) => <StatusBadge status={status} />,
        },
        {
            key: 'actions',
            label: 'Thao tác',
            width: '150px',
            render: (_, row) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/products/edit/${row.id}`);
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
                            handleStatusToggle(row.id, row.status);
                        }}
                        title="Bật/Tắt"
                    >
                        <Eye className={`w-4 h-4 ${row.status === 'ACTIVE' ? 'text-green-500' : 'text-gray-400'}`} />
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
                        Quản lý sản phẩm
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Quản lý danh sách sản phẩm, giá cả và tồn kho
                    </p>
                </div>
                <Button variant="primary" onClick={() => navigate('/admin/products/create')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm sản phẩm
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <FormInput
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="w-full sm:w-48">
                    <FormSelect
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={[
                            { value: '', label: 'Tất cả trạng thái' },
                            { value: 'ACTIVE', label: 'Hoạt động' },
                            { value: 'INACTIVE', label: 'Không hoạt động' },
                            { value: 'OUT_OF_STOCK', label: 'Hết hàng' },
                        ]}
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="space-y-4">
                <DataTable
                    columns={columns}
                    data={products}
                    loading={loading}
                    onRowClick={(row) => navigate(`/admin/products/edit/${row.id}`)}
                    emptyMessage="Chưa có sản phẩm nào."
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

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Xóa sản phẩm"
                message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
                confirmText="Xóa"
                variant="danger"
            />
        </div>
    );
};

export default ProductManagement;
