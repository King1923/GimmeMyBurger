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
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import http from '../http';
import ClientNavbar from '../client/ClientNavBar';
import ClientFooter from '../client/ClientFooter';
import { Link } from 'react-router-dom'; // Make sure Link is imported

function UserMenu() {
    const [productList, setProductList] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [categories, setCategories] = useState([]);
    const [filter, setFilter] = useState('name-asc'); // State for sorting filter

    // Fetch categories from the API
    const getCategories = async () => {
        try {
            const res = await http.get('/category');
            setCategories([{ categoryName: 'All' }, ...res.data]);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Fetch products and ensure dateAdded is set
    const getProducts = async () => {
        try {
            const queryParams = [];
            if (category !== 'All') queryParams.push(`category=${encodeURIComponent(category)}`);
            if (search) queryParams.push(`search=${encodeURIComponent(search)}`);

            const url = `/product${queryParams.length > 0 ? `?${queryParams.join('&')}` : ''}`;
            const res = await http.get(url);

            const selectedCategoryObj = categories.find(
                (cat) => cat.categoryName.toLowerCase().trim() === category.toLowerCase().trim()
            );

            if (!selectedCategoryObj && category !== 'All') {
                console.error('Selected category not found.');
                setProductList([]);
                return;
            }

            const filteredProducts = res.data
                .filter((product) => category === 'All' || product.categoryId === selectedCategoryObj?.categoryId)
                .map((product) => ({
                    ...product,
                    dateAdded: product.dateAdded ?? new Date().toISOString()
                }));

            setProductList(filteredProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Filtering logic
    const applyFilter = (items, filter) => {
        switch (filter) {
            case 'name-asc':
                return [...items].sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return [...items].sort((a, b) => b.name.localeCompare(a.name));
            case 'price-asc':
                return [...items].sort((a, b) => a.price - b.price);
            case 'price-desc':
                return [...items].sort((a, b) => b.price - a.price);
            case 'newest':
                return [...items].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            case 'oldest':
                return [...items].sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
            default:
                return items;
        }
    };

    const handleCategoryClick = (selectedCategory) => {
        setCategory(selectedCategory);
        setSearch('');
    };

    useEffect(() => {
        getCategories();
        getProducts();
    }, []);

    useEffect(() => {
        getProducts();
    }, [category, search]);

    return (
        <Box>
            <ClientNavbar />
            <Typography variant="h5" sx={{ my: 2, textAlign: 'center' }}>
                Gimme My Burger Menu
            </Typography>

            <Box sx={{ display: 'flex', mb: 2 }}>
                {/* Category List */}
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
                    {/* Search Bar */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
                        <Input
                            value={search}
                            placeholder="Search for products..."
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && getProducts()}
                        />
                        <IconButton color="primary" onClick={getProducts}>
                            <Search />
                        </IconButton>
                        <IconButton color="primary" onClick={() => { setSearch(''); getProducts(); }}>
                            <Clear />
                        </IconButton>
                    </Box>

                    {/* Sorting Dropdown */}
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

                    {/* Render Products */}
                    <Grid container spacing={2}>
                        {applyFilter(productList, filter).map((product) => (
                            <Grid item xs={12} md={6} lg={4} key={product.id}>
                                <Card>
                                    {product.imageFile && (
                                        <Box sx={{ textAlign: 'center' }}>
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