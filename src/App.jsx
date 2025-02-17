import './App.css';
import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
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
import MenuProduct from './pages/User_MenuProduct'; // For displaying product details

import Register from './pages/Register';
import Login from './pages/Login';
import Rewards from './pages/Rewards';
import AddReward from './pages/AddReward';
import EditReward from './pages/EditReward';
import ProfileInfo from './pages/ProfileInfo';
import EditProfile from './pages/EditProfile'; // EditProfile page
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import DeleteAccount from './pages/DeleteAccount';

import ClientNavbar from './client/ClientNavBar';
import ClientFooter from './client/ClientFooter'; // Import your ClientFooter

// Helper component to wrap Routes and conditionally render Navbar and Footer.
const AppRoutes = () => {
  const location = useLocation();

  // Define the admin paths where you don't want to show the Navbar and Footer.
  // Adjust these as needed.
  const adminPaths = [
    "/products",
    "/addproduct",
    "/editproduct",
    "/categories",
    "/addcategory",
    "/editcategory",
    "/order",
    "/addreward",
    "/form"
  ];

  const hideHeaderAndFooter = adminPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      {/* Render Navbar if not on admin pages */}
      {!hideHeaderAndFooter && <ClientNavbar />}
      <Container sx={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={<UserMenu />} />
          <Route path="/cart" element={<UserCart />} />
          <Route path="/products" element={<Products />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/editproduct/:id" element={<EditProduct />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/addcategory" element={<AddCategory />} />
          <Route path="/editcategory/:id" element={<EditCategory />} />
          <Route path="/product/:productId" element={<MenuProduct />} /> {/* Product details */}
          <Route path="/order" element={<Orders />} />
          <Route path="/form" element={<MyForm />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/addreward" element={<AddReward />} />
          <Route path="/editreward/:id" element={<EditReward />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:id" element={<ProfileInfo />} />
          <Route path="/editprofile/:id" element={<EditProfile />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password/:id" element={<ChangePassword />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
        </Routes>
      </Container>
      {/* Render Footer if not on admin pages */}
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
