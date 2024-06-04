import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import EditUserModal from './EditUserModal'; 

// Mock axios to prevent actual API calls
jest.mock('axios', () => ({
    __esModule:true,

    default: {
        patch: jest.fn()
    },
}));

describe('EditUserModal Component', () => {
    const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        company: 'Company A',
    };

    const reFetch = jest.fn();
    const handleClose = jest.fn();

    const renderComponent = () =>
        render(
            <EditUserModal
                user={user}
                show={true}
                handleClose={handleClose}
                reFetch={reFetch}
            />
        );

    test('renders the modal with user details', () => {
        renderComponent();

        expect(screen.getByText('Edit User')).toBeInTheDocument();
        expect(screen.getByLabelText('Name').value).toBe('John Doe');
        expect(screen.getByLabelText('Email address').value).toBe('john@example.com');
        expect(screen.getByLabelText('Phone number').value).toBe('1234567890');
        expect(screen.getByLabelText('Company').value).toBe('Company A');
    });

    test('handles input changes', () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: 'Jane Doe' },
        });
        fireEvent.change(screen.getByLabelText('Email address'), {
            target: { value: 'jane@example.com' },
        });
        fireEvent.change(screen.getByLabelText('Phone number'), {
            target: { value: '0987654321' },
        });
        fireEvent.change(screen.getByLabelText('Company'), {
            target: { value: 'Company B' },
        });

        expect(screen.getByLabelText('Name').value).toBe('Jane Doe');
        expect(screen.getByLabelText('Email address').value).toBe('jane@example.com');
        expect(screen.getByLabelText('Phone number').value).toBe('0987654321');
        expect(screen.getByLabelText('Company').value).toBe('Company B');
    });

    test('saves changes and closes the modal', async () => {
        axios.patch.mockResolvedValueOnce({});

        renderComponent();

        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: 'Jane Doe' },
        });
        fireEvent.change(screen.getByLabelText('Email address'), {
            target: { value: 'jane@example.com' },
        });
        fireEvent.change(screen.getByLabelText('Phone number'), {
            target: { value: '0987654321' },
        });
        fireEvent.change(screen.getByLabelText('Company'), {
            target: { value: 'Company B' },
        });

        fireEvent.click(screen.getByText('Save Changes'));

        await waitFor(() => {
            expect(axios.patch).toHaveBeenCalledWith('/users/1', {
                id: 1,
                name: 'Jane Doe',
                email: 'jane@example.com',
                phoneNumber: '0987654321',
                company: 'Company B',
            });
            expect(reFetch).toHaveBeenCalled();
            expect(handleClose).toHaveBeenCalled();
        });
    });

    test('handles save error', async () => {
        // Mock console.error to suppress error messages
        console.error = jest.fn();
        
        axios.patch.mockRejectedValueOnce(new Error('Network error'));

        renderComponent();

        fireEvent.click(screen.getByText('Save Changes'));

        await waitFor(() => {
            expect(axios.patch).toHaveBeenCalledWith('/users/1', user);
            expect(console.error).toHaveBeenCalledWith('Error updating user:', expect.any(Error));
        });
    });

    test('closes the modal without saving', () => {
        renderComponent();

        fireEvent.click(screen.getByText('Cancel'));

        expect(handleClose).toHaveBeenCalled();
    });
});
