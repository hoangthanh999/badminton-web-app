import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import reviewService from '@/services/reviewService';
import DataTable, { Column } from '@/components/Admin/Tables/DataTable';
import TablePagination from '@/components/Admin/Tables/TablePagination';
import Button from '@/components/UI/Button';
import ConfirmDialog from '@/components/Admin/Modals/ConfirmDialog';
import { ProductReview } from '@/types/shop';
import { Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewManagement: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const currentPage = parseInt(searchParams.get('page') || '0');
    const pageSize = parseInt(searchParams.get('size') || '10');

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadReviews = async () => {
        try {
            setLoading(true);
            // For simplicity, getting latest verified reviews
            // In a real app, you'd have an admin endpoint to get all reviews
            const data = await reviewService.getLatestVerifiedReviews(pageSize);
            if (data.success) {
                setReviews(data.data);
                setTotalItems(data.data.length);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            toast.error('Không thể tải đánh giá');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, [currentPage, pageSize]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            setDeleting(true);
            await reviewService.deleteReview(deleteId);
            toast.success('Xóa đánh giá thành công');
            loadReviews();
            setIsDeleteOpen(false);
        } catch (error) {
            toast.error('Xóa thất bại');
        } finally {
            setDeleting(false);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    const columns: Column<ProductReview>[] = [
        {
            key: 'productName',
            label: 'Sản phẩm',
            render: (name, row) => (
                <div className="flex gap-3">
                    <img
                        src={row.productImage}
                        alt={name}
                        className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                        <div className="font-medium">{name}</div>
                        <div className="text-xs text-gray-500">{row.userName}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'rating',
            label: 'Đánh giá',
            width: '150px',
            render: (rating) => renderStars(rating),
        },
        {
            key: 'comment',
            label: 'Nội dung',
            render: (comment) => (
                <div className="max-w-md truncate text-sm text-gray-600 dark:text-gray-300">
                    {comment}
                </div>
            ),
        },
        {
            key: 'verified',
            label: 'Xác thực',
            width: '100px',
            render: (verified) => (
                <span
                    className={`text-xs px-2 py-1 rounded ${verified
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                >
                    {verified ? 'Đã mua' : 'Chưa mua'}
                </span>
            ),
        },
        {
            key: 'createdAt',
            label: 'Ngày tạo',
            width: '120px',
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
                        setDeleteId(row.id);
                        setIsDeleteOpen(true);
                    }}
                >
                    <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Quản lý đánh giá
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Quản lý và kiểm duyệt đánh giá sản phẩm
                </p>
            </div>

            {/* Data Table */}
            <div className="space-y-4">
                <DataTable
                    columns={columns}
                    data={reviews}
                    loading={loading}
                    emptyMessage="Chưa có đánh giá nào."
                />

                {totalPages > 1 && (
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
                )}
            </div>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Xóa đánh giá"
                message="Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác."
                confirmText="Xóa"
                variant="danger"
            />
        </div>
    );
};

export default ReviewManagement;
