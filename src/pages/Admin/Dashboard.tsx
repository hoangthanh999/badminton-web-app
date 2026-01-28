import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import bookingService from '@/services/bookingService';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Booking } from '@/types/booking';
import {
    Calendar,
    Clock,
    CheckCircle,
    Users,
    TrendingUp,
    MapPin,
    ShoppingCart
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await bookingService.getAllBookings({ page: 0, size: 100 });
                if (response.success) {
                    const allBookings = response.data.content;
                    setBookings(allBookings.slice(0, 10));
                    setStats({
                        total: allBookings.length,
                        pending: allBookings.filter((b) => b.status === 'PENDING').length,
                        confirmed: allBookings.filter((b) => b.status === 'CONFIRMED').length,
                        completed: allBookings.filter((b) => b.status === 'COMPLETED').length,
                    });
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <LoadingSpinner fullScreen />;

    const statCards = [
        {
            title: 'Total Bookings',
            value: stats.total,
            icon: Calendar,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            title: 'Pending',
            value: stats.pending,
            icon: Clock,
            color: 'bg-yellow-500',
            textColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        },
        {
            title: 'Confirmed',
            value: stats.confirmed,
            icon: CheckCircle,
            color: 'bg-green-500',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
        },
        {
            title: 'Completed',
            value: stats.completed,
            icon: TrendingUp,
            color: 'bg-purple-500',
            textColor: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        },
    ];

    const quickActions = [
        {
            title: 'Manage Bookings',
            description: 'View and manage all court bookings',
            icon: Calendar,
            path: '/admin/bookings',
            color: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Manage Courts',
            description: 'Add, edit, or remove courts',
            icon: MapPin,
            path: '/admin/courts',
            color: 'text-green-600 dark:text-green-400',
        },
        {
            title: 'Manage Users',
            description: 'View and manage user accounts',
            icon: Users,
            path: '/admin/users',
            color: 'text-purple-600 dark:text-purple-400',
        },
        {
            title: 'Shop Orders',
            description: 'View and process shop orders',
            icon: ShoppingCart,
            path: '/admin/orders',
            color: 'text-orange-600 dark:text-orange-400',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Welcome back, {user?.fullName}!
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => navigate('/admin/bookings')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {stat.title}
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(action.path)}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all hover:scale-105 text-left"
                        >
                            <action.icon className={`w-8 h-8 ${action.color} mb-3`} />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                {action.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {action.description}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Bookings */}
            {bookings.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Recent Bookings
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                            Court
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {bookings.map((booking) => (
                                        <tr
                                            key={booking.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                                            onClick={() => navigate(`/admin/bookings`)}
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                #{booking.id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                {booking.courtName || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(booking.bookingDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                        booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
