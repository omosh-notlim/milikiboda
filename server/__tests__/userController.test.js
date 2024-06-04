import request from 'supertest';
import express from 'express';
import bcrypt from 'bcryptjs';
import { 
    createUser, getUsers, 
    getUser, updateUser, deleteUser, 
    patchUser 
} from '../controllers/userController';
import User from '../models/User';

jest.mock('bcryptjs');
jest.mock('../models/User');

const app = express();
app.use(express.json());

app.post('/users', createUser);
app.get('/users', getUsers);
app.get('/users/:id', getUser);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);
app.patch('/users/:id', patchUser);

describe('User Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const hashedPassword = 'hashedPassword';
            bcrypt.hash.mockResolvedValue(hashedPassword);

            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue({
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
                password: hashedPassword,
                phoneNumber: 1234567,
                isAdmin: false,
                updatedAt: "2024-06-04T15:29:27.097Z",
                createdAt: "2024-06-04T15:29:27.097Z",
            });

            const res = await request(app)
                .post('/users')
                .send({
                    email: 'test@example.com',
                    password: 'hashedPassword',
                    name: 'Test User',
                    phoneNumber: 1234567,
                    isAdmin: false,
                    updatedAt: "2024-06-04T15:29:27.097Z",
                    createdAt: "2024-06-04T15:29:27.097Z",
                });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User created successfully.');
            expect(res.body.user).toEqual({
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
                phoneNumber: 1234567,
                isAdmin: false,
                updatedAt: "2024-06-04T15:29:27.097Z",
                createdAt: "2024-06-04T15:29:27.097Z",
            });
        });

        it('should return an error if email already exists', async () => {
            User.findOne.mockResolvedValue({ email: 'test@example.com' });

            const res = await request(app)
                .post('/users')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    name: 'Test User',
                    phoneNumber: '1234567',
                    isAdmin: false,
                    updatedAt: "2024-06-04T15:29:27.097Z",
                    createdAt: "2024-06-04T15:29:27.097Z",
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Email already exists.');
        });
    });

    describe('getUsers', () => {
        it('should return a list of users', async () => {
            User.findAll.mockResolvedValue([
                { id: 1, name: 'Test User', email: 'test@example.com' },
            ]);

            const res = await request(app).get('/users');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id: 1, name: 'Test User', email: 'test@example.com' }]);
        });
    });

    describe('getUser', () => {
        it('should return a user by id', async () => {
            User.findByPk.mockResolvedValue({
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                toJSON: () => ({ id: 1, name: 'Test User', email: 'test@example.com' }),
            });

            const res = await request(app).get('/users/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ id: 1, name: 'Test User', email: 'test@example.com' });
        });

        it('should return an error if user not found', async () => {
            User.findByPk.mockResolvedValue(null);

            const res = await request(app).get('/users/1');

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('User not found!');
        });
    });

    describe('updateUser', () => {
        it('should update a user by id', async () => {
            const hashedPassword = 'hashedPassword';
            bcrypt.hash.mockResolvedValue(hashedPassword);

            User.findByPk.mockResolvedValue({ id: 1, email: 'test@example.com' });
            User.update.mockResolvedValue([1, [{ id: 1, name: 'Updated User', email: 'updated@example.com' }]]);

            const res = await request(app)
                .put('/users/1')
                .send({
                    email: 'updated@example.com',
                    password: 'newpassword123',
                    name: 'Updated User',
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('User updated successfully.');
            expect(res.body.updatedUser).toEqual([{ id: 1, name: 'Updated User', email: 'updated@example.com' }]);
        });

        it('should return an error if user not found', async () => {
            User.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .put('/users/1')
                .send({
                    email: 'updated@example.com',
                    password: 'newpassword123',
                    name: 'Updated User',
                });

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('User not found!');
        });
    });

    describe('deleteUser', () => {
        it('should delete a user by id', async () => {
            User.findByPk.mockResolvedValue({ id: 1, email: 'test@example.com' });

            const res = await request(app).delete('/users/1');

            expect(res.status).toBe(202);
            expect(res.body.message).toBe('User deleted!');
        });

        it('should return an error if user not found', async () => {
            User.findByPk.mockResolvedValue(null);

            const res = await request(app).delete('/users/1');

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('User not found!');
        });
    });

    describe('patchUser', () => {
        it('should partially update a user by id', async () => {
            const hashedPassword = 'hashedPassword';
            bcrypt.hash.mockResolvedValue(hashedPassword);

            User.findByPk.mockResolvedValue({ id: 1, email: 'test@example.com' });
            User.update.mockResolvedValue([1, [{ id: 1, name: 'Patched User', email: 'patched@example.com' }]]);

            const res = await request(app)
                .patch('/users/1')
                .send({
                    email: 'patched@example.com',
                    name: 'Patched User',
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('User updated successfully.');
            expect(res.body.updatedUser).toEqual([{ id: 1, name: 'Patched User', email: 'patched@example.com' }]);
        });

        it('should return an error if user not found', async () => {
            User.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .patch('/users/1')
                .send({
                    email: 'patched@example.com',
                    name: 'Patched User',
                });

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('User not found!');
        });
    });
});
