import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormInput from '@/components/Admin/Forms/FormInput';
import FormTextarea from '@/components/Admin/Forms/FormTextarea';
import FormImageUpload from '@/components/Admin/Forms/FormImageUpload';
import Button from '@/components/UI/Button';
import { CourtRequest } from '@/types/court';
import courtService from '@/services/courtService';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const schema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập tên sân'),
    address: yup.string().required('Vui lòng nhập địa chỉ'),
    description: yup.string().required('Vui lòng nhập mô tả'),
    pricePerHour: yup.number().typeError('Giá phải là số').required('Vui lòng nhập giá').min(0, 'Giá không được âm'),
    numberOfCourts: yup.number().typeError('Số sân phải là số').required('Vui lòng nhập số sân').min(1, 'Ít nhất 1 sân'),
    openTime: yup.string().required('Vui lòng nhập giờ mở'),
    closeTime: yup.string().required('Vui lòng nhập giờ đóng'),
    images: yup.array().of(yup.string()),
    facilities: yup.string(), // Handle as string for comma separation
});

const CourtForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            address: '',
            description: '',
            pricePerHour: 0,
            numberOfCourts: 1,
            openTime: '06:00',
            closeTime: '22:00',
            images: [],
            facilities: '',
        },
    });

    useEffect(() => {
        if (isEditMode) {
            const loadCourt = async () => {
                try {
                    const response = await courtService.getCourtById(Number(id));
                    if (response.success) {
                        const court = response.data;
                        setValue('name', court.name);
                        setValue('address', court.address);
                        setValue('description', court.description);
                        setValue('pricePerHour', court.pricePerHour);
                        setValue('numberOfCourts', court.numberOfCourts);
                        setValue('openTime', court.openTime);
                        setValue('closeTime', court.closeTime);
                        setValue('images', court.images || []);
                        setValue('facilities', court.facilities?.join(', ') || '');
                    }
                } catch (error) {
                    toast.error('Không thể tải thông tin sân');
                    navigate('/admin/courts');
                }
            };
            loadCourt();
        }
    }, [id, isEditMode, setValue, navigate]);

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            const courtData: CourtRequest = {
                ...data,
                facilities: data.facilities ? data.facilities.split(',').map((f: string) => f.trim()) : [],
                images: data.images || [], // Ensure images is array
            };

            if (isEditMode) {
                await courtService.updateCourt(Number(id), courtData);
                toast.success('Cập nhật sân thành công');
            } else {
                await courtService.createCourt(courtData);
                toast.success('Thêm sân mới thành công');
            }
            navigate('/admin/courts');
        } catch (error) {
            console.error(error);
            toast.error(isEditMode ? 'Cập nhật thất bại' : 'Thêm mới thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {isEditMode ? 'Chỉnh sửa sân cầu lông' : 'Thêm sân cầu lông mới'}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <FormInput
                    label="Tên sân"
                    {...register('name')}
                    error={errors.name?.message}
                    placeholder="Ví dụ: Sân Cầu Lông ABC"
                    required
                />

                <FormInput
                    label="Địa chỉ"
                    {...register('address')}
                    error={errors.address?.message}
                    placeholder="Số 123 Đường XYZ..."
                    required
                />

                <FormTextarea
                    label="Mô tả"
                    {...register('description')}
                    error={errors.description?.message}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        type="number"
                        label="Giá mỗi giờ (VND)"
                        {...register('pricePerHour')}
                        error={errors.pricePerHour?.message}
                        required
                        min={0}
                    />
                    <FormInput
                        type="number"
                        label="Số lượng sân"
                        {...register('numberOfCourts')}
                        error={errors.numberOfCourts?.message}
                        required
                        min={1}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        type="time"
                        label="Giờ mở cửa"
                        {...register('openTime')}
                        error={errors.openTime?.message}
                        required
                    />
                    <FormInput
                        type="time"
                        label="Giờ đóng cửa"
                        {...register('closeTime')}
                        error={errors.closeTime?.message}
                        required
                    />
                </div>

                <FormInput
                    label="Tiện ích (phân cách bằng dấu phẩy)"
                    {...register('facilities')}
                    placeholder="Wifi, Bãi đỗ xe, Căng tin..."
                    helperText="Nhập các tiện ích, cách nhau bởi dấu phẩy"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hình ảnh sân
                    </label>
                    <Controller
                        control={control}
                        name="images"
                        render={({ field }: { field: any }) => (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Currently handling 1 image for simplicity, can extend to multiple later */}
                                <div className="col-span-2">
                                    <FormImageUpload
                                        folder="courts"
                                        value={field.value?.[0] || ''}
                                        onChange={(url) => {
                                            const newImages = url ? [url] : [];
                                            field.onChange(newImages);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        * Hiện tại hỗ trợ upload 1 ảnh chính.
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button type="button" variant="secondary" onClick={() => navigate('/admin/courts')}>
                        Hủy
                    </Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Thêm mới')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CourtForm;
