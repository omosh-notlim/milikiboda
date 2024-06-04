import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const EditUserModal = ({ user, show, handleClose, reFetch }) => {
    const [userData, setUserData] = useState(user);

    useEffect(() => {
        setUserData(user);
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSave = async () => {
        try {
            await axios.patch(`/users/${userData.id}`, userData);

            // Refetch users after saving changes
            await reFetch(); 
            handleClose();
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            type="text" name="name" 
                            value={userData.name} 
                            onChange={handleChange} 
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                            type="email" name="email" 
                            value={userData.email} 
                            onChange={handleChange} 
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicNumber">
                        <Form.Label>Phone number</Form.Label>
                        <Form.Control 
                            type="number" name="phoneNumber" 
                            value={userData.phoneNumber} 
                            onChange={handleChange} 
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicCompany">
                        <Form.Label>Company</Form.Label>
                        <Form.Control 
                            type="text" name="company" 
                            value={userData.company} 
                            onChange={handleChange} 
                        />
                    </Form.Group>
                    
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditUserModal;
