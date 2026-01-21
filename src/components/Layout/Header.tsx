// Modern Header Component with glass effect
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const Header: React.FC = () => {
    const { user, isAuthenticated, logout, isAdmin } = useAuth();
    const { itemCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Trang chủ';
        if (path.includes('/courts')) return 'Sân cầu lông';
        if (path.includes('/bookings')) return 'Đặt sân';
        if (path.includes('/shop')) return 'Cửa hàng';
        if (path.includes('/profile')) return 'Hồ sơ';
        if (path.includes('/admin')) return 'Quản trị';
        return 'Badminton';
    };

    if (!isAuthenticated) return null;

    return (
        <motion.header
            className={`modern-header ${scrolled ? 'scrolled' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="header-container">
                {/* Logo & Title */}
                <div className="header-left">
                    <Link to="/" className="header-logo">
                        <span className="logo-icon">🏸</span>
                        <span className="logo-text">Badminton</span>
                    </Link>
                    <div className="header-divider"></div>
                    <h1 className="page-title">{getPageTitle()}</h1>
                </div>

                {/* Desktop Nav */}
                <nav className="header-nav desktop-nav">
                    <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>
                        <span className="nav-icon">🏠</span>
                        <span>Trang chủ</span>
                    </Link>
                    <Link to="/courts" className={location.pathname.includes('/courts') ? 'nav-link active' : 'nav-link'}>
                        <span className="nav-icon">🏸</span>
                        <span>Sân</span>
                    </Link>
                    <Link to="/bookings" className={location.pathname.includes('/bookings') ? 'nav-link active' : 'nav-link'}>
                        <span className="nav-icon">📋</span>
                        <span>Lịch đặt</span>
                    </Link>
                    <Link to="/shop" className={location.pathname.includes('/shop') ? 'nav-link active' : 'nav-link'}>
                        <span className="nav-icon">🛒</span>
                        <span>Cửa hàng</span>
                        {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                    </Link>
                    {isAdmin && (
                        <Link to="/admin" className={location.pathname.includes('/admin') ? 'nav-link active admin-link' : 'nav-link admin-link'}>
                            <span className="nav-icon">⚙️</span>
                            <span>Admin</span>
                        </Link>
                    )}
                </nav>

                {/* User Menu */}
                <div className="header-right">
                    <Link to="/profile" className="user-menu">
                        <div className="user-avatar">
                            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="user-name">{user?.fullName}</span>
                    </Link>
                    <button onClick={handleLogout} className="logout-btn">
                        <span>Đăng xuất</span>
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            🏠 Trang chủ
                        </Link>
                        <Link to="/courts" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            🏸 Sân
                        </Link>
                        <Link to="/bookings" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            📋 Lịch đặt
                        </Link>
                        <Link to="/shop" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            🛒 Cửa hàng {itemCount > 0 && `(${itemCount})`}
                        </Link>
                        {isAdmin && (
                            <Link to="/admin" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                                ⚙️ Admin
                            </Link>
                        )}
                        <Link to="/profile" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            👤 Hồ sơ
                        </Link>
                        <button onClick={handleLogout} className="mobile-nav-link logout">
                            🚪 Đăng xuất
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Header;
