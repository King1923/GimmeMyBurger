import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Checkbox,
  Button,
  TextField,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AdminSidebar from '../admin/AdminSideBar';
import http from '../http';
import { toast } from 'react-toastify';

const AllUsers = () => {
  // State declarations
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  // New filter states for substring matching
  const [filterId, setFilterId] = useState('');
  const [filterFName, setFilterFName] = useState('');
  const [filterLName, setFilterLName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterMobile, setFilterMobile] = useState('');
  // Inline editing states
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingData, setEditingData] = useState({});

  // Function to fetch all users and filter to only include customers (role === 0)
  const getUsers = () => {
    http.get('/User')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const customers = data.filter(user => user.role === 0);
        setUsers(customers);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        toast.error("Failed to fetch users.");
        setLoading(false);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Export users data to CSV (createdAt and updatedAt show only the date)
  const exportToCSV = () => {
    const header = ["ID", "First Name", "Last Name", "Email", "Mobile", "Date of Birth", "Created At", "Updated At"];
    const rows = users.map(user => [
      user.id,
      user.fName,
      user.lName,
      user.email,
      user.mobile,
      user.doB ? new Date(user.doB).toLocaleDateString() : "",
      user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "",
      user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : ""
    ]);
    let csvContent = "";
    csvContent += header.join(",") + "\n";
    rows.forEach(row => {
      csvContent += row.join(",") + "\n";
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Customer_Info.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle individual row selection
  const handleSelectOne = (event, id) => {
    if (event.target.checked) {
      setSelectedUserIds(prev => [...prev, id]);
    } else {
      setSelectedUserIds(prev => prev.filter(userId => userId !== id));
    }
  };

  // Handle select all checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = users.map(user => user.id);
      setSelectedUserIds(allIds);
    } else {
      setSelectedUserIds([]);
    }
  };

  // Delete user function for individual delete
  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      http.delete(`/User/admin/${userId}`)
        .then(() => {
          toast.success("User deleted successfully.");
          setUsers(users.filter(user => user.id !== userId));
          setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
        })
        .catch((err) => {
          console.error("Error deleting user:", err);
          toast.error("Failed to delete user.");
        });
    }
  };

  // Bulk delete for selected users
  const handleBulkDelete = () => {
    if (selectedUserIds.length === 0) {
      toast.info("No users selected.");
      return;
    }
    if (window.confirm("Are you sure you want to delete the selected users?")) {
      Promise.all(selectedUserIds.map(id => http.delete(`/User/admin/${id}`)))
        .then(() => {
          toast.success("Selected users deleted successfully.");
          getUsers();
          setSelectedUserIds([]);
        })
        .catch((err) => {
          console.error("Error deleting selected users:", err);
          toast.error("Failed to delete selected users.");
        });
    }
  };

  // Handle range selection (1-based)
  const handleSelectRange = () => {
    const start = parseInt(rangeStart, 10);
    const end = parseInt(rangeEnd, 10);
    if (isNaN(start) || isNaN(end) || start < 1 || end > users.length || start > end) {
      toast.error(`Invalid range. Please enter numbers between 1 and ${users.length} (and ensure start <= end).`);
      return;
    }
    const rangeIds = users.slice(start - 1, end).map(user => user.id);
    setSelectedUserIds(rangeIds);
    toast.success(`${rangeIds.length} users selected.`);
  };

  // Handle selection by criteria using substring matching
  const handleSelectByCriteria = () => {
    const filtered = users.filter(user => {
      const idMatch = filterId ? user.id.toString().includes(filterId.trim()) : true;
      const fNameMatch = filterFName ? user.fName.toLowerCase().includes(filterFName.trim().toLowerCase()) : true;
      const lNameMatch = filterLName ? user.lName.toLowerCase().includes(filterLName.trim().toLowerCase()) : true;
      const emailMatch = filterEmail ? user.email.toLowerCase().includes(filterEmail.trim().toLowerCase()) : true;
      const mobileMatch = filterMobile ? user.mobile.includes(filterMobile.trim()) : true;
      return idMatch && fNameMatch && lNameMatch && emailMatch && mobileMatch;
    });
    const criteriaIds = filtered.map(user => user.id);
    setSelectedUserIds(criteriaIds);
    toast.success(`${criteriaIds.length} users selected based on criteria.`);
  };

  // Inline editing functions
  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditingData({
      fName: user.fName,
      lName: user.lName,
      email: user.email,
      mobile: user.mobile
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingData({});
  };

  const handleSaveEdit = (userId) => {
    http.put(`/User/admin/${userId}`, editingData)
      .then(() => {
        toast.success("User updated successfully.");
        getUsers();
        setEditingUserId(null);
        setEditingData({});
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        toast.error("Failed to update user.");
      });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <AdminSidebar />
      <Typography variant="h4" gutterBottom>
        All Customers Information
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Customer Accounts (Total): {users.length}
      </Typography>
      
      {/* Bulk Delete, Range Selection, and Export Section */}
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleBulkDelete}
          disabled={selectedUserIds.length === 0}
        >
          Delete Selected ({selectedUserIds.length})
        </Button>
        <TextField
          label="Range From (index)"
          type="number"
          value={rangeStart}
          onChange={(e) => setRangeStart(e.target.value)}
          size="small"
        />
        <TextField
          label="Range To (index)"
          type="number"
          value={rangeEnd}
          onChange={(e) => setRangeEnd(e.target.value)}
          size="small"
        />
        <Button variant="outlined" onClick={handleSelectRange}>
          Select Range
        </Button>
        <Button variant="outlined" onClick={exportToCSV}>
          Export Data
        </Button>
      </Box>
      
      {/* Selection by Criteria Section (above the table) */}
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Filter ID"
          type="text"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
          size="small"
          sx={{ width: '90px' }}
        />
        <TextField
          label="Filter First Name"
          type="text"
          value={filterFName}
          onChange={(e) => setFilterFName(e.target.value)}
          size="small"
          sx={{ width: '150px' }}
        />
        <TextField
          label="Filter Last Name"
          type="text"
          value={filterLName}
          onChange={(e) => setFilterLName(e.target.value)}
          size="small"
          sx={{ width: '150px' }}
        />
        <TextField
          label="Filter Email"
          type="text"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
          size="small"
          sx={{ width: '220px' }}
        />
        <TextField
          label="Filter Mobile"
          type="text"
          value={filterMobile}
          onChange={(e) => setFilterMobile(e.target.value)}
          size="small"
          sx={{ width: '130px' }}
        />
        <Button variant="outlined" onClick={handleSelectByCriteria}>
          Select Matching
        </Button>
      </Box>
      
      <TableContainer
        component={Paper}
        sx={{ minWidth: 1390, maxHeight: 517, overflowY: 'auto' }}
      >
        <Table stickyHeader>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedUserIds.length > 0 && selectedUserIds.length < users.length}
                  checked={users.length > 0 && selectedUserIds.length === users.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>#</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUserIds.includes(user.id)}
                    onChange={(event) => handleSelectOne(event, user.id)}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  {editingUserId === user.id ? (
                    <TextField
                      name="fName"
                      value={editingData.fName}
                      onChange={handleEditChange}
                      size="small"
                    />
                  ) : (
                    user.fName
                  )}
                </TableCell>
                <TableCell>
                  {editingUserId === user.id ? (
                    <TextField
                      name="lName"
                      value={editingData.lName}
                      onChange={handleEditChange}
                      size="small"
                    />
                  ) : (
                    user.lName
                  )}
                </TableCell>
                <TableCell>
                  {editingUserId === user.id ? (
                    <TextField
                      name="email"
                      value={editingData.email}
                      onChange={handleEditChange}
                      size="small"
                    />
                  ) : (
                    user.email
                  )}
                </TableCell>
                <TableCell>
                  {editingUserId === user.id ? (
                    <TextField
                      name="mobile"
                      value={editingData.mobile}
                      onChange={handleEditChange}
                      size="small"
                    />
                  ) : (
                    user.mobile
                  )}
                </TableCell>
                <TableCell>
                  {user.doB ? new Date(user.doB).toLocaleDateString() : ''}
                </TableCell>
                <TableCell>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                </TableCell>
                <TableCell>
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : ''}
                </TableCell>
                <TableCell align="center">
                  {editingUserId === user.id ? (
                    <>
                      <IconButton
                        color="primary"
                        onClick={() => handleSaveEdit(user.id)}
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={handleCancelEdit}
                      >
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(user)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllUsers;
