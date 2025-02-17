import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, IconButton, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';
import ClientFooter from '../client/ClientFooter';

function UserCart() {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const { user } = useContext(UserContext);

    const getCartItems = () => {
        http.get('/cart').then((res) => {
            setCartItems(res.data.filter(item => item.userId === user?.id));
            calculateTotal(res.data.filter(item => item.userId === user?.id));
        });
    };

    // Calculate total price of cart
    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    // Remove item from cart
    const removeItem = (itemId) => {
        http.delete(`/cart/${itemId}`).then(() => {
            getCartItems();
        });
    };

    useEffect(() => {
        getCartItems();
    }, []);

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Your Cart
            </Typography>

            <Grid container spacing={2}>
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <Grid item xs={12} md={6} lg={4} key={item.id}>
                            <Card>
                                <Box className="aspect-ratio-container">
                                    <img
                                        alt={item.name}
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${item.imageFile}`}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </Box>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        {item.name}
                                    </Typography>
                                    <Typography sx={{ mb: 1 }} color="text.secondary">
                                        Category: {item.category}
                                    </Typography>
                                    <Typography sx={{ mb: 1 }} color="text.secondary">
                                        Price: ${item.price.toFixed(2)}
                                    </Typography>
                                    <Typography sx={{ mb: 1 }} color="text.secondary">
                                        Quantity: {item.quantity}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <IconButton
                                            color="error"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" sx={{ mt: 2, textAlign: 'center', width: '100%' }}>
                        Your cart is empty.
                    </Typography>
                )}
            </Grid>

            {cartItems.length > 0 && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Total: ${totalPrice.toFixed(2)}</Typography>
                    <Button variant="contained" color="primary">
                        Proceed to Checkout
                    </Button>
                </Box>
            )}
            <ClientFooter/>
        </Box>
    );
}

export default UserCart;