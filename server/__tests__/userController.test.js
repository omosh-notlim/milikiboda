
// users unit test demo

import User from '../models/User.js';
import { 
    createUser, getUsers, 
    getUser, updateUser, 
    deleteUser, patchUser 
} from '../controllers/userController.js';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');
jest.mock('../models/User.js');

describe('User Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    describe('createUser', () => {
        it('should create a user successfully', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123',
            };
            
            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue({
                toJSON: () => ({ id: 1, email: 'test@example.com', name: 'Test' }),
            });

            await createUser(req, res, next);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(User.create).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'hashedPassword',
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User created successfully.',
                user: { id: 1, email: 'test@example.com', name: 'Test' },
            });
        });

        it('should return an error if email already exists', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123',
            };

            User.findOne.mockResolvedValue(true);

            await createUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Email already exists.' });
        });

        it('should call next with an error if something goes wrong', async () => {
            const error = new Error('Something went wrong');
            User.findOne.mockRejectedValue(error);

            req.body = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
                phoneNumber: 1234567890
            };

            await createUser(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getUsers', () => {
        it('should return a list of users', async () => {
            User.findAll.mockResolvedValue([{ id: 1, email: 'test@example.com', name: 'Test' }]);

            await getUsers(req, res, next);

            expect(User.findAll).toHaveBeenCalledWith({ order: [['createdAt', 'DESC']] });
            expect(res.json).toHaveBeenCalledWith([{ id: 1, email: 'test@example.com', name: 'Test' }]);
        });

        it('should call next with an error if something goes wrong', async () => {
            const error = new Error('Something went wrong');
            User.findAll.mockRejectedValue(error);

            await getUsers(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getUser', () => {
        it('should return a user by id', async () => {
            req.params.id = 1;
            User.findByPk.mockResolvedValue({
                toJSON: () => ({ id: 1, email: 'test@example.com', name: 'Test' }),
            });

            await getUser(req, res, next);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith({ id: 1, email: 'test@example.com', name: 'Test' });
        });

        it('should return a 404 if user is not found', async () => {
            req.params.id = 1;
            User.findByPk.mockResolvedValue(null);

            await getUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found!' });
        });

        it('should call next with an error if something goes wrong', async () => {
            const error = new Error('Something went wrong');
            User.findByPk.mockRejectedValue(error);

            await getUser(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('updateUser', () => {
        it('should update a user successfully', async () => {
            req.params.id = 1;
            req.body = {
                email: 'updated@example.com',
                password: 'newpassword',
            };
            
            User.findByPk.mockResolvedValue(true);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.update.mockResolvedValue([1, [{ id: 1, email: 'updated@example.com', name: 'Updated' }]]);

            await updateUser(req, res, next);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
            expect(User.update).toHaveBeenCalledWith({
                email: 'updated@example.com',
                password: 'hashedPassword',
            }, {
                returning: true,
                where: { id: 1 },
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User updated successfully.',
                updatedUser: [{ id: 1, email: 'updated@example.com', name: 'Updated' }],
            });
        });

        it('should return a 404 if user is not found', async () => {
            req.params.id = 1;
            User.findByPk.mockResolvedValue(null);

            await updateUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found!' });
        });

        it('should call next with an error if something goes wrong', async () => {
            const error = new Error('Something went wrong');
            User.findByPk.mockRejectedValue(error);

            await updateUser(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteUser', () => {
        it('should delete a user successfully', async () => {
            req.params.id = 1;
            User.findByPk.mockResolvedValue(true);
            User.destroy.mockResolvedValue(1);

            await deleteUser(req, res, next);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(User.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(res.status).toHaveBeenCalledWith(202);
            expect(res.json).toHaveBeenCalledWith({ message: 'User deleted!' });
        });

        it('should return a 404 if user is not found', async () => {
            req.params.id = 1;
            User.findByPk.mockResolvedValue(null);

            await deleteUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found!' });
        });

        it('should call next with an error if something goes wrong', async () => {
            const error = new Error('Something went wrong');
            User.findByPk.mockRejectedValue(error);

            await deleteUser(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('patchUser', () => {
        it('should patch a user successfully', async () => {
            req.params.id = 1;
            req.body = {
                email: 'patched@example.com',
                password: 'newpassword',
            };
            
            User.findByPk.mockResolvedValue(true);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.update.mockResolvedValue([1, [{ id: 1, email: 'patched@example.com', name: 'Patched' }]]);

            await patchUser(req, res, next);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
            expect(User.update).toHaveBeenCalledWith({
                email: 'patched@example.com',
                password: 'hashedPassword',
            }, {
                returning: true,
                where: { id: 1 },
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User updated successfully.',
                updatedUser: [{ id: 1, email: 'patched@example.com', name: 'Patched' }],
            });
        });

        it('should return a 404 if user is not found', async () => {
            req.params.id = 1;
            User.findByPk.mockResolvedValue(null);

            await patchUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found!' });
        });

        it('should call next with an error if something goes wrong', async () => {
            const error = new Error('Something went wrong');
            User.findByPk.mockRejectedValue(error);

            await patchUser(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
