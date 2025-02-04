import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccessTime, Search, Clear, Edit, Add } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';
import AdminSidebar from '../admin/AdminSideBar';  // Import the sidebar component

function AdminPromotions() {
  const [promotionList, setPromotionList] = useState([]);
  const [search, setSearch] = useState('');
  const { user } = useContext(UserContext);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getPromotions = () => {
    http.get('/promotion')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setPromotionList(res.data);
        } else if (res.data && Array.isArray(res.data.promotions)) {
          setPromotionList(res.data.promotions);
        } else {
          setPromotionList([]);
        }
      })
      .catch(() => setPromotionList([]));
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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          Promotions
        </Typography>

        {/* Search Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Input
            fullWidth
            value={search}
            placeholder="Search"
            onChange={onSearchChange}
            onKeyDown={onSearchKeyDown}
            sx={{ mr: 1 }}
          />
          <IconButton color="primary" onClick={onClickSearch}>
            <Search />
          </IconButton>
          <IconButton color="primary" onClick={onClickClear}>
            <Clear />
          </IconButton>
          <Link to="/addpromotion" style={{ marginLeft: 'auto' }}>
            <Button variant="contained" startIcon={<Add />}>
              Add Promotion
            </Button>
          </Link>
        </Box>

        {/* Promotions List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {promotionList.length > 0 ? (
            promotionList.map((promotion) => (
              <Card key={promotion.id} sx={{ width: '100%' }}>
                {promotion.imageFile && (
                  <Box
                    sx={{
                      width: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: '#e0e0e0',
                      aspectRatio: '1',
                    }}
                  >
                    <img
                      alt="promotion"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${promotion.imageFile}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
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
            ))
          ) : (
            <Typography>No promotions available.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default AdminPromotions;
