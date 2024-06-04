import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import useFetch from '../../hooks/useFetch';
import Users from './Users';
import { MemoryRouter } from 'react-router-dom';

// Mock axios to prevent actual API calls
jest.mock('axios', () => ({
    __esModule:true,

    default: {
        delete: jest.fn()
    },
}));
jest.mock('../../hooks/useFetch');

describe('Users Component', () => {
    const renderComponent = () => {
        render(
            <MemoryRouter>
                <Users />
            </MemoryRouter>
        );
    };

    const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', company: 'Company A' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', company: 'Company B' },
    ];

    beforeEach(() => {
        useFetch.mockReturnValue({
            data: mockUsers,
            loading: false,
            error: null,
            reFetch: jest.fn(),
        });
    });

    test('renders the user list correctly', () => {
        renderComponent();

        expect(screen.getByText('All Users')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search by name or email')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    test('filters users based on search query', () => {
        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('Search by name or email'), {
            target: { value: 'john' },
        });

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });

    test('handles pagination', () => {
        useFetch.mockReturnValueOnce({
            data: [...mockUsers, ...Array(8).fill().map((_, i) => ({
                id: i + 3,
                name: `User ${i + 3}`,
                email: `user${i + 3}@example.com`,
                company: `Company ${i + 3}`,
            }))],
            loading: false,
            error: null,
            reFetch: jest.fn(),
        });

        renderComponent();

        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Next'));

        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    });

    test('opens and closes delete modal', async () => {
        renderComponent();

        fireEvent.click(screen.getAllByText('Delete')[0]);

        await waitFor(() => expect(screen.getByText('Are you sure you want to delete this user?')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Cancel'));

        await waitFor(() => expect(screen.queryByText('Are you sure you want to delete this user?')).not.toBeInTheDocument());
    });

    test('opens and closes edit modal', async () => {
        axios.get.mockResolvedValueOnce({ data: mockUsers[0] });

        renderComponent();

        fireEvent.click(screen.getAllByText('Edit')[0]);

        await waitFor(() => expect(screen.getByText('Edit User')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Close'));

        await waitFor(() => expect(screen.queryByText('Edit User')).not.toBeInTheDocument());
    });

    test('deletes a user', async () => {
        axios.delete.mockResolvedValueOnce({});
        renderComponent();

        fireEvent.click(screen.getAllByText('Delete')[0]);

        await waitFor(() => expect(screen.getByText('Are you sure you want to delete this user?')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith(`/users/1`);
            expect(screen.queryByText('Are you sure you want to delete this user?')).not.toBeInTheDocument();
        });
    });
});
