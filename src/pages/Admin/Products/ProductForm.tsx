// frontend/src/pages/Admin/Products/ProductForm.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormInput from '@/components/Admin/Forms/FormInput';
import FormTextarea from '@/components/Admin/Forms/FormTextarea';
import FormSelect from '@/components/Admin/Forms/FormSelect';
import FormImageUpload from '@/components/Admin/Forms/FormImageUpload';
import Button from '@/components/UI/Button';
import productService from '@/services/productService';
import categoryService from '@/services/categoryService';
import toast from 'react-hot-toast';
import { ProductCategory } from '@/types/shop';
import { ProductRequest } from '@/types/shop';

const schema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập tên sản phẩm'),
    description: yup.string().required('Vui lòng nhập mô tả'),
    price: yup.number().typeError('Giá phải là số').required('Vui lòng nhập giá').min(0, 'Giá không được âm'),
    discountPrice: yup.number().typeError('Giá giảm phải là số').min(0, 'Giá không được âm').optional().nullable(),
    stock: yup.number().typeError('Tồn kho phải là số').required('Vui lòng nhập tồn kho').min(0, 'Tồn kho không được âm'),
    categoryId: yup.number().required('Vui lòng chọn danh mục'),
    status: yup.string().required('Vui lòng chọn trạng thái'),
    images: yup.array().of(yup.string()),
    featured: yup.boolean(),
    bestseller: yup.boolean(),
    specifications: yup.string().optional(),
    warranty: yup.string().optional(),
    brand: yup.string().optional(),
});

const ProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<ProductCategory[]>([]);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        // watch, // ✅ REMOVED
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            discountPrice: undefined,
            stock: 0,
            categoryId: 0,
            images: [],
            status: 'ACTIVE',
            featured: false,
            bestseller: false,
            specifications: '',
            warranty: '',
            brand: '',
        },
    });
    useEffect(() => {
        loadCategories();
        if (isEditMode) {
            loadProduct();
        }
    }, [id, isEditMode]);

    const loadCategories = async () => {
        try {
            const response = await categoryService.getActiveCategories();
            if (response.success) {
                setCategories(response.data);
            }
        } catch (error) {
            toast.error('Không thể tải danh mục');
        }
    };

    const loadProduct = async () => {
        try {
            const response = await productService.getProductById(Number(id));
            if (response.success) {
                const product = response.data;
                setValue('name', product.name);
                setValue('description', product.description);
                setValue('price', product.price);
                setValue('discountPrice', product.originalPrice); // ✅ Use originalPrice
                setValue('stock', product.stockQuantity || product.stock || 0); // ✅ Handle both
                setValue('categoryId', product.categoryId);
                setValue('images', product.images || []);
                setValue('status', product.status);
                setValue('featured', product.featured);
                setValue('bestseller', product.bestseller || false);
                setValue('specifications', product.specifications || '');
                setValue('warranty', product.warranty || '');
                setValue('brand', product.brand || ''); // ✅ Now exists in type
            }
        } catch (error) {
            toast.error('Không thể tải thông tin sản phẩm');
            navigate('/admin/products');
        }
    };

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);

            // ✅ SỬA: Format specifications correctly
            let specifications: Record<string, string> | undefined = undefined;
            if (data.specifications && data.specifications.trim()) {
                specifications = { info: data.specifications };
            }

            const productData: ProductRequest = {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                originalPrice: data.discountPrice ? Number(data.discountPrice) : Number(data.price),
                stockQuantity: Number(data.stock),
                categoryId: Number(data.categoryId),
                brand: data.brand || 'Unknown',
                featured: data.featured || false,
                images: data.images || [],
                specifications: specifications, // ✅ Now correctly typed
            };

            console.log('📤 Sending product data:', productData);

            if (isEditMode) {
                await productService.updateProduct(Number(id), productData);
                toast.success('Cập nhật sản phẩm thành công');
            } else {
                await productService.createProduct(productData);
                toast.success('Thêm sản phẩm thành công');
            }
            navigate('/admin/products');
        } catch (error: any) {
            console.error('❌ Submit error:', error);
            console.error('❌ Error response:', error.response?.data);

            const errorMessage = error.response?.data?.message
                || error.response?.data?.error
                || (isEditMode ? 'Cập nhật thất bại' : 'Thêm mới thất bại');

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <FormInput
                    label="Tên sản phẩm"
                    {...register('name')}
                    error={errors.name?.message}
                    placeholder="Ví dụ: Vợt cầu lông Yonex..."
                    required
                />

                <FormTextarea
                    label="Mô tả"
                    {...register('description')}
                    error={errors.description?.message}
                    required
                    rows={4}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        type="number"
                        label="Giá bán (VND)"
                        {...register('price')}
                        error={errors.price?.message}
                        required
                        min={0}
                    />
                    <FormInput
                        type="number"
                        label="Giá gốc (VND)"
                        {...register('discountPrice')}
                        error={errors.discountPrice?.message}
                        min={0}
                        placeholder="Để trống nếu không có giảm giá"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        type="number"
                        label="Tồn kho"
                        {...register('stock')}
                        error={errors.stock?.message}
                        required
                        min={0}
                    />
                    <FormSelect
                        label="Danh mục"
                        {...register('categoryId')}
                        error={errors.categoryId?.message}
                        required
                        options={[
                            { value: '', label: 'Chọn danh mục' },
                            ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
                        ]}
                    />
                </div>

                <FormInput
                    label="Thương hiệu"
                    {...register('brand')}
                    error={errors.brand?.message}
                    placeholder="Ví dụ: Yonex, Victor..."
                />

                <FormSelect
                    label="Trạng thái"
                    {...register('status')}
                    error={errors.status?.message}
                    required
                    options={[
                        { value: 'ACTIVE', label: 'Hoạt động' },
                        { value: 'INACTIVE', label: 'Không hoạt động' },
                        { value: 'OUT_OF_STOCK', label: 'Hết hàng' },
                    ]}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" {...register('featured')} className="rounded" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Sản phẩm nổi bật</span>
                        </label>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" {...register('bestseller')} className="rounded" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Bán chạy</span>
                        </label>
                    </div>
                </div>

                <FormTextarea
                    label="Thông số kỹ thuật"
                    {...register('specifications')}
                    rows={3}
                    placeholder="Nhập thông số kỹ thuật..."
                />

                <FormInput
                    label="Bảo hành"
                    {...register('warranty')}
                    placeholder="Ví dụ: 12 tháng"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hình ảnh sản phẩm
                    </label>
                    <Controller
                        control={control}
                        name="images"
                        render={({ field }) => (
                            <div className="col-span-2">
                                <FormImageUpload
                                    folder="products"
                                    value={field.value?.[0] || ''}
                                    onChange={(url) => {
                                        // ✅ SỬA: Lưu dưới dạng mảng
                                        const newImages = url ? [url] : [];
                                        field.onChange(newImages);
                                    }}
                                />
                            </div>
                        )}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        * Hiện tại hỗ trợ upload 1 ảnh chính.
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button type="button" variant="secondary" onClick={() => navigate('/admin/products')}>
                        Hủy
                    </Button>
                    <Button type="submit" variant="primary" loading={loading}>
                        {isEditMode ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
