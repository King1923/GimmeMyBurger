import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Input,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Button
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import http from '../http';
import ClientFooter from '../client/ClientFooter';
import { Link } from 'react-router-dom'; // Make sure Link is imported

function UserMenu() {
    const [productList, setProductList] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [categories, setCategories] = useState([]); // Categories fetched from the database

    // Fetch categories from the API
    const getCategories = async () => {
        try {
            const res = await http.get('/category');
            setCategories([{ categoryName: 'All' }, ...res.data]); // Add "All" category to the list
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Fetch products based on search and category
    const getProducts = async () => {
        try {
            // Construct query params for API call
            const queryParams = [];
            if (category !== 'All') queryParams.push(`category=${encodeURIComponent(category)}`);
            if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
    
            const url = `/product${queryParams.length > 0 ? `?${queryParams.join('&')}` : ''}`;
            const res = await http.get(url);
    
            console.log("Fetched Products:", res.data);  // Debugging line
            console.log("Selected Category:", category); // Debugging line
    
            // Find the matching category object
            const selectedCategoryObj = categories.find(
                (cat) => cat.categoryName.toLowerCase().trim() === category.toLowerCase().trim()
            );
    
            if (!selectedCategoryObj && category !== "All") {
                console.error("Selected category not found in category list.");
                setProductList([]); // Avoid showing incorrect data
                return;
            }
    
            // Filter products by category ID (if backend does not handle this)
            const filteredProducts = res.data.filter((product) =>
                category === "All" || product.categoryId === selectedCategoryObj.categoryId
            );
    
            console.log("Filtered Products:", filteredProducts);  // Debugging line
            setProductList(filteredProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleCategoryClick = (selectedCategory) => {
        setCategory(selectedCategory);
        setSearch(''); // Clear search when category is changed
    };

    useEffect(() => {
        getCategories(); // Fetch categories on mount
        getProducts(); // Fetch products on mount
    }, []);

    useEffect(() => {
        getProducts(); // Trigger fetching products when category or search changes
    }, [category, search]);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const onSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            getProducts();
        }
    };

    const onClickSearch = () => {
        getProducts();
    };

    const onClickClear = () => {
        setSearch('');
        getProducts();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2, textAlign: 'center' }}>
                Gimme My Burger Menu
            </Typography>

            <Box sx={{ display: 'flex', mb: 2 }}>
                {/* Category Legend */}
                <Box sx={{ width: '20%', pr: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Categories
                    </Typography>
                    <List>
                        {categories.map((cat) => (
                            <ListItem key={cat.categoryName} disablePadding>
                                <ListItemButton
                                    selected={category === cat.categoryName}
                                    onClick={() => handleCategoryClick(cat.categoryName)}
                                >
                                    <ListItemText primary={cat.categoryName} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* Product List */}
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
                        <Input
                            value={search}
                            placeholder="Search for products..."
                            onChange={onSearchChange}
                            onKeyDown={onSearchKeyDown}
                        />
                        <IconButton color="primary" onClick={onClickSearch}>
                            <Search />
                        </IconButton>
                        <IconButton color="primary" onClick={onClickClear}>
                            <Clear />
                        </IconButton>
                    </Box>

                    <Grid container spacing={2}>
                        {productList.map((product) => (
                            <Grid item xs={12} md={6} lg={4} key={product.id}>
                                <Card>
                                    {product.imageFile && (
                                        <Box className="aspect-ratio-container" sx={{ textAlign: 'center' }}>
                                            <img
                                                alt={product.name}
                                                src={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`}
                                                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                                            />
                                        </Box>
                                    )}
                                    <CardContent>
                                        <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 1 }}>
                                            {product.category}
                                        </Typography>
                                        <Typography variant="body1" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 1 }}>
                                            ${product.price.toFixed(2)}
                                        </Typography>
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', textAlign: 'center', mb: 2 }}>
                                            {product.description}
                                        </Typography>
                                        
                                        {/* Add to Cart Button */}
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Link to={`/product/${product.productId}`} style={{ textDecoration: 'none' }}>
                                                <Button variant="contained" color="primary">
                                                    Add to Cart
                                                </Button>
                                            </Link>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>

            <ClientFooter />
        </Box>
    );
}

export default UserMenu;