
// unit test demo
import { register, login } from '../controllers/authController';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../utils/error';

jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../utils/error');

describe('Auth Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, cookies: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    describe('register', () => {
        it('should register a new user', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
                phoneNumber: 1234567890
            };

            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedpassword');
            User.create.mockResolvedValue({
                toJSON: () => ({
                    id: 1,
                    email: 'test@example.com',
                    name: 'Test User',
                    phoneNumber: 1234567890,
                    isAdmin: false
                })
            });

            await register(req, res, next);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(User.create).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'hashedpassword',
                name: 'Test User',
                phoneNumber: 1234567890
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Registration was successful.',
                user: {
                    id: 1,
                    email: 'test@example.com',
                    name: 'Test User',
                    phoneNumber: 1234567890,
                    isAdmin: false
                }
            });
        });

        it('should return error if email already exists', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
                phoneNumber: 1234567890
            };

            User.findOne.mockResolvedValue({ email: 'test@example.com' });

            await register(req, res, next);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Email already exists.' });
        });

        it('should call next with error on exception', async () => {
            const error = new Error('Test error');
            User.findOne.mockRejectedValue(error);

            req.body = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
                phoneNumber: 1234567890
            };

            await register(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('login', () => {
        it('should login a user with correct credentials', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123'
            };

            const user = {
                id: 1,
                email: 'test@example.com',
                password: 'hashedpassword',
                name: 'Test User',
                phoneNumber: 1234567890,
                isAdmin: false,
                toJSON: () => ({
                    id: 1,
                    email: 'test@example.com',
                    name: 'Test User',
                    phoneNumber: 1234567890,
                    isAdmin: false
                })
            };

            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token');

            await login(req, res, next);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
            expect(jwt.sign).toHaveBeenCalledWith({
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                isAdmin: false
            }, process.env.JWT);
            expect(res.cookie).toHaveBeenCalledWith('access_token', 'token', { httpOnly: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
                phoneNumber: 1234567890,
                isAdmin: false
            });
        });

        it('should return error if user not found', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue(null);
            createError.mockReturnValue(new Error('User not found!'));

            await login(req, res, next);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(next).toHaveBeenCalledWith(new Error('User not found!'));
        });

        it('should return error if password is incorrect', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123'
            };

            const user = {
                id: 1,
                email: 'test@example.com',
                password: 'hashedpassword'
            };

            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(false);
            createError.mockReturnValue(new Error('Wrong Credentials!'));

            await login(req, res, next);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
            expect(next).toHaveBeenCalledWith(new Error('Wrong Credentials!'));
        });

        it('should call next with error on exception', async () => {
            const error = new Error('Test error');
            User.findOne.mockRejectedValue(error);

            req.body = {
                email: 'test@example.com',
                password: 'password123'
            };

            await login(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
