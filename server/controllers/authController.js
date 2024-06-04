import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const register = async (req, res, next) => {
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

        const user = await User.create(req.body);
        const { password, ...others } = user.toJSON();
        res.status(201).json({ message: 'Registration was successful.', user: others });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email } = req.body;
        req.body.email = email.toLowerCase();

        const user = await User.findOne({
            where: { email: req.body.email },
        });
        if (!user) return next(createError(400, "User not found!"));

        const isCorrect = await bcrypt.compare(
            req.body.password, user.password
        );
        if (!isCorrect) return next(createError(400, "Wrong Credentials!"));
        
        // Payload data...
        const token = jwt.sign(
            { 
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            },
            process.env.JWT
        );
        
        // Exclude password from the returned data
        const { password, ...others } = user.toJSON();
        res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200).json(others);
    } catch (err) {
        next(err);
    }
};