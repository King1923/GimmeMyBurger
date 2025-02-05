import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid as MuiGrid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../admin/AdminSideBar'; // Import the AdminSidebar

function EditPromotion() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [promotion, setPromotion] = useState({
        title: "",
        description: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/promotion/${id}`).then((res) => {
            setPromotion(res.data);
            setImageFile(res.data.imageFile);
            setLoading(false);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: promotion,
        enableReinitialize: true,
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required')
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.title = data.title.trim();
            data.description = data.description.trim();
            http.put(`/promotion/${id}`, data)
                .then(() => {
                    navigate("/adminPromotions");
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

    const deletePromotion = () => {
        http.delete(`/promotion/${id}`)
            .then(() => {
                navigate("/homepage");
            });
    };

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
                .catch((error) => {
                    console.log(error.response);
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
                    Edit Promotion
                </Typography>

                {!loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <MuiGrid container spacing={2}>
                            <MuiGrid item xs={12} md={6} lg={8}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    label="Title"
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    multiline
                                    minRows={2}
                                    label="Description"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </MuiGrid>
                            <MuiGrid item xs={12} md={6} lg={4}>
                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Button variant="contained" component="label">
                                        Upload Image
                                        <input
                                            hidden
                                            accept="image/*"
                                            type="file"
                                            onChange={onFileChange}
                                        />
                                    </Button>
                                    {imageFile && (
                                        <Box sx={{ mt: 2 }}>
                                            <img
                                                alt="promotion"
                                                src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                                style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </MuiGrid>
                        </MuiGrid>
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
                )}

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Delete Promotion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this promotion?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="inherit" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="error" onClick={deletePromotion}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <ToastContainer />
            </Box>
        </Box>
    );
}

export default EditPromotion;
