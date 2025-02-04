import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';
import AdminSidebar from '../admin/AdminSideBar'; // Import the admin sidebar

function Inventory() {
    const [inventoryList, setInventoryList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getInventory = () => {
        http.get('/inventory')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setInventoryList(res.data); // Directly set if it's an array
                } else if (res.data && Array.isArray(res.data.inventory)) {
                    setInventoryList(res.data.inventory); // Handle nested arrays
                } else {
                    setInventoryList([]); // Fallback to an empty array if no valid data
                }
            })
            .catch((err) => {
                console.error('Error fetching inventory:', err);
                setInventoryList([]); // Prevent errors by setting an empty array on failure
            });
    };
    

    const searchInventory = () => {
        http.get(`/inventory?search=${search}`).then((res) => {
            setInventoryList(res.data);
        });
    };

    useEffect(() => {
        getInventory();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchInventory();
        }
    };

    const onClickSearch = () => {
        searchInventory();
    };

    const onClickClear = () => {
        setSearch('');
        getInventory();
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Inventory
                </Typography>

                {/* Search Bar */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Input
                        value={search}
                        placeholder="Search by item name or quantity"
                        onChange={onSearchChange}
                        onKeyDown={onSearchKeyDown}
                    />
                    <IconButton color="primary" onClick={onClickSearch}>
                        <Search />
                    </IconButton>
                    <IconButton color="primary" onClick={onClickClear}>
                        <Clear />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Link to="/addinventory">
                        <Button variant="contained">Add</Button>
                    </Link>
                </Box>

                {/* Inventory List */}
                <Grid container spacing={2}>
                    {inventoryList.map((inventory) => (
                        <Grid item xs={12} md={6} lg={4} key={inventory.itemId}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                            {inventory.item}
                                        </Typography>
                                        <Link to={`/editinventory/${inventory.id}`}>
                                            <IconButton color="primary" sx={{ padding: '4px' }}>
                                                <Edit />
                                            </IconButton>
                                        </Link>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                        <AccessTime sx={{ mr: 1 }} />
                                        <Typography>
                                            {dayjs(inventory.createdAt).format(global.datetimeFormat)}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                        {inventory.description}
                                    </Typography>
                                    <Typography sx={{ mt: 1 }}>
                                        <strong>Quantity:</strong> {inventory.quantity}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

export default Inventory;
