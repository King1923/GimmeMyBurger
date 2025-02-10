import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../http';
import ClientNavbar from '../client/ClientNavBar';
import ClientFooter from '../client/ClientFooter';
import UserContext from '../contexts/UserContext';

function MenuProduct() {
    const { productId } = useParams(); // Get product ID from the URL
    const navigate = useNavigate();
    const { user } = useContext(UserContext); // Get logged-in user data
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('Unknown');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Fetch product details
    const getProduct = async () => {
        try {
            const res = await http.get(`/product/${productId}`);
            setProduct(res.data);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    // Fetch categories
    const getCategories = async () => {
        try {
            const res = await http.get('/category');
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        if (product && categories.length > 0) {
            const matchedCategory = categories.find(cat => cat.categoryId === product.categoryId);
            setCategoryName(matchedCategory ? matchedCategory.categoryName : 'Unknown');
        }
    }, [product, categories]);

    useEffect(() => {
        getProduct();
        getCategories();
    }, [productId]);

    // Function to add product to cart
    const handleAddToCart = async () => {
        if (!user) {
            alert("Please log in to add items to the cart.");
            return;
        }
    
        try {
            const response = await http.post("/cart", {
                productId: product.productId,
                quantity: 1, // Default quantity as 1
            });
    
            setOpenSnackbar(true); // Show success message
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    };

    if (!product) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6">Loading product details...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <ClientNavbar />
            <Box sx={{ my: 4, px: 2, maxWidth: 800, mx: 'auto' }}>
                <Button onClick={() => navigate('/menu')} variant="contained" sx={{ mb: 2 }}>
                    Back
                </Button>

                <Card sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        {product.imageFile && (
                            <Grid item xs={12} sm={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <img
                                    alt={product.name}
                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`}
                                    style={{
                                        width: '320px',
                                        maxWidth: '500px',
                                        height: '250px',
                                        border: '5px solid black',
                                        borderRadius: '8px'
                                    }}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} sm={7}>
                            <CardContent>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {product.name}
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                    Category: {categoryName}
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    ${product.price.toFixed(2)}
                                </Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', textAlign: 'justify' }}>
                                    {product.description}
                                </Typography>

                                {/* Add to Cart Button */}
                                <Button
                                    onClick={handleAddToCart}
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                >
                                    Add to Cart
                                </Button>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            </Box>

            <ClientFooter />

            {/* Snackbar Notification */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success">
                    Item added to cart successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}
export default MenuProduct;