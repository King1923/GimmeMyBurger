import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid2 as Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Orders() {
    const [orderList, setOrderList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getOrders = () => {
        http.get('/order').then((res) => {
            setOrderList(res.data);
        });
    };

    const searchOrders = () => {
        http.get(`/order?search=${search}`).then((res) => {
            setOrderList(res.data);
        });
    };

    useEffect(() => {
        getOrders();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchOrders();
        }
    };

    const onClickSearch = () => {
        searchOrders();
    }

    const onClickClear = () => {
        setSearch('');
        getOrders();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Orders
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {
                    user && (
                        <Link to="/addorder">
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    orderList.map((order, i) => {
                        return (
                            <Grid size={{xs:12, md:6, lg:4}} key={order.id}>
                                <Card>
                                    {
                                        order.imageFile && (
                                            <Box className="aspect-ratio-container">
                                                <img alt="order"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${order.imageFile}`}>
                                                </img>
                                            </Box>
                                        )
                                    }
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {order.title}
                                            </Typography>
                                            {
                                                user && user.id === order.userId && (
                                                    <Link to={`/editorder/${order.id}`}>
                                                        <IconButton color="primary" sx={{ padding: '4px' }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Link>
                                                )
                                            }
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccountCircle sx={{ mr: 1 }} />
                                            <Typography>
                                                {order.user?.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>
                                                {dayjs(order.createdAt).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {order.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}

export default Orders;