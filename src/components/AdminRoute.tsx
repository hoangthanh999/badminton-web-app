import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { isAuthenticated, isAdmin, loading, user } = useAuth();

    // Debug logging
    console.log('🔒 AdminRoute Check:', {
        isAuthenticated,
        isAdmin,
        loading,
        userRole: user?.role
    });

    if (loading) {
        console.log('⏳ Still loading...');
        return <LoadingSpinner fullScreen />;
    }

    if (!isAuthenticated) {
        console.log('❌ Not authenticated, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        console.log('❌ Not admin, redirecting to home. User role:', user?.role);
        console.log('💡 isAdmin calculation: user?.role === "ADMIN":', user?.role === 'ADMIN');
        console.log('💡 user object:', user);
        return <Navigate to="/" replace />;
    }

    console.log('✅ Admin access granted');
    return <>{children}</>;
};

export default AdminRoute;
