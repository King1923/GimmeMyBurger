import React, { useContext } from 'react';
import { Box, Typography, Container, Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const ClientFooter = () => {
  const { user } = useContext(UserContext);

  const logout = () => {
    localStorage.clear();
    window.location = '/';
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#000000', // black color
        color: 'orange', // Orange color
        py: 4,
        mt: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Top Section: Navigation & Social Media */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          {/* Brand & Navigation Links */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
              mb: { xs: 2, md: 0 },
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Gimme My Burger
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button component={Link} to="/promotions" sx={{ color: 'darkgoldenrod' }}>
                Home
              </Button>
              <Button component={Link} to="/menu" sx={{ color: 'darkgoldenrod' }}>
                Menu
              </Button>
              <Button component={Link} to="/deals" sx={{ color: 'darkgoldenrod' }}>
                Deals
              </Button>
              <Button component={Link} to="/storelocator" sx={{ color: 'darkgoldenrod' }}>
                Locations
              </Button>
            </Box>
          </Box>

          {/* Social Media Icons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              component="a"
              href="https://facebook.com"
              target="_blank"
              sx={{ color: 'darkgoldenrod' }}
              aria-label="Facebook"
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://twitter.com"
              target="_blank"
              sx={{ color: 'darkgoldenrod' }}
              aria-label="Twitter"
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://instagram.com"
              target="_blank"
              sx={{ color: 'darkgoldenrod' }}
              aria-label="Instagram"
            >
              <InstagramIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Bottom Section: Copyright */}
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Gimme My Burger. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default ClientFooter;
