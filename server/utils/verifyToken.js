import jwt from "jsonwebtoken";
import { createError } from "./error.js";

// check if user is logged in and token is assigned
export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(createError(401, "You are not authenticated!"));
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, "Token is not valid!"));
        req.user = user;
        next();
    });
};

// Helper function to promisify jwt.verify
const verifyTokenPromise = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) reject(err);
        resolve(user);
      });
    });
  };

// Works with verifyTokenPromise to check whether user is logged in and isAdmin === true
export const verifyAdmin = async (req, res, next) => {
    try {
      const user = await verifyTokenPromise(req.cookies.access_token);
      req.user = user;
  
      if (req.user.isAdmin) {
        next();
      } else {
        return next(createError(403, "You are not authorized!"));
      }
    } catch (error) {
      return next(createError(403, "Token verification failed!"));
    }
  };