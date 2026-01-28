import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import clsx from 'clsx';

export interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
    width?: string;
}

export interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyField?: string;
    onRowClick?: (row: T) => void;
    loading?: boolean;
    emptyMessage?: string;
    className?: string;
}

function DataTable<T extends Record<string, any>>({
    columns,
    data,
    keyField = 'id',
    onRowClick,
    loading = false,
    emptyMessage = 'No data available',
    className,
}: DataTableProps<T>) {
    const [sortConfig, setSortConfig] = React.useState<{
        key: string;
        direction: 'asc' | 'desc';
    } | null>(null);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = React.useMemo(() => {
        if (!sortConfig) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === bValue) return 0;

            const comparison = aValue > bValue ? 1 : -1;
            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
    }, [data, sortConfig]);

    const getSortIcon = (columnKey: string) => {
        if (!sortConfig || sortConfig.key !== columnKey) {
            return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
        }
        return sortConfig.direction === 'asc' ? (
            <ChevronUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        ) : (
            <ChevronDown className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        );
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="animate-pulse">
                    <div className="bg-gray-100 dark:bg-gray-700 h-12"></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="border-t border-gray-200 dark:border-gray-700">
                            <div className="h-16 bg-gray-50 dark:bg-gray-800"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">📋</div>
                <p className="text-gray-600 dark:text-gray-400">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div
            className={clsx(
                'bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden',
                className
            )}
        >
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={clsx(
                                        'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider',
                                        column.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none'
                                    )}
                                    style={{ width: column.width }}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{column.label}</span>
                                        {column.sortable && getSortIcon(column.key)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {sortedData.map((row, rowIndex) => (
                            <tr
                                key={row[keyField] || rowIndex}
                                className={clsx(
                                    'transition-colors',
                                    onRowClick &&
                                    'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                )}
                                onClick={() => onRowClick?.(row)}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                                    >
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DataTable;
