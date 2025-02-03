import './App.css';
import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Tutorials from './pages/User_Home';
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
import Register from './pages/Register';
import Login from './pages/Login';
import http from './http';
import UserContext from './contexts/UserContext';
import MenuProduct from './pages/User_MenuProduct'; // MenuProduct is for displaying product details

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
    localStorage.clear();
    window.location = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          {/* Main Content */}
          <Container sx={{ minHeight: '100vh' }}>
            <Routes>
              <Route path={"/"} element={<Tutorials />} />
              <Route path={"/tutorials"} element={<Tutorials />} />
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
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/form"} element={<MyForm />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;