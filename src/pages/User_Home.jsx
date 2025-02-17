import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccessTime, Search, Clear } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

// Import Navbar and Footer
import ClientNavbar from '../client/ClientNavbar';
import ClientFooter from '../client/ClientFooter';

function Promotions() {
  const [promotionList, setPromotionList] = useState([]);
  const [search, setSearch] = useState('');
  const { user } = useContext(UserContext);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getPromotions = () => {
    http.get('/promotion')
      .then((res) => {
        console.log('API Response:', res.data);
        if (Array.isArray(res.data)) {
          setPromotionList(res.data);
        } else if (res.data && Array.isArray(res.data.promotions)) {
          setPromotionList(res.data.promotions);
        } else {
          setPromotionList([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching promotions:', error);
        setPromotionList([]);
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
    <>
      {/* Navbar */}
      <ClientNavbar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 3 }}>
          Promotions
        </Typography>

        {/* Search Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <Input
            sx={{ width: '50%' }}
            value={search}
            placeholder="Search promotions"
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

        {/* Promotions Grid */}
        <Grid container spacing={2} justifyContent="center">
          {promotionList.map((promotion) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={promotion.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Promotion Image */}
                {promotion.imageFile && (
                  <Box sx={{ width: '100%', height: '150px', overflow: 'hidden', bgcolor: '#f5f5f5' }}>
                    <img
                      alt="promotion"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${promotion.imageFile}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                )}
                
                {/* Promotion Content */}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    {promotion.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1, color: 'text.secondary' }}>
                    <AccessTime sx={{ fontSize: '1rem', mr: 1 }} />
                    <Typography sx={{ fontSize: '0.875rem' }}>
                      {dayjs(promotion.createdAt).format(global.datetimeFormat)}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.875rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {promotion.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer */}
      <ClientFooter />
    </>
  );
}

export default Promotions;
