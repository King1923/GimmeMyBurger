import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit, Add } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Promotions() {
    const [promotionList, setPromotionList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getPromotions = () => {
        http.get('/promotion').then((res) => {
            setPromotionList(res.data);
        });
    };

    const searchPromotions = () => {
        http.get(`/promotion?search=${search}`).then((res) => {
            setPromotionList(res.data);
        });
    };

    useEffect(() => {
        getPromotions();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchPromotions();
        }
    };

    const onClickSearch = () => {
        searchPromotions();
    };

    const onClickClear = () => {
        setSearch('');
        getPromotions();
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', px: 2 }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Home
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%', maxWidth: '600px' }}>
                <Input
                    fullWidth
                    value={search}
                    placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
                {
                    (
                        <Link to="/addpromotion" style={{ marginLeft: 'auto' }}>
                            <Button variant="contained" startIcon={<Add />}>
                                Add Promotion
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                    maxWidth: '600px',
                }}
            >
                {promotionList.map((promotion) => (
                    <Card key={promotion.id} sx={{ width: '100%' }}>
                        {promotion.imageFile && (
                            <Box
                                sx={{
                                    width: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    backgroundColor: '#f5f5f5',
                                    aspectRatio: '1', // Ensures a 1:1 ratio (modern CSS approach)
                                }}
                            >
                                <img
                                    alt="promotion"
                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${promotion.imageFile}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover', // Ensures the image fills the container
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                    }}
                                />
                            </Box>
                        )}
                        <CardContent>
                            <Box sx={{ display: 'flex', mb: 1 }}>
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                    {promotion.title}
                                </Typography>
                                <Link to={`/editpromotion/${promotion.id}`}>
                                    <IconButton color="primary" sx={{ padding: '4px' }}>
                                        <Edit />
                                    </IconButton>
                                </Link>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                <AccessTime sx={{ mr: 1 }} />
                                <Typography>
                                    {dayjs(promotion.createdAt).format(global.datetimeFormat)}
                                </Typography>
                            </Box>
                            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                {promotion.description}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>


        </Box>
    );
}

export default Promotions;
