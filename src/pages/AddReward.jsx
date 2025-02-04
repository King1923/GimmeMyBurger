import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddReward() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            pointsRequired: "",
            expiryDate: "",
            rewardType: "",
        },
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            pointsRequired: yup.number()
                .min(1, 'Points required must be above "0"')
                .required('Points required is required'),
            expiryDate: yup.date()
                .min(new Date(), 'Expiry date must be in the future')
                .required('Expiry date is required'),
            rewardType: yup.string()
                .max(100, 'Reward type must be at most 100 characters')
                .required('Reward type is required')
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.title = data.title.trim();
            data.description = data.description.trim();
            http.post("/reward", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/rewards");
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
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Reward
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth
                            label="Reward Title"
                            variant="outlined"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth
                            label="Description"
                            variant="outlined"
                            name="description"
                            multiline
                            rows={4}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth
                            label="Points Required"
                            variant="outlined"
                            name="pointsRequired"
                            type="number"
                            value={formik.values.pointsRequired}
                            onChange={formik.handleChange}
                            error={formik.touched.pointsRequired && Boolean(formik.errors.pointsRequired)}
                            helperText={formik.touched.pointsRequired && formik.errors.pointsRequired}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth
                            label="Expiry Date"
                            variant="outlined"
                            name="expiryDate"
                            type="date"
                            value={formik.values.expiryDate}
                            onChange={formik.handleChange}
                            error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
                            helperText={formik.touched.expiryDate && formik.errors.expiryDate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth
                            label="Reward Type"
                            variant="outlined"
                            name="rewardType"
                            value={formik.values.rewardType}
                            onChange={formik.handleChange}
                            error={formik.touched.rewardType && Boolean(formik.errors.rewardType)}
                            helperText={formik.touched.rewardType && formik.errors.rewardType}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={8}>
                        <input type="file" accept="image/*" onChange={onFileChange} />
                        {imageFile && (
                            <Typography variant="body2">
                                {imageFile}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            color="default"
                            onClick={() => navigate("/rewards")}
                            sx={{ mr: 2 }}
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mr: 2 }}
                        >
                            Add Reward
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default AddReward;
