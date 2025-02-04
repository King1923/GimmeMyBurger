import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Button,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import AdminSidebar from '../admin/AdminSideBar';

function AdminCategories() {
    const [categoryList, setCategoryList] = useState([]);
    const { user } = useContext(UserContext);

    // Fetch categories from the API
    const getCategories = async () => {
        try {
            const res = await http.get('/category');
            console.log('Fetched categories:', res.data); // Log the category list
            setCategoryList(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const deleteCategory = async (id, name) => {
        console.log('Deleting category with ID:', id); // Log to check the ID
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await http.delete(`/category/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            console.log('Delete response:', response);
            setCategoryList((prevList) => prevList.filter((category) => category.categoryId !== id));
            toast.success(`${categoryName} with Category ID ${id} has been deleted.`);
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete the category. Please try again.');
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    // Sort categories by categoryId
    const sortedCategories = categoryList.sort((a, b) => a.categoryId - b.categoryId);

    return (
        <Box sx={{ display: 'flex' }}>
            <AdminSidebar />
            <Box sx={{ flexGrow: 1, paddingLeft: '1px', paddingTop: '16px' }}>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Product Categories
                </Typography>

                <Box sx={{ mb: 2 }}>
    {user && (
        <Link to="/addcategory" style={{ textDecoration: 'none' }}>
            <Button variant="contained">Add Category</Button>
        </Link>
    )}
</Box>

                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Category ID</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Updated At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedCategories.map((category) => (
                            <TableRow key={category.categoryId}>
                                <TableCell>{category.categoryId}</TableCell>
                                <TableCell>{category.categoryName}</TableCell>
                                <TableCell>
                                    {category.createdAt
                                        ? dayjs(category.createdAt).format('YYYY-MM-DD HH:mm:ss')
                                        : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {category.updatedAt
                                        ? dayjs(category.updatedAt).format('YYYY-MM-DD HH:mm:ss')
                                        : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        component={Link}
                                        to={`/editcategory/${category.categoryId}`}
                                        color="primary"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => deleteCategory(category.categoryId, category.categoryName)}
                                        color="error"
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
}

export default AdminCategories;
