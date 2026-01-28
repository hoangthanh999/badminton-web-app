import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
}

const TablePagination: React.FC<TablePaginationProps> = ({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50, 100],
}) => {
    const startItem = currentPage * pageSize + 1;
    const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

    const canGoPrevious = currentPage > 0;
    const canGoNext = currentPage < totalPages - 1;

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Show all pages
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show first, last, current and nearby pages
            pages.push(0); // First page

            if (currentPage > 2) {
                pages.push('...');
            }

            // Pages around current
            for (
                let i = Math.max(1, currentPage - 1);
                i <= Math.min(totalPages - 2, currentPage + 1);
                i++
            ) {
                pages.push(i);
            }

            if (currentPage < totalPages - 3) {
                pages.push('...');
            }

            if (totalPages > 1) {
                pages.push(totalPages - 1); // Last page
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {/* Left: Items info & page size */}
            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{startItem}</span> to{' '}
                    <span className="font-medium">{endItem}</span> of{' '}
                    <span className="font-medium">{totalItems}</span> results
                </div>

                {onPageSizeChange && (
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="pageSize"
                            className="text-sm text-gray-700 dark:text-gray-300"
                        >
                            Per page:
                        </label>
                        <select
                            id="pageSize"
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Right: Pagination controls */}
            <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!canGoPrevious}
                    className={clsx(
                        'p-2 rounded-md transition-colors',
                        canGoPrevious
                            ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                            : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    )}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) =>
                        page === '...' ? (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-3 py-1 text-gray-500 dark:text-gray-400"
                            >
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page as number)}
                                className={clsx(
                                    'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                                    page === currentPage
                                        ? 'bg-primary-600 text-white'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                )}
                            >
                                {(page as number) + 1}
                            </button>
                        )
                    )}
                </div>

                {/* Next button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!canGoNext}
                    className={clsx(
                        'p-2 rounded-md transition-colors',
                        canGoNext
                            ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                            : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    )}
                    aria-label="Next page"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default TablePagination;
