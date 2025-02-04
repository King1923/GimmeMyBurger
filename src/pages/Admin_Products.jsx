import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Button,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import AdminSidebar from '../admin/AdminSideBar';

function AdminProducts() {
    const [productList, setProductList] = useState([]);
    const [categories, setCategories] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, categoryRes] = await Promise.all([
                    http.get('/product'),
                    http.get('/category'),
                ]);
                console.log('Fetched products:', productRes.data);
                console.log('Fetched categories:', categoryRes.data);
                setProductList(productRes.data);
                setCategories(categoryRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const deleteProduct = async (id, name) => {
        console.log('Deleting product with ID:', id);
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await http.delete(`/product/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            console.log('Delete response:', response);
            setProductList((prevList) => prevList.filter((product) => product.id !== id));
            toast.success(`${name} has been deleted.`);
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete the product. Please try again.');
        }
    };

    const sortedProducts = productList.sort((a, b) => a.productId - b.productId);

    return (
        <Box sx={{ display: 'flex' }}>
            <AdminSidebar />
            <Box sx={{ flexGrow: 1, paddingLeft: '16px', paddingTop: '16px' }}>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Products
                </Typography>

                <Box sx={{ mb: 2 }}>
                    {user && (
                        <Link to="/addproduct">
                            <Button variant="contained">Add Product</Button>
                        </Link>
                    )}
                </Box>

                {/* Show a message if no categories exist, but keep the sidebar */}
                {categories.length === 0 ? (
                    <Typography>No categories found. Please add categories first.</Typography>
                ) : (
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product ID</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>SKU</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Stock</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Updated At</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedProducts.map((product) => {
                                const imageUrl = product.image
                                    ? `${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/${product.image}`
                                    : null;

                                return (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.productId || 'N/A'}</TableCell>
                                        <TableCell>
                                            {product.imageFile ? (
                                                <img
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`}
                                                    alt={product.name}
                                                    style={{ width: 50, height: 50, objectFit: 'cover' }}
                                                />
                                            ) : (
                                                "No Image"
                                            )}
                                        </TableCell>
                                        <TableCell>{product.sku || 'N/A'}</TableCell>
                                        <TableCell>{product.name || 'N/A'}</TableCell>
                                        <TableCell>{product.price || 'N/A'}</TableCell>
                                        <TableCell>{product.description || 'N/A'}</TableCell>
                                        <TableCell>
                                            {product.categoryId
                                                ? categories.find((cat) => cat.categoryId === product.categoryId)
                                                      ?.categoryName || 'Uncategorized'
                                                : 'Uncategorized'}
                                        </TableCell>
                                        <TableCell>
                                            {product.stock > 0 ? product.stock : 'Out of Stock'}
                                        </TableCell>
                                        <TableCell>
                                            {product.createdAt
                                                ? dayjs(product.createdAt).format('YYYY-MM-DD HH:mm:ss')
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {product.updatedAt
                                                ? dayjs(product.updatedAt).format('YYYY-MM-DD HH:mm:ss')
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                component={Link}
                                                to={`/editproduct/${product.productId}`}
                                                color="primary"
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => deleteProduct(product.productId, product.name)}
                                                color="error"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </Box>
        </Box>
    );
}

export default AdminProducts;