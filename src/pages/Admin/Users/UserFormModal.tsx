import React, { useState, useEffect } from 'react';
import Modal from '@/components/Admin/Modals/Modal';
import Button from '@/components/UI/Button';
import FormInput from '@/components/Admin/Forms/FormInput';
import FormSelect from '@/components/Admin/Forms/FormSelect';
import userService from '@/services/userService';
import { UserDetail } from '@/types/user';
import toast from 'react-hot-toast';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserDetail | null;
    onSuccess: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
    isOpen,
    onClose,
    user,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        role: 'USER',
        address: '',
        active: true,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                password: '',
                role: user.role,
                address: user.address || '',
                active: user.active,
            });
        } else {
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                password: '',
                role: 'USER',
                address: '',
                active: true,
            });
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);

            if (user) {
                // Update existing user
                const { password, ...updateData } = formData;
                await userService.updateUser(user.id, {
                    ...updateData,
                    role: updateData.role as 'USER' | 'OWNER' | 'ADMIN',
                });
                toast.success('Cập nhật người dùng thành công');
            } else {
                // Create new user
                if (!formData.password) {
                    toast.error('Vui lòng nhập mật khẩu');
                    return;
                }
                await userService.createUser({
                    ...formData,
                    role: formData.role as 'USER' | 'OWNER' | 'ADMIN',
                });
                toast.success('Thêm người dùng thành công');
            }

            onSuccess();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    label="Họ và tên"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    placeholder="Nguyễn Văn A"
                />

                <FormInput
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="user@example.com"
                />

                <FormInput
                    label="Số điện thoại"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="0912345678"
                />

                {!user && (
                    <FormInput
                        label="Mật khẩu"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        placeholder="Nhập mật khẩu"
                    />
                )}

                <FormInput
                    label="Địa chỉ"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Đường ABC"
                />

                <FormSelect
                    label="Vai trò"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    options={[
                        { value: 'USER', label: 'Người dùng' },
                        { value: 'OWNER', label: 'Chủ sân' },
                        { value: 'ADMIN', label: 'Quản trị viên' },
                    ]}
                />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="rounded"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                        Tài khoản hoạt động
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button type="submit" variant="primary" loading={loading}>
                        {user ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default UserFormModal;
