import React, { useEffect, useState, useContext } from 'react';
import { 
    Box, Typography, Grid, Card, CardContent, IconButton, 
    Button, Snackbar, Alert, Collapse, FormControl, InputLabel, 
    Select, MenuItem 
} from "@mui/material";
import { Delete, ExpandMore, ExpandLess, Add, Remove } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';
import ClientNavbar from '../client/ClientNavBar';
import ClientFooter from '../client/ClientFooter';


function UserCart() {
    const { user } = useContext(UserContext);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [expandedItems, setExpandedItems] = useState({});
    const [filter, setFilter] = useState("name-asc"); // Filter state

    useEffect(() => {
        if (user) {
            getCartItems();
        }
    }, [user]);

    const getCartItems = async () => {
        try {
            const res = await http.get("/cart");
            const filteredItems = res.data;

            const updatedItems = filteredItems.map(item => ({
                ...item,
                quantity: item.quantity ?? 1,
                price: item.price ?? 0,  
                totalAmount: item.totalAmount ?? ((item.quantity ?? 1) * (item.price ?? 0)),
                category: item.category?.categoryName ?? "Unknown", 
                imageFile: item.imageFile ?? "",
                dateAdded: item.dateAdded ?? new Date().toISOString()  // Ensure dateAdded is set
            }));

            setCartItems(updatedItems);
            calculateTotal(updatedItems);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
        const itemCount = items.reduce((count, item) => count + (item.quantity || 0), 0);
        setTotalPrice(total);
        setTotalItems(itemCount);
    };

    const removeItem = async (cartId) => {
        try {
            await http.delete(`/cart/${cartId}`);
            setSnackbarMessage("Item removed from cart.");
            setOpenSnackbar(true);
            getCartItems();
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const toggleExpand = (cartId) => {
        setExpandedItems(prev => ({
            ...prev,
            [cartId]: !prev[cartId]
        }));
    };

    const updateQuantity = async (cartId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            await http.put(`/cart/${cartId}`, { quantity: newQuantity });

            setCartItems(prevItems => prevItems.map(item =>
                item.cartId === cartId ? { ...item, quantity: newQuantity, totalAmount: newQuantity * item.price } : item
            ));

            calculateTotal(cartItems.map(item =>
                item.cartId === cartId ? { ...item, quantity: newQuantity, totalAmount: newQuantity * item.price } : item
            ));
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    // Filter function
    const applyFilter = (items, filter) => {
        switch (filter) {
            case "name-asc":
                return [...items].sort((a, b) => a.productName.localeCompare(b.productName));
            case "name-desc":
                return [...items].sort((a, b) => b.productName.localeCompare(a.productName));
            case "price-asc":
                return [...items].sort((a, b) => a.price - b.price);
            case "price-desc":
                return [...items].sort((a, b) => b.price - a.price);
            case "newest":
                return [...items].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            case "oldest":
                return [...items].sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
            default:
                return items;
        }
    };

    const gstAmount = totalPrice * 0.09;
    const totalWithGST = totalPrice + gstAmount;

    return (
        <Box>
            <ClientNavbar />
            <Box sx={{ my: 4, px: 2, maxWidth: 800, mx: "auto" }}>
                <Typography variant="h5" sx={{ my: 2, fontWeight: "bold" }}>
                    Your Cart
                </Typography>

                {/* Filter Dropdown */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={filter}
                        label="Sort By"
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <MenuItem value="name-asc">Name: A-Z</MenuItem>
                        <MenuItem value="name-desc">Name: Z-A</MenuItem>
                        <MenuItem value="price-asc">Price: Low to High</MenuItem>
                        <MenuItem value="price-desc">Price: High to Low</MenuItem>
                        <MenuItem value="newest">Newest Added</MenuItem>
                        <MenuItem value="oldest">Oldest Added</MenuItem>
                    </Select>
                </FormControl>

                {cartItems.length > 0 ? (
                    <Grid container spacing={2}>
                        {applyFilter(cartItems, filter).map((item) => (
                            <Grid item xs={12} key={item.cartId}>
                                <Card sx={{ display: "flex", flexDirection: "column", p: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        {/* Product Image */}
                                        {item.imageFile && (
                                            <Box
                                                sx={{
                                                    width: "120px",
                                                    height: "120px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    mr: 2,
                                                    border: "1px solid #ccc",
                                                    borderRadius: "8px",
                                                    overflow: "hidden"
                                                }}
                                            >
                                                <img
                                                    alt={item.productName}
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${item.imageFile}`}
                                                    style={{ width: "100%", height: "auto" }}
                                                />
                                            </Box>
                                        )}

                                        {/* Product Details */}
                                        <CardContent sx={{ flex: 1 }}>
                                            <Typography variant="h6">{item.productName}</Typography>

                                            {/* View More Button */}
                                            <Button
                                                onClick={() => toggleExpand(item.cartId)}
                                                endIcon={expandedItems[item.cartId] ? <ExpandLess /> : <ExpandMore />}
                                                sx={{ textTransform: "none", mt: 1 }}
                                            >
                                                View More
                                            </Button>

                                            <Collapse in={expandedItems[item.cartId]} timeout="auto" unmountOnExit>
                                                <Typography sx={{ mt: 1 }}>Category: {item.category}</Typography>
                                            </Collapse>
                                        </CardContent>

                                        {/* Quantity & Price */}
                                        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                                            <IconButton onClick={() => updateQuantity(item.cartId, item.quantity - 1)} size="small">
                                                <Remove />
                                            </IconButton>
                                            <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                            <IconButton onClick={() => updateQuantity(item.cartId, item.quantity + 1)} size="small">
                                                <Add />
                                            </IconButton>
                                            <Typography sx={{ fontWeight: "bold", ml: 2 }}>
                                                ${Number(item.price).toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Delete Button */}
                                    <IconButton
                                        onClick={() => removeItem(item.cartId)}
                                        color="error"
                                        sx={{ alignSelf: "flex-end", mt: 1 }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography sx={{ textAlign: "center", mt: 4 }}>
                        Your cart is empty.
                    </Typography>
                )}

                {/* Total Price Container */}
                <Box sx={{ mt: 4, p: 2, border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                    <Typography variant="h6">Cart Summary</Typography>
                    <Typography sx={{ mt: 1 }}>Total Items: <strong>{totalItems}</strong></Typography>
                    <Typography sx={{ mt: 1 }}>Subtotal: <strong>${totalPrice.toFixed(2)}</strong></Typography>
                    <Typography sx={{ mt: 1 }}>GST Included (9%): <strong>${gstAmount.toFixed(2)}</strong></Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>Total: <strong>${totalWithGST.toFixed(2)}</strong></Typography>

                    {/* Proceed to Checkout Button */}
                    <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        sx={{ mt: 2 }}
                    >
                        Proceed to Checkout
                    </Button>
                </Box>

                {/* Snackbar Notification */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={() => setOpenSnackbar(false)}
                >
                    <Alert onClose={() => setOpenSnackbar(false)} severity="success">
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
            <ClientFooter />
        </Box>
    );
}

export default UserCart;