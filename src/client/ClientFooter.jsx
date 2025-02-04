import { Box, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../contexts/UserContext';

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
        backgroundColor: '#1D0200', // Dark brown color
        color: 'darkgoldenrod', // Dark yellow color
        padding: '20px 0',
        marginTop: 'auto',
        textAlign: 'center',
      }}
    >
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <Typography>Home</Typography>
          <Link to="/menu" style={{ textDecoration: 'none', color: 'orange', marginRight: '15px' }}>
            <Typography>Menu</Typography>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default ClientFooter;