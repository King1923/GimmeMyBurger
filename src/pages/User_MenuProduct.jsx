import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useParams } from 'react-router-dom';
import http from '../http';
import ClientNavbar from '../client/ClientNavBar';
import ClientFooter from '../client/ClientFooter';

function MenuProduct() {
    const { productId } = useParams(); // Get product ID from the URL
    const [product, setProduct] = useState(null);

    // Fetch product details from the server
    const getProduct = async () => {
        try {
            const res = await http.get(`/product/${productId}`);
            setProduct(res.data);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    useEffect(() => {
        getProduct();
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
            <Box sx={{ my: 4, px: 2 }}>
                <Card sx={{ maxWidth: 800, mx: 'auto' }}>
                    {product.imageFile && (
                        <Box className="aspect-ratio-container" sx={{ textAlign: 'center' }}>
                            <img
                                alt={product.name}
                                src={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`}
                                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                            />
                        </Box>
                    )}
                    <CardContent>
                        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
                            {product.name}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
                            Category: {product.category}
                        </Typography>
                        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
                            ${product.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', textAlign: 'justify', mx: 2 }}>
                            {product.description}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            <ClientFooter />
        </Box>
    );
}

export default MenuProduct;