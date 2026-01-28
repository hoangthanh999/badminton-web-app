import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import apiClient from '@/services/apiClient';
import toast from 'react-hot-toast';

export interface FormImageUploadProps {
    label?: string;
    value?: string;
    onChange: (url: string) => void;
    folder?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    className?: string;
}

const FormImageUpload: React.FC<FormImageUploadProps> = ({
    label,
    value,
    onChange,
    folder = 'products',
    error,
    helperText,
    required,
    className,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Only image files are allowed');
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);

            const response = await apiClient.post('/upload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                onChange(response.data.data);
                toast.success('Image uploaded successfully');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
            // Reset input so same file can be selected again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = () => {
        onChange('');
    };

    return (
        <div className={clsx('flex flex-col gap-2', className)}>
            {label && (
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {value ? (
                // Preview State
                <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
                    <img
                        src={value}
                        alt="Uploaded preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                            title="Remove image"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : (
                // Upload State
                <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className={clsx(
                        'w-full max-w-md aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors',
                        error
                            ? 'border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-800'
                            : 'border-gray-300 hover:border-primary-500 bg-gray-50 hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600',
                        uploading && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                            <span className="text-sm font-medium">Uploading...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                            <Upload className="w-8 h-8" />
                            <div className="text-center">
                                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                    Click to upload
                                </span>
                                <span className="text-sm"> or drag and drop</span>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                SVG, PNG, JPG or GIF (max. 5MB)
                            </p>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                    />
                </div>
            )}

            {error && (
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            )}

            {helperText && !error && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {helperText}
                </p>
            )}
        </div>
    );
};

export default FormImageUpload;
