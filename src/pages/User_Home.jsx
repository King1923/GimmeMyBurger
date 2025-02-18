import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Modal, Fade, Backdrop } from '@mui/material';
import { AccessTime, Search, Clear } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';
import Gimmemyburgerpromo from '../assets/Gimmemyburgerpromo.jpg';

function Promotions() {
  const [promotionList, setPromotionList] = useState([]);
  const [search, setSearch] = useState('');
  const { user } = useContext(UserContext);

  // State for modal
  const [open, setOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [promoCode, setPromoCode] = useState('');

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

  // Function to generate a random promo code
  const generatePromoCode = () => {
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    const randomNumbers = Math.floor(100000 + Math.random() * 900000); // 6-digit number
    return `${randomLetter}${randomNumbers}`;
  };

  // Function to open modal and generate promo code
  const handleOpenModal = (promotion) => {
    setSelectedPromotion(promotion);
    setPromoCode(generatePromoCode());
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedPromotion(null);
  };

  return (
    <>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3, textAlign: 'center' }}>
        
        {/* Gimmemyburgerpromo Image */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <img
            src={Gimmemyburgerpromo}
            alt="Gimme My Burger Promotion"
            style={{
              width: '100%', 
              maxWidth: '800px', 
              height: 'auto', 
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          />
        </Box>

        {/* Title */}
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          You Might Like This
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
              <Card 
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }} 
                onClick={() => handleOpenModal(promotion)}
              >
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
                  <Typography sx={{ fontSize: '0.875rem', whiteSpace: 'normal' }}>
                    {promotion.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Promotion Details Modal */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 3, borderRadius: '10px', textAlign: 'center',
            maxHeight: '80vh', overflowY: 'auto' // Added scrolling for long descriptions
          }}>
            {selectedPromotion && (
              <>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {selectedPromotion.title}
                </Typography>
                <Box sx={{ width: '100%', mb: 2 }}>
                  <img
                    src={`${import.meta.env.VITE_FILE_BASE_URL}${selectedPromotion.imageFile}`}
                    alt="promotion"
                    style={{ width: '100%', borderRadius: '5px' }}
                  />
                </Box>
                <Typography sx={{ mb: 2, whiteSpace: 'normal' }}>
                  {selectedPromotion.description}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'red' }}>
                  Promo Code: {promoCode}
                </Typography>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default Promotions;
