import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../admin/AdminSideBar'; // Import the AdminSidebar

function EditInventory() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [inventory, setInventory] = useState({
        item: "",
        quantity: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/inventory/${id}`).then((res) => {
            setInventory(res.data);
            setLoading(false);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: inventory,
        enableReinitialize: true,
        validationSchema: yup.object({
            item: yup.string().trim()
                .min(3, 'Item name must be at least 3 characters')
                .max(100, 'Item name must be at most 100 characters')
                .required('Item name is required'),
            quantity: yup.number()
                .min(0, 'Quantity must be a positive number')
                .required('Quantity is required')
        }),
        onSubmit: (data) => {
            data.item = data.item.trim();
            http.put(`/inventory/${id}`, data)
                .then(() => {
                    toast.success('Inventory updated successfully');
                    navigate("/inventory");
                })
                .catch((err) => {
                    toast.error('Error updating inventory');
                    console.error(err);
                });
        }
    });

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteInventory = () => {
        http.delete(`/inventory/${id}`)
            .then(() => {
                toast.success('Inventory deleted successfully');
                navigate("/inventory");
            })
            .catch((err) => {
                toast.error('Error deleting inventory');
                console.error(err);
            });
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Edit Inventory
                </Typography>
                {
                    !loading && (
                        <Box component="form" onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        autoComplete="off"
                                        label="Item Name"
                                        name="item"
                                        value={formik.values.item}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.item && Boolean(formik.errors.item)}
                                        helperText={formik.touched.item && formik.errors.item}
                                    />
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        autoComplete="off"
                                        label="Quantity"
                                        name="quantity"
                                        type="number"
                                        value={formik.values.quantity}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                                        helperText={formik.touched.quantity && formik.errors.quantity}
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ mt: 2 }}>
                                <Button variant="contained" type="submit">
                                    Update
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ ml: 2 }}
                                    color="error"
                                    onClick={handleOpen}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Box>
                    )
                }

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>
                        Delete Inventory
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this inventory item?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="inherit" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="error" onClick={deleteInventory}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <ToastContainer />
            </Box>
        </Box>
    );
}

export default EditInventory;
