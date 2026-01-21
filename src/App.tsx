import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';

// Auth pages
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import ForgotPassword from '@/pages/Auth/ForgotPassword';

// User pages - placeholders for now, will create actual pages
import HomePage from '@/pages/Home/HomePage';
import CourtList from '@/pages/Courts/CourtList';
import CourtDetail from '@/pages/Courts/CourtDetail';
import MyBookings from '@/pages/Bookings/MyBookings';
import BookingDetail from '@/pages/Bookings/BookingDetail';
import CreateBooking from '@/pages/Bookings/CreateBooking';
import ShopHome from '@/pages/Shop/ShopHome';
import ProductDetail from '@/pages/Shop/ProductDetail';
import Cart from '@/pages/Shop/Cart';
import Checkout from '@/pages/Shop/Checkout';
import MyOrders from '@/pages/Shop/MyOrders';
import Profile from '@/pages/Profile/Profile';

// Admin pages
import AdminDashboard from '@/pages/Admin/Dashboard';
import BookingManagement from '@/pages/Admin/Bookings/BookingManagement';
import CourtManagement from '@/pages/Admin/Courts/CourtManagement';
import CreateCourt from '@/pages/Admin/Courts/CreateCourt';
import EditCourt from '@/pages/Admin/Courts/EditCourt';

import '@/styles/global.css';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />

                        {/* Protected user routes */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <HomePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/courts"
                            element={
                                <ProtectedRoute>
                                    <CourtList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/courts/:id"
                            element={
                                <ProtectedRoute>
                                    <CourtDetail />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/courts/:id/book"
                            element={
                                <ProtectedRoute>
                                    <CreateBooking />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/bookings"
                            element={
                                <ProtectedRoute>
                                    <MyBookings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/bookings/:id"
                            element={
                                <ProtectedRoute>
                                    <BookingDetail />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/shop"
                            element={
                                <ProtectedRoute>
                                    <ShopHome />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/shop/products/:id"
                            element={
                                <ProtectedRoute>
                                    <ProductDetail />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/shop/cart"
                            element={
                                <ProtectedRoute>
                                    <Cart />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/shop/checkout"
                            element={
                                <ProtectedRoute>
                                    <Checkout />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/shop/orders"
                            element={
                                <ProtectedRoute>
                                    <MyOrders />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin routes */}
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/bookings"
                            element={
                                <AdminRoute>
                                    <BookingManagement />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/courts"
                            element={
                                <AdminRoute>
                                    <CourtManagement />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/courts/create"
                            element={
                                <AdminRoute>
                                    <CreateCourt />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/courts/edit/:id"
                            element={
                                <AdminRoute>
                                    <EditCourt />
                                </AdminRoute>
                            }
                        />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
