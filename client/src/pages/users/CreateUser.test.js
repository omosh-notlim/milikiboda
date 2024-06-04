import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import CreateUser from './CreateUser';

// Mock axios to prevent actual API calls
jest.mock('axios', () => ({
    __esModule:true,

    default: {
        post: jest.fn()
    },
}));

describe('CreateUser Component', () => {
    const renderComponent = () => {
        render(
            <MemoryRouter>
                <CreateUser />
            </MemoryRouter>
        );
    };

    test('renders the form correctly', () => {
        renderComponent();

        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument();
    });

    test('displays an alert when required fields are missing', async () => {
        renderComponent();

        // Mock window.alert
        window.alert = jest.fn();

        // Try to submit the form without filling in the fields
        fireEvent.click(screen.getByRole('button', { name: /Create/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields.');
        });
    });

    test('submits the form successfully', async () => {
        renderComponent();

        // Mock window.alert
        window.alert = jest.fn();

        // Fill in the form fields
        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'true' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

        // Mock the axios post response
        axios.post.mockResolvedValueOnce({});

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Create/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/auth/register', {
                name: 'John Doe',
                email: 'john@example.com',
                phoneNumber: '1234567890',
                isAdmin: 'true',
                password: 'password123',
            });

            expect(window.alert).toHaveBeenCalledWith('User created!');
        });

        // Check if the form is reset
        expect(screen.getByLabelText(/Name/i).value).toBe('');
        expect(screen.getByLabelText(/Email/i).value).toBe('');
        expect(screen.getByLabelText(/Phone Number/i).value).toBe('');
        expect(screen.getByLabelText(/Role/i).value).toBe('false');
        expect(screen.getByLabelText(/Password/i).value).toBe('');
    });

    test('displays an alert on submission error', async () => {
        renderComponent();

        // Mock window.alert
        window.alert = jest.fn();

        // Fill in the form fields
        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'true' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

        // Mock the axios post response with an error
        axios.post.mockRejectedValueOnce(new Error('Network error'));

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Create/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/auth/register', {
                name: 'John Doe',
                email: 'john@example.com',
                phoneNumber: '1234567890',
                isAdmin: 'true',
                password: 'password123',
            });

            expect(window.alert).toHaveBeenCalledWith('Network error');
        });
    });
});
