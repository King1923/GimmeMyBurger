import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Button, 
  TextField 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import http from '../http';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageAddresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for editing and adding forms
  const [editingData, setEditingData] = useState(null);
  const [addingData, setAddingData] = useState(null);

  // Retrieve userId from localStorage (set during login)
  const storedUserId = localStorage.getItem('userId');
  const userId = storedUserId ? parseInt(storedUserId) : 0;

  // Function to fetch addresses for the user using the AddressController endpoint.
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await http.get('/Address');
      // Filter addresses for the logged-in user.
      const userAddresses = Array.isArray(response.data)
        ? response.data.filter(addr => addr.userId === userId)
        : [];
      setAddresses(userAddresses);
    } catch (error) {
      toast.error("Failed to fetch addresses.");
      console.error("Error fetching addresses:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  // Opens inline form for editing an existing address.
  const handleEdit = (address) => {
    // Clear the add form if active.
    setAddingData(null);
    setEditingData({ ...address }); // Make a copy of the address for editing
  };

  // Handles saving the edited address with a payload that matches the API's expected property names.
  const handleSaveEdit = async () => {
    try {
      // Construct payload with PascalCase keys
      const payload = {
        Id: editingData.id, // or editingData.Id if already defined
        BlockNumber: editingData.blockNumber,
        StreetName: editingData.streetName,
        UnitNumber: editingData.unitNumber,
        PostalCode: editingData.postalCode,
        // Include UserId if required: UserId: editingData.userId,
      };

      await http.put(`/Address/${editingData.id}`, payload);
      toast.success("Address updated successfully.");
      setEditingData(null);
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to update address.");
      console.error("Error updating address:", error);
    }
  };

  // Cancel inline editing.
  const handleCancelEdit = () => {
    setEditingData(null);
  };

  // Update editingData fields when inputs change.
  const handleEditInputChange = (e) => {
    setEditingData({
      ...editingData,
      [e.target.name]: e.target.value,
    });
  };

  // Opens inline form for adding a new address.
  const handleAddNew = () => {
    // Clear the edit form if active.
    setEditingData(null);
    setAddingData({
      blockNumber: "",
      streetName: "",
      unitNumber: "",
      postalCode: ""
    });
  };

  // Handles saving the new address.
  const handleSaveAdd = async () => {
    try {
      await http.post('/Address', addingData);
      toast.success("Address added successfully.");
      setAddingData(null);
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to add address.");
      console.error("Error adding address:", error);
    }
  };

  // Cancel adding a new address.
  const handleCancelAdd = () => {
    setAddingData(null);
  };

  // Update addingData fields when inputs change.
  const handleAddInputChange = (e) => {
    setAddingData({
      ...addingData,
      [e.target.name]: e.target.value,
    });
  };

  // Handles deleting an address.
  const handleDelete = async (addressId) => {
    // Optionally ask for confirmation before deleting
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await http.delete(`/Address/${addressId}`);
        toast.success("Address deleted successfully.");
        fetchAddresses();
      } catch (error) {
        toast.error("Failed to delete address.");
        console.error("Error deleting address:", error);
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 4 }}>
      <Grid container spacing={4}>
        {/* LEFT SIDEBAR */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            ACCOUNT
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography 
              sx={{ mb: 2, cursor: 'pointer' }}
              onClick={() => navigate(`/editprofile/${userId}`)}
            >
              Profile
            </Typography>
            <Typography 
              sx={{ mb: 2, cursor: 'pointer' }}
              onClick={() => navigate('/settings')}
            >
              Settings
            </Typography>
            <Typography 
              sx={{ mb: 2, cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => navigate('/manage-addresses')}
            >
              Addresses
            </Typography>
            <Typography 
              sx={{ mb: 2, cursor: 'pointer' }}
              onClick={() => navigate(`/change-password/${userId}`)}
            >
              Reset Password
            </Typography>
            <Typography 
              sx={{ mb: 2, cursor: 'pointer' }}
              onClick={() => navigate('/delete-account')}
            >
              Delete Account
            </Typography>
          </Box>
        </Grid>

        {/* MAIN CONTENT AREA */}
        <Grid item xs={12} md={9}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Saved Addresses
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {addresses.length === 0 ? (
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  You have no saved addresses.
                </Typography>
              ) : (
                <List>
                  {addresses.map((address) => (
                    <ListItem
                      key={address.id}
                      secondaryAction={
                        <Box>
                          <IconButton edge="end" onClick={() => handleEdit(address)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" onClick={() => handleDelete(address.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText 
                        primary={
                          <>
                            <Typography variant="body1">
                              <strong>Block Number:</strong> {address.blockNumber}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Street Name:</strong> {address.streetName}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Unit Number:</strong> {address.unitNumber}
                            </Typography>
                          </>
                        }
                        secondary={
                          <Typography variant="body2">
                            <strong>Postal Code:</strong> {address.postalCode}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              {/* "Add Address" Button */}
              {!addingData && (
                <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddNew}>
                  Add Address
                </Button>
              )}

              {/* Inline Editing Form */}
              {editingData && (
                <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Edit Address
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Block Number"
                        name="blockNumber"
                        value={editingData.blockNumber || ""}
                        onChange={handleEditInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Street Name"
                        name="streetName"
                        value={editingData.streetName || ""}
                        onChange={handleEditInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Unit Number"
                        name="unitNumber"
                        value={editingData.unitNumber || ""}
                        onChange={handleEditInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Postal Code"
                        name="postalCode"
                        value={editingData.postalCode || ""}
                        onChange={handleEditInputChange}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    <Button variant="contained" sx={{ mr: 2 }} onClick={handleSaveEdit}>
                      Save
                    </Button>
                    <Button variant="outlined" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Inline Add Form */}
              {addingData && (
                <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Add Address
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Block Number"
                        name="blockNumber"
                        value={addingData.blockNumber || ""}
                        onChange={handleAddInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Street Name"
                        name="streetName"
                        value={addingData.streetName || ""}
                        onChange={handleAddInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Unit Number"
                        name="unitNumber"
                        value={addingData.unitNumber || ""}
                        onChange={handleAddInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Postal Code"
                        name="postalCode"
                        value={addingData.postalCode || ""}
                        onChange={handleAddInputChange}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    <Button variant="contained" sx={{ mr: 2 }} onClick={handleSaveAdd}>
                      Save
                    </Button>
                    <Button variant="outlined" onClick={handleCancelAdd}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}

            </Box>
          )}
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
};

export default ManageAddresses;
