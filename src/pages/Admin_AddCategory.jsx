import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../admin/AdminSideBar';

function AddCategory() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            categoryName: '',
        },
        validationSchema: yup.object({
            categoryName: yup
                .string()
                .trim()
                .min(3, 'Category Name must be at least 3 characters long.')
                .max(100, 'Category Name must be at most 100 characters long.')
                .matches(
                    /^[A-Za-z]+$/,
                    'Category Name can only contain alphabet letters.'
                )
                .required('Category Name is required.'),
        }),
        onSubmit: (data) => {
            data.categoryName = data.categoryName.trim();
            data.createdAt = new Date().toISOString();
            data.updatedAt = new Date().toISOString();

            http.post('/category', data)
                .then(() => {
                    toast.success('Category added successfully!');
                    navigate('/categories');
                })
                .catch(() => {
                    toast.error('Failed to add category!');
                });
        },
    });

    return (
        <Box sx={{ flexGrow: 1, paddingLeft: '250px', paddingTop: '16px' }}>
            <AdminSidebar />
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Category
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Category Name"
                            name="categoryName"
                            value={formik.values.categoryName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.categoryName &&
                                Boolean(formik.errors.categoryName)
                            }
                            helperText={
                                formik.touched.categoryName &&
                                formik.errors.categoryName
                            }
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add Category
                    </Button>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default AddCategory;