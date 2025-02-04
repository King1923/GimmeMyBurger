import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit, Add } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

// Import the navbar and footer components
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
        console.log('API Response:', res.data); // Check the structure of the response
        if (Array.isArray(res.data)) {
          setPromotionList(res.data); // If it's an array, set it directly
        } else if (res.data && Array.isArray(res.data.promotions)) {
          setPromotionList(res.data.promotions); // Handle nested arrays if needed
        } else {
          setPromotionList([]); // Set an empty array if no valid data
        }
      })
      .catch((error) => {
        console.error('Error fetching promotions:', error);
        setPromotionList([]); // Prevent errors if the API call fails
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
      {/* Render the Client Navbar at the top */}
      <ClientNavbar />

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // Adjust the minHeight if necessary to account for the navbar/footer heights
          minHeight: 'calc(100vh - 96px - 64px)', 
          px: 2,
          py: 2,
        }}
      >
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
          <Link to="/addpromotion" style={{ marginLeft: 'auto' }}>
            <Button variant="contained" startIcon={<Add />}>
              Add Promotion
            </Button>
          </Link>
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

      {/* Render the Client Footer at the bottom */}
      <ClientFooter />
    </>
  );
}

export default Promotions;
