
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import AdminLayout from '@/components/Admin/Layout/AdminLayout';

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
import CourtManagement from './pages/Admin/Courts/CourtManagement';
import CourtForm from './pages/Admin/Courts/CourtForm';
import ProductManagement from '@/pages/Admin/Products/ProductManagement';
import ProductForm from '@/pages/Admin/Products/ProductForm';
import OrderManagement from '@/pages/Admin/Orders/OrderManagement';
import CategoryManagement from '@/pages/Admin/Categories/CategoryManagement';
import ReviewManagement from '@/pages/Admin/Reviews/ReviewManagement';
import UserManagement from '@/pages/Admin/Users/UserManagement';

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

                        {/* Admin routes - wrapped in AdminLayout */}
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminLayout />
                                </AdminRoute>
                            }
                        >
                            <Route index element={<AdminDashboard />} />
                            <Route path="bookings" element={<BookingManagement />} />
                            <Route path="courts" element={<CourtManagement />} />
                            <Route path="courts/create" element={<CourtForm />} />
                            <Route path="courts/edit/:id" element={<CourtForm />} />
                            <Route path="products" element={<ProductManagement />} />
                            <Route path="products/create" element={<ProductForm />} />
                            <Route path="products/edit/:id" element={<ProductForm />} />
                            <Route path="orders" element={<OrderManagement />} />
                            <Route path="categories" element={<CategoryManagement />} />
                            <Route path="reviews" element={<ReviewManagement />} />
                            <Route path="users" element={<UserManagement />} />
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
