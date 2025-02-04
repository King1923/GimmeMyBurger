import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../admin/AdminSideBar'; // Import the admin sidebar

function AddInventory() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            item: "",
            quantity: 0,
        },
        validationSchema: yup.object({
            item: yup.string().trim()
                .min(3, 'Item name must be at least 3 characters')
                .max(100, 'Item name must be at most 100 characters')
                .required('Item name is required'),
            quantity: yup.number()
                .min(0, 'Quantity must be a positive number')
                .required('Quantity is required'),
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.item = data.item.trim();
            http.post("/inventory", data)
                .then((res) => {
                    toast.success('Inventory item added successfully');
                    navigate("/inventory");
                })
                .catch((err) => {
                    toast.error('Error adding inventory item');
                    console.error(err);
                });
        }
    });

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch((err) => {
                    toast.error('Error uploading file');
                    console.error(err);
                });
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Add Inventory Item
                </Typography>
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
                        <Grid item xs={12} md={6}>
                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Button variant="contained" component="label">
                                    Upload Image
                                    <input
                                        hidden
                                        accept="image/*"
                                        multiple
                                        type="file"
                                        onChange={onFileChange}
                                    />
                                </Button>
                                {imageFile && (
                                    <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                        <img
                                            alt="inventory"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit">
                            Add
                        </Button>
                    </Box>
                </Box>
                <ToastContainer />
            </Box>
        </Box>
    );
}

export default AddInventory;
