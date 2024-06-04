import express from "express";
import dotenv from "dotenv";
import sequelize from "./utils/dbConnection.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import User from "./models/User.js";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";

dotenv.config();

const app = express();

// middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/users", userRouter);
app.use("/auth", authRouter);

// error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

(async () => {
    try {
        await sequelize.sync({ force:false });
        console.log("Connected to milikiboda database");

        // Read port from .env file
        const port = process.env.PORT;
        app.listen(port, () => {
            console.log(`Server running on port ${port}...`);
        });
    } catch (error) {
        console.log("An error occurred while attempting to connect!", error.message);
    }
})();
