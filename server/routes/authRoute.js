import express from "express";
import { 
    login, 
    register 
} from "../controllers/authController.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const authRouter = express.Router();

// login route
authRouter.post("/login", login);

// register route
//  A protected route: isAdmin should be true to access this
authRouter.post("/register", verifyAdmin, register);

export default authRouter;