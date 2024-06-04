import express from "express"
import { 
    createUser,
    deleteUser,
    getUser,
    getUsers, 
    patchUser, 
    updateUser
} from "../controllers/userController.js";

const userRouter = express.Router();

//POST user
userRouter.post("", createUser);

// GET all users
userRouter.get("", getUsers);

// GET a user by :id
userRouter.get("/:id", getUser);

// Update(PUT) user by :id
userRouter.put("/:id", updateUser);

// DELETE user by :id
userRouter.delete("/:id", deleteUser);

//  PATCH user
userRouter.patch("/:id", patchUser);

export default userRouter;