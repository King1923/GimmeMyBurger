import './App.css';
import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Promotions from './pages/User_Home';
import Products from './pages/Admin_Products';
import AddProduct from './pages/Admin_AddProduct';
import EditProduct from './pages/Admin_EditProduct';
import Categories from './pages/Admin_Category';
import AddCategory from './pages/Admin_AddCategory';
import EditCategory from './pages/Admin_EditCategory';
import Orders from './pages/Admin_Orders';
import MyForm from './pages/MyForm';
import UserMenu from './pages/User_Menu';
import UserCart from './pages/User_Cart';
import http from './http';
import UserContext from './contexts/UserContext';
import MenuProduct from './pages/User_MenuProduct';
import AddPromotion from './pages/Admin_AddPromotion';
import EditPromotion from './pages/Admin_EditPromotion';
import AdminPromotions from './pages/Admin_Promotions';
import Inventory from './pages/Admin_Inventory';
import EditInventory from './pages/Admin_EditInventory';
import AddInventory from './pages/Admin_AddInventory';
import StoreLocator from './pages/StoreLocator';
import AdminStoreLocator from './pages/AdminStoreLocator';
import Register from './pages/Register';
import Login from './pages/Login';
import Rewards from './pages/Rewards';
import AddReward from './pages/AddReward';
import EditReward from './pages/EditReward';
import ProfileInfo from './pages/ProfileInfo';
import EditProfile from './pages/EditProfile';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import DeleteAccount from './pages/DeleteAccount';
import ClientFooter from './client/ClientFooter';
import ClientNavbar from './client/ClientNavbar';
import AllUsers from './pages/ManageUsers';
import UserSettings from './pages/UserSettings';
import AdminProfile from './pages/AdminProfile';
import ManageAddresses from './pages/ManageAddresses';
import NavigationPage from './pages/NavigationPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './contexts/ProtectedRoute ';

// Helper component to conditionally render Navbar and Footer.
const AppRoutes = () => {
  const location = useLocation();

  // Define the admin paths where you don't want to show the Navbar and Footer.
  const adminPaths = [
    "/products",
    "/addproduct",
    "/editproduct",
    "/categories",
    "/addcategory",
    "/editcategory",
    "/order",
    "/addreward",
    "/form",
    "/adminstorelocator",
    "/adminStoreLocator",
    "/inventory",
    "/addinventory",
    "/editinventory",
    "/editpromotion",
    "/adminpromotions",
    "/adminPromotions",
    "/addpromotion",
    "/admincustomers",
    "/adminprofile",
    "/dashboard"
  ];

  const hideHeaderAndFooter = adminPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      {!hideHeaderAndFooter && <ClientNavbar />}
      <Container sx={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Promotions />} />
          <Route path="/menu" element={<UserMenu />} />
          <Route path="/cart" element={<UserCart />} />
          <Route path="/products" element={
            <ProtectedRoute allowedRoles={[1]}>
              <Products />
            </ProtectedRoute>
          } />
          <Route path="/addproduct" element={
            <ProtectedRoute allowedRoles={[1]}>
              <AddProduct />
            </ProtectedRoute>
          } />
          <Route path="/editproduct/:id" element={
            <ProtectedRoute allowedRoles={[1]}>
              <EditProduct />
            </ProtectedRoute>
          } />
          <Route path="/categories" element={
            <ProtectedRoute allowedRoles={[1]}>
              <Categories />
            </ProtectedRoute>
          } />
          <Route path="/addcategory" element={
            <ProtectedRoute allowedRoles={[1]}>
              <AddCategory />
            </ProtectedRoute>
          } />
          <Route path="/editcategory/:id" element={
            <ProtectedRoute allowedRoles={[1]}>
              <EditCategory />
            </ProtectedRoute>
          } />
          <Route path="/product/:productId" element={<MenuProduct />} />
          <Route path="/order" element={
            <ProtectedRoute allowedRoles={[1]}>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/form" element={<MyForm />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/addreward" element={
            <ProtectedRoute allowedRoles={[1]}>
              <AddReward />
            </ProtectedRoute>
          } />
          <Route path="/editreward/:id" element={
            <ProtectedRoute allowedRoles={[1]}>
              <EditReward />
            </ProtectedRoute>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:id" element={<ProfileInfo />} />
          <Route path="/editprofile/:id" element={<EditProfile />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password/:id" element={<ChangePassword />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/storelocator" element={<StoreLocator />} />
          <Route path="/adminstorelocator" element={<AdminStoreLocator />} />
          <Route path="/navigation" element={<NavigationPage />} />
          <Route path="/addinventory" element={
            <ProtectedRoute allowedRoles={[1]}>
              <AddInventory />
            </ProtectedRoute>
          } />
          <Route path="/editinventory/:id" element={
            <ProtectedRoute allowedRoles={[1]}>
              <EditInventory />
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute allowedRoles={[1]}>
              <Inventory />
            </ProtectedRoute>
          } />
          <Route path="/editpromotion/:id" element={
            <ProtectedRoute allowedRoles={[1]}>
              <EditPromotion />
            </ProtectedRoute>
          } />
          <Route path="/adminPromotions" element={
            <ProtectedRoute allowedRoles={[1]}>
              <AdminPromotions />
            </ProtectedRoute>
          } />
          <Route path="/addpromotion" element={
            <ProtectedRoute allowedRoles={[1]}>
              <AddPromotion />
            </ProtectedRoute>
          } />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/admincustomers" element={
            <ProtectedRoute allowedRoles={[1]}>
              <AllUsers />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/adminprofile/:id" element={
            <ProtectedRoute allowedRoles={[1]}>
              <AdminProfile />
            </ProtectedRoute>
          } />
          <Route path="/manage-addresses" element={<ManageAddresses />} />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={[1]}>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Container>
      {!hideHeaderAndFooter && <ClientFooter />}
    </>
  );
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.clear();
      window.location = "/";
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppRoutes />
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
