import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Input,
  IconButton,
  Button,
} from '@mui/material';
import {
  AccessTime,
  Search,
  Clear,
  Edit,
  Add,
  Remove,
} from '@mui/icons-material';
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
    http.get('/inventory').then((res) => {
      setInventoryList(res.data);
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
    if (e.key === 'Enter') {
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

  // Handler to update quantity and persist changes to the database
  const updateQuantity = (inventoryId, amount) => {
    // Find the item in local state
    const itemToUpdate = inventoryList.find((item) => item.id === inventoryId);
    if (!itemToUpdate) return;

    // Calculate the new quantity (not allowing negative values)
    const newQuantity = Math.max(0, itemToUpdate.quantity + amount);

    // Create the updated payload. (Include the current item name as required by your API)
    const updatedInventory = {
      Item: itemToUpdate.item,
      Quantity: newQuantity,
    };

    // Send a PUT request to update the inventory in the database
    http.put(`/inventory/${inventoryId}`, updatedInventory)
      .then((res) => {
        // On success, update the local state with the new quantity
        setInventoryList((prevList) =>
          prevList.map((item) =>
            item.id === inventoryId ? { ...item, quantity: newQuantity } : item
          )
        );
      })
      .catch((error) => {
        console.error("Error updating inventory:", error);
        // Optionally, you can notify the user or revert local changes here
      });
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
          {Array.isArray(inventoryList) && inventoryList.length > 0 ? (
            inventoryList.map((inventory) => (
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
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                      {inventory.description}
                    </Typography>

                    {/* Quantity Controls */}
                    <Box
                      sx={{
                        mt: 2,
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ mr: 1, fontWeight: 'bold' }}>
                        Quantity: {inventory.quantity}
                      </Typography>

                      {/* Increment & Decrement Buttons */}
                      <IconButton onClick={() => updateQuantity(inventory.id, 1)} size="small">
                        <Add fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => updateQuantity(inventory.id, -1)} size="small">
                        <Remove fontSize="small" />
                      </IconButton>

                      {/* Buttons to change quantity by 50 */}
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => updateQuantity(inventory.id, 50)}
                      >
                        +50
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => updateQuantity(inventory.id, -50)}
                      >
                        -50
                      </Button>

                      {/* Buttons to change quantity by 100 */}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => updateQuantity(inventory.id, 100)}
                      >
                        +100
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => updateQuantity(inventory.id, -100)}
                      >
                        -100
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No inventory items found.</Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default Inventory;
