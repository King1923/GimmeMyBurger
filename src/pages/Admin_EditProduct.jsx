import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AdminSidebar from '../admin/AdminSideBar';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    http
      .get(`/product/${id}`)
      .then((res) => {
        setProduct(res.data);
        setImageFile(res.data.imageFile);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        toast.error('Error fetching product details');
      });

    http
      .get('/category')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        toast.error('Error fetching categories');
      });
  }, [id]);

  const formik = useFormik({
    initialValues: product
      ? {
          name: product.name,
          description: product.description,
          SKU: product.sku,
          price: product.price,
          categoryId: product.categoryId || '',
          stock: product.stock,
        }
      : {
          name: '',
          description: '',
          SKU: '',
          price: '',
          categoryId: '',
          stock: '',
        },
    enableReinitialize: true,
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
        .required('Price is required')
        .positive('Price must be a positive number'),
      categoryId: yup.string().required('Category is required'),
      stock: yup.number()
        .required('Stock is required')
        .integer('Stock must be an integer')
        .min(0, 'Stock must be at least 0'),
    }),
    onSubmit: (data) => {
      const updatedData = {
        ...data,
        price: parseFloat(data.price),
        stock: parseInt(data.stock, 10),
      };

      if (imageFile) {
        updatedData.imageFile = imageFile;
      }

      http.put(`/product/${id}`, updatedData)
        .then(() => {
          toast.success(
            `Product with name "${data.name}" and product ID "${id}" has been successfully updated!`
          );
          navigate('/products');
        })
        .catch((error) => {
          console.error('Error updating product:', error);
          toast.error('Error updating product');
        });
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    setImageFile(product?.imageFile);
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error('Maximum file size is 1MB');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      http
        .post('/file/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          setImageFile(res.data.filename);
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
          toast.error('Error uploading image');
        });
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, paddingLeft: '250px', paddingTop: '16px' }}>
      <AdminSidebar />
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Product
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={8}>
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              label="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
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
              fullWidth
              margin="dense"
              autoComplete="off"
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
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <MenuItem key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No categories available
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
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
              {imageFile ? (
                <Box sx={{ mt: 2 }}>
                  <img
                    alt="product"
                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                    style={{ maxWidth: '100%' }}
                  />
                </Box>
              ) : (
                <Typography>No image available</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Update
          </Button>
          <Button variant="contained" color="warning" sx={{ ml: 2 }} onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default EditProduct;