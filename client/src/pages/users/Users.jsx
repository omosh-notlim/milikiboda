import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import EditUserModal from '../../components/EditUserModal';
import Header from '../../components/Header';

const Users = () => {
    const { data: users, loading, error, reFetch } = useFetch('/users');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');

    // State to control delete modal visibility
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // State to store the ID of the user to be deleted
    const [deleteUserId, setDeleteUserId] = useState(null);

    // State to control edit modal visibility
    const [showEditModal, setShowEditModal] = useState(false); 

    // State to store the user being edited
    const [editingUser, setEditingUser] = useState(null);

    // Filter users based on search query
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) 
    );

    // Get current users
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Change page
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredUsers.length / usersPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Delete user
    const deleteUser = async () => {
        try {
            await axios.delete(`/users/${deleteUserId}`);
            alert("User Deleted!");

            // Refetch users after deletion
            await reFetch(); 
        } catch (err) {
            alert(err.message);
        }

        // Close the modal after deletion
        handleCloseDeleteModal(); 
    };

    // Open delete modal and set the ID of the user to be deleted
    const handleOpenDeleteModal = (userId) => {
        setShowDeleteModal(true);
        setDeleteUserId(userId);
    };

    // Close delete modal
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteUserId(null);
    };

    // Open edit modal and fetch user details
    const handleEditUser = async (userId) => {
        try {
            const response = await axios.get(`/users/${userId}`);
            setEditingUser(response.data);
            setShowEditModal(true);
        } catch (err) {
            alert(err.message);
        }
    };

    // Close edit modal
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingUser(null);
    };

    return (
        <>
            <Header />
            <Container>
                <h4>All Users</h4>
                <Form.Control 
                    size="sm"
                    type="text" 
                    placeholder="Search by name or email" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}

                    style={{ 
                        width: "200px",
                        marginBottom: "5px"
                    }}
                />
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Company</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div>Error fetching users: {error.message}</div>
                    ) : (
                        <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.company}</td>
                                <td>
                                    <Button 
                                        variant="outline-primary"
                                        size="sm"
                                        // Open modal for editing user details
                                        onClick={() => handleEditUser(user.id)}
                                    >
                                        Edit
                                    </Button>
                                    {' '}
                                    <Button 
                                        variant="outline-danger"
                                        size="sm"
                                        // Open modal for delete confirmation
                                        onClick={() => handleOpenDeleteModal(user.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    )}
                </Table>
                <Pagination>
                    <Pagination.First 
                        onClick={prevPage}
                        disabled={currentPage === 1}
                    />

                    <Pagination.Item>
                        Page {currentPage} of {
                            Math.ceil(filteredUsers.length / usersPerPage)
                        }
                    </Pagination.Item>

                    <Pagination.Last 
                        onClick={nextPage}
                        disabled={
                            currentPage === Math.ceil(
                                filteredUsers.length / usersPerPage
                            )
                        }
                    />
                </Pagination>

                {/* Modal for delete confirmation */}
                <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>Are you sure you want to delete this user?</Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeleteModal}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={deleteUser}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal for editing user details */}
                {editingUser && (
                    <EditUserModal
                        user={editingUser}
                        show={showEditModal}
                        handleClose={handleCloseEditModal}
                        reFetch={reFetch}
                    />
                )}
            </Container>
        </>
    );
};

export default Users;
