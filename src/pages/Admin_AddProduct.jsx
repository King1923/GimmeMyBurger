import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../admin/AdminSideBar';

function AddProduct() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        http.get("/category")
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => {
                toast.error('Failed to fetch categories!');
                console.error(err);
            });
    }, []);

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            SKU: "",
            price: "",
            categoryId: "",
            stock: "",
            imageFile: null,
        },
        validationSchema: yup.object({
    name: yup.string().trim()
        .matches(/^[A-Za-z\s]+$/, 'Name must only contain alphabet letters and spaces')
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name must be at most 100 characters')
        .required('Name is required'),
    description: yup.string().trim()
        .min(3, 'Description must be at least 3 characters')
        .max(1000, 'Description must be at most 1000 characters')
        .required('Description is required'),
    SKU: yup.number()
        .required('SKU is required, and can only have numbers')
        .positive('SKU must be a positive integer')
        .integer('SKU must be an integer'),
    price: yup.number()
        .required('Price is required, and can only have numbers')
        .min(0.01, 'Price must be greater than 0')
        .typeError('Price must be a valid number'),
    categoryId: yup.string()
        .required('Category is required'),
    stock: yup.number()
        .required('Stock is required, and can only have numbers')
        .min(0, 'Stock must be greater than or equal to 0')
        .integer('Stock must be a whole number'),
    imageFile: yup.mixed()
        .required('Image is required')
        .nullable()
        .test('fileSize', 'Image file size must be less than 1MB', (value) => {
            if (value && value.size > 1024 * 1024) {
                return false;
            }
            return true;
        }),
}),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.name = data.name.trim();
            data.description = data.description.trim();
            data.createdAt = new Date().toISOString();
            data.updatedAt = new Date().toISOString();

            http.post("/product", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/products");
                })
                .catch((err) => {
                    toast.error('Failed to add product!');
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
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                    formik.setFieldValue('imageFile', res.data.filename);
                })
                .catch((error) => {
                    console.error(error.response);
                    toast.error('Failed to upload image');
                });
        }
    };

    return (
        <Box sx={{ flexGrow: 1, paddingLeft: '250px', paddingTop: '16px' }}>
            <AdminSidebar />
            <Typography variant="h5" sx={{ my: 2 }}>Add Product</Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="SKU"
                            name="SKU"
                            type="number"
                            value={formik.values.SKU}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.SKU && Boolean(formik.errors.SKU)}
                            helperText={formik.touched.SKU && formik.errors.SKU}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Price"
                            name="price"
                            type="number"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.price && Boolean(formik.errors.price)}
                            helperText={formik.touched.price && formik.errors.price}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Category</InputLabel>
                            <Select
                                label="Category"
                                name="categoryId"
                                value={formik.values.categoryId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                            >
                                <MenuItem value="" disabled>Select a Category</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category.categoryId} value={category.categoryId}>
                                        {category.categoryName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Stock"
                            name="stock"
                            type="number"
                            value={formik.values.stock}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.stock && Boolean(formik.errors.stock)}
                            helperText={formik.touched.stock && formik.errors.stock}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" type="file" onChange={onFileChange} />
                            </Button>
                            {imageFile && (
                                <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                    <img alt="product" src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`} />
                                </Box>
                            )}
                            {formik.touched.imageFile && formik.errors.imageFile && (
                                <Typography color="error" variant="body2">
                                    {formik.errors.imageFile}
                                </Typography>
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
    );
}

export default AddProduct;