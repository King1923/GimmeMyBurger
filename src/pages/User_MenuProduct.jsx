import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../http';
import ClientNavbar from '../client/ClientNavBar';
import ClientFooter from '../client/ClientFooter';

function MenuProduct() {
    const { productId } = useParams(); // Get product ID from the URL
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]); // Store category data
    const [categoryName, setCategoryName] = useState('Unknown'); // Store matched category name

    // Fetch product details from the server
    const getProduct = async () => {
        try {
            const res = await http.get(`/product/${productId}`);
            setProduct(res.data);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    // Fetch categories from the server
    const getCategories = async () => {
        try {
            const res = await http.get('/category');
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Find and set category name based on categoryId
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
                {/* Back Button */}
                <Button onClick={() => navigate('/menu')} variant="contained" sx={{ mb: 2 }}>
                    Back
                </Button>

                <Card sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        {/* Image on the left */}
                        {product.imageFile && (
                            <Grid item xs={12} sm={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <img
                                    alt={product.name}
                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`}
                                    style={{
                                        width: '320px',
                                        maxWidth: '500px',
                                        height: '250px',
                                        border: '5px solid black', // Set black border with 5px width
                                        borderRadius: '8px'
                                    }}
                                />
                            </Grid>
                        )}

                        {/* Product details on the right */}
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
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
            <ClientFooter />
        </Box>
    );
}

export default MenuProduct;
