// components/Admin/ViewHospitals.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';

const ViewHospitals = () => {
  // Mock data - in a real app, you would fetch this from an API
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockHospitals = [
        { id: 1, name: 'General Hospital', address: '123 Main St, New York, NY', contactPerson: 'John Doe', email: 'contact@generalhospital.com', phone: '555-123-4567', isActive: true },
        { id: 2, name: 'City Medical Center', address: '456 Oak Ave, Los Angeles, CA', contactPerson: 'Jane Smith', email: 'info@citymedical.com', phone: '555-987-6543', isActive: true },
        { id: 3, name: 'Community Healthcare', address: '789 Pine Rd, Chicago, IL', contactPerson: 'Bob Johnson', email: 'support@communityhealthcare.com', phone: '555-456-7890', isActive: false },
        { id: 4, name: 'Memorial Hospital', address: '321 Elm St, Houston, TX', contactPerson: 'Sarah Brown', email: 'info@memorialhospital.com', phone: '555-789-0123', isActive: true },
        { id: 5, name: 'University Medical', address: '654 Maple Ave, Phoenix, AZ', contactPerson: 'Mike Wilson', email: 'contact@universitymedical.com', phone: '555-321-6540', isActive: true }
      ];
      setHospitals(mockHospitals);
      setFilteredHospitals(mockHospitals);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter hospitals based on search term
    const filtered = hospitals.filter(hospital => 
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHospitals(filtered);
    setPage(0);
  }, [searchTerm, hospitals]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // These would be connected to actual functionality in a real app
  const handleEdit = (id) => {
    console.log(`Edit hospital with ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete hospital with ID: ${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        View Hospitals
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search Hospitals"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader aria-label="hospitals table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHospitals
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((hospital) => (
                  <TableRow hover key={hospital.id}>
                    <TableCell>{hospital.name}</TableCell>
                    <TableCell>{hospital.contactPerson}</TableCell>
                    <TableCell>{hospital.email}</TableCell>
                    <TableCell>{hospital.phone}</TableCell>
                    <TableCell>
                      <Chip 
                        label={hospital.isActive ? 'Active' : 'Inactive'} 
                        color={hospital.isActive ? 'success' : 'error'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(hospital.id)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(hospital.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredHospitals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hospitals found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredHospitals.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default ViewHospitals;

