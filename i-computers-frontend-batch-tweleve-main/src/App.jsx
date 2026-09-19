import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/homePage";
import ProductsPage from "./pages/productsPage";
import ProductOverview from "./pages/productOverview";
import CartPage from "./pages/cartPage";
import Checkout from "./pages/checkout";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import MyOrdersPage from "./pages/myOrdersPage";
import OrdersPage from "./pages/ordersPage";
import SettingsPage from "./pages/settingsPage";
import AdminPage from "./pages/adminPage";
import AdminProductsPage from "./pages/admin/adminProductsPage";
import AdminAddProductForm from "./pages/admin/adminAddProductForm";
import AdminEditProductForm from "./pages/admin/adminEditProductForm";
import AdminOrdersPage from "./pages/admin/adminOrdersPage";
import AdminUsersPage from "./pages/admin/adminUsersPage";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/products" element={<ProductsPage />} />
    <Route path="/product/:id" element={<ProductOverview />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
    <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
      <Route index element={<AdminPage />} />
      <Route path="products" element={<AdminProductsPage />} />
      <Route path="products/add" element={<AdminAddProductForm />} />
      <Route path="products/edit/:id" element={<AdminEditProductForm />} />
      <Route path="orders" element={<AdminOrdersPage />} />
      <Route path="users" element={<AdminUsersPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
