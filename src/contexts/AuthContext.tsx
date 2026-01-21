import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth';
import authService from '@/services/authService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isOwner: boolean;
    loading: boolean;
    login: (emailOrPhone: string, password: string) => Promise<void>;
    register: (data: { fullName: string; email: string; phone: string; password: string }) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        const initAuth = () => {
            try {
                const currentUser = authService.getCurrentUser();
                const isAuth = authService.isAuthenticated();

                if (currentUser && isAuth) {
                    setUser(currentUser);
                } else {
                    // Clear invalid session
                    authService.logout();
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                authService.logout();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (emailOrPhone: string, password: string) => {
        try {
            const response = await authService.login({ emailOrPhone, password });
            if (response.success && response.data) {
                setUser(response.data.user);
            }
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Đăng nhập thất bại');
        }
    };

    const register = async (data: {
        fullName: string;
        email: string;
        phone: string;
        password: string;
    }) => {
        try {
            const response = await authService.register(data);
            if (response.success && response.data) {
                setUser(response.data.user);
            }
        } catch (error: any) {
            console.error('Register error:', error);
            throw new Error(error.message || 'Đăng ký thất bại');
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Refresh user error:', error);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user && authService.isAuthenticated(),
        isAdmin: user?.role === 'ADMIN',
        isOwner: user?.role === 'OWNER',
        loading,
        login,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
