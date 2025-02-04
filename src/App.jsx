import './App.css';
import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import MenuProduct from './pages/User_MenuProduct'; // MenuProduct is for displaying product details

import Register from './pages/Register';
import Login from './pages/Login';
import Rewards from './pages/Rewards';
import AddReward from './pages/AddReward';
import EditReward from './pages/EditReward';
import ProfileInfo from './pages/ProfileInfo';
import EditProfile from './pages/EditProfile'; // Import the EditProfile page
import ResetPassword from './pages/ResetPassword';

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
          {/* Main Content */}
          <Container sx={{ minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path={"/menu"} element={<UserMenu />} />
              <Route path={"/cart"} element={<UserCart />} />
              <Route path={"/products"} element={<Products />} />
              <Route path={"/addproduct"} element={<AddProduct />} />
              <Route path="/editproduct/:id" element={<EditProduct />} />
              <Route path={"/categories"} element={<Categories />} />
              <Route path={"/addcategory"} element={<AddCategory />} />
              <Route path="/editcategory/:id" element={<EditCategory />} />
              <Route path="/product/:productId" element={<MenuProduct />} /> {/* This route handles the product details page */}
              <Route path={"/order"} element={<Orders />} />
              <Route path={"/form"} element={<MyForm />} />
              
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/addreward" element={<AddReward />} />
              <Route path="/editreward/:id" element={<EditReward />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile/:id" element={<ProfileInfo />} />
              <Route path="/editprofile/:id" element={<EditProfile />} /> {/* New route for editing profile */}
              <Route path="/reset-password/:id" element={<ResetPassword />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;