import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AdminSidebar from '../admin/AdminSideBar';

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [initialCategoryName, setInitialCategoryName] = useState(''); // Track original category name

  useEffect(() => {
    http
      .get(`/category/${id}`)
      .then((res) => {
        setCategory(res.data);
        setInitialCategoryName(res.data.categoryName); // Store initial name
      })
      .catch((error) => {
        console.error('Error fetching category:', error);
        toast.error('Error fetching category details');
      });
  }, [id]);

  const formik = useFormik({
    initialValues: {
      categoryName: category ? category.categoryName : '',
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      categoryName: yup
        .string()
        .trim()
        .matches(/^[A-Za-z\s]+$/, 'Category name can only contain alphabet letters')
        .min(3, 'Category name must be at least 3 characters')
        .max(100, 'Category name cannot exceed 100 characters')
        .required('Category name is required'),
    }),
    onSubmit: (data) => {
      data.categoryName = data.categoryName.trim();
      http
        .put(`/category/${id}`, data)
        .then(() => {
          setInitialCategoryName(data.categoryName); // Update initial name after successful update
          toast.success(`Category "${data.categoryName}" has been successfully updated!`);
          navigate('/categories');
        })
        .catch((error) => {
          console.error('Error updating category:', error);
          toast.error('Error updating category');
        });
    },
  });

  // Check if there are changes
  const isModified = formik.values.categoryName.trim() !== initialCategoryName.trim();

  // Reset form to original values when Cancel is clicked
  const handleCancel = () => {
    formik.setValues({ categoryName: initialCategoryName });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box sx={{ flexGrow: 1, padding: '16px' }}>
        
        {/* Back Button */}
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mb: 2 }} 
          onClick={() => navigate('/categories')}
        >
          Back
        </Button>

        <Typography variant="h5" sx={{ my: 2 }}>
          Edit Category
        </Typography>

        {category ? (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Category Name"
                  name="categoryName"
                  value={formik.values.categoryName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.categoryName && Boolean(formik.errors.categoryName)}
                  helperText={formik.touched.categoryName && formik.errors.categoryName}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" type="submit" disabled={!isModified}>
                Update
              </Button>
              <Button
                variant="contained"
                color="warning"
                sx={{ ml: 2 }}
                onClick={handleCancel} // Reset the form instead of navigating away
                disabled={!isModified}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography>Loading...</Typography>
        )}
        <ToastContainer />
      </Box>
    </Box>
  );
}

export default EditCategory;