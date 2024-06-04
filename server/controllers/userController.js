import { createError } from "../utils/error.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// create user
export const createUser = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Convert email to lowercase
        req.body.email = email.toLowerCase();

        // Check if the email already exists
        const existingEmail = await User.findOne({ 
            where: { email: req.body.email } 
        });
        
        if (existingEmail) {
            // If user with the same email exists, return an error
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // if email does not exist...
        // hash password before saving it to the db
        req.body.password = await bcrypt.hash(req.body.password, 10);

        // Create the user
        const user = await User.create(req.body);
        const { password, ...others } = user.toJSON();
        res.status(201).json({ message: 'User created successfully.', user: others });
    } catch (error) {
        next(error);
    }
};


// GET users
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            order: [['createdAt', 'DESC']],
        });
    
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// GET a user by id
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found!' });

        const { password, ...others } = user.toJSON();
        res.json(others);
    } catch (error) {
        next(error);
    }
};

// Update(PUT) a user by userId
export const updateUser = async (req, res, next) => {
    try {
        // Check if the id exists
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found!' });
        
        // if id exists...
        const { email } = req.body;

        // Convert email to lowercase
        req.body.email = email.toLowerCase();

        // hash password before saving it to the db
        req.body.password = await bcrypt.hash(req.body.password, 10);

        const updatedUser = await User.update(
            req.body, {
                returning: true,
                where: {id: req.params.id},
            }
        );
        res.status(200).json({message:'User updated successfully.', updatedUser: updatedUser[1]});  
    } catch (error) {
        next(error);
    }
};

// DELETE a user by userId
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found!' });
        
        await User.destroy({
            where: { id: req.params.id },
        });
        res.status(202).json({ message: 'User deleted!' });
    } catch (error) {
        next(error);
    }
};

// Update(PATCH) a user by userId
// I added the patch method to work with the edit users in the front-end
//   this is in order to allow update of user data while ignoring the password
export const patchUser = async (req, res, next) => {
    try {
        // Check if the id exists
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found!' });
        
        // if id exists...
        // Check if email is present in the request body
        if (req.body.email) {
            const { email } = req.body;

            // Convert email to lowercase
            req.body.email = email.toLowerCase();
        }

        // Check if password is present in the request body
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await User.update(
            req.body, {
                returning: true,
                where: {id: req.params.id},
            }
        );
        res.status(200).json({message:'User updated successfully.', updatedUser: updatedUser[1]});  
    } catch (error) {
        next(error);
    }
};