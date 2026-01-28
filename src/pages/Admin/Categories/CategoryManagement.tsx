// frontend/src/pages/Admin/Categories/CategoryManagement.tsx

import React, { useEffect, useState } from 'react';
import categoryService from '@/services/categoryService';
import DataTable, { Column } from '@/components/Admin/Tables/DataTable';
import StatusBadge from '@/components/UI/StatusBadge';
import Button from '@/components/UI/Button';
import Modal from '@/components/Admin/Modals/Modal';
import FormInput from '@/components/Admin/Forms/FormInput';
import FormTextarea from '@/components/Admin/Forms/FormTextarea';
import ConfirmDialog from '@/components/Admin/Modals/ConfirmDialog';
import { ProductCategory } from '@/types/shop';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { CategoryRequest } from '@/types/shop';

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        displayOrder: 0,
        active: true
    });
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getAllCategories();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            toast.error('Không thể tải danh mục');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleCreate = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            description: '',
            imageUrl: '',
            displayOrder: 0,
            active: true
        });
        setIsFormOpen(true);
    };

    const handleEdit = (category: ProductCategory) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            imageUrl: category.imageUrl || '', // ✅ Now exists
            displayOrder: category.displayOrder || 0, // ✅ Now exists
            active: category.status === 'ACTIVE',
        });
        setIsFormOpen(true);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);

            // ✅ SỹA: Use undefined instead of null
            const categoryData: CategoryRequest = {
                name: formData.name,
                description: formData.description || undefined, // ✅ undefined not null
                imageUrl: formData.imageUrl || undefined, // ✅ undefined not null
                displayOrder: formData.displayOrder || 0,
            };

            console.log('📤 Sending category data:', categoryData);

            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, categoryData);

                const currentActive = editingCategory.status === 'ACTIVE';
                if (currentActive !== formData.active) {
                    await categoryService.updateCategoryStatus(editingCategory.id, formData.active);
                }

                toast.success('Cập nhật danh mục thành công');
            } else {
                const response = await categoryService.createCategory(categoryData);

                if (response.success && !formData.active) {
                    await categoryService.updateCategoryStatus(response.data.id, false);
                }

                toast.success('Thêm danh mục thành công');
            }

            setIsFormOpen(false);
            loadCategories();
        } catch (error: any) {
            console.error('❌ Submit error:', error);
            console.error('❌ Error response:', error.response?.data);

            const errorMessage = error.response?.data?.message
                || error.response?.data?.error
                || 'Lưu thất bại';

            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            setDeleting(true);
            await categoryService.deleteCategory(deleteId);
            toast.success('Xóa danh mục thành công');
            loadCategories();
            setIsDeleteOpen(false);
        } catch (error: any) {
            console.error('❌ Delete error:', error);
            const errorMessage = error.response?.data?.message || 'Xóa thất bại';
            toast.error(errorMessage);
        } finally {
            setDeleting(false);
        }
    };

    const handleToggleStatus = async (id: number, currentStatus: string) => {
        try {
            const newActive = currentStatus !== 'ACTIVE';
            await categoryService.updateCategoryStatus(id, newActive);
            toast.success('Cập nhật trạng thái thành công');
            loadCategories();
        } catch (error: any) {
            console.error('❌ Toggle status error:', error);
            const errorMessage = error.response?.data?.message || 'Cập nhật thất bại';
            toast.error(errorMessage);
        }
    };

    const columns: Column<ProductCategory>[] = [
        {
            key: 'name',
            label: 'Tên danh mục',
            sortable: true,
            render: (name, row) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{name}</div>
                    {row.description && (
                        <div className="text-xs text-gray-500">{row.description}</div>
                    )}
                </div>
            ),
        },
        {
            key: 'displayOrder',
            label: 'Thứ tự',
            width: '100px',
            render: (order) => <span className="text-sm">{order || 0}</span>,
        },
        {
            key: 'status',
            label: 'Trạng thái',
            width: '150px',
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
                            handleToggleStatus(row.id, row.status);
                        }}
                        title={row.status === 'ACTIVE' ? 'Tắt' : 'Bật'}
                    >
                        <Eye
                            className={`w-4 h-4 ${row.status === 'ACTIVE' ? 'text-green-500' : 'text-gray-400'}`}
                        />
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
                        Quản lý danh mục
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Quản lý danh mục sản phẩm
                    </p>
                </div>
                <Button variant="primary" onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm danh mục
                </Button>
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={categories}
                loading={loading}
                onRowClick={handleEdit}
                emptyMessage="Chưa có danh mục nào."
            />

            {/* Form Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput
                        label="Tên danh mục"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Ví dụ: Vợt cầu lông"
                    />

                    <FormTextarea
                        label="Mô tả"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        placeholder="Mô tả danh mục..."
                    />

                    <FormInput
                        label="URL hình ảnh"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://..."
                    />

                    <FormInput
                        type="number"
                        label="Thứ tự hiển thị"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                        min={0}
                    />

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="rounded"
                            id="active-checkbox"
                        />
                        <label htmlFor="active-checkbox" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                            Hoạt động
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" variant="primary" loading={submitting}>
                            {editingCategory ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Xóa danh mục"
                message="Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác."
                confirmText="Xóa"
                variant="danger"
            />
        </div>
    );
};

export default CategoryManagement;
