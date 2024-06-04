
// Creates database if it does not exist

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Connect to the database server without specifying the database name
const sequelize = new Sequelize({
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
});

// Function to create the database if it does not exist
async function createDatabase() {
    const databaseName = process.env.DB_DATABASE;

    try {
        // Check if the database exists
        const [results] = await sequelize.query(`SELECT 1 FROM pg_database WHERE datname='${databaseName}'`);

        if (results.length === 0) {
            // Database does not exist, so create it
            await sequelize.query(`CREATE DATABASE ${databaseName}`);
            console.log(`Database ${databaseName} created successfully.`);
        } else {
            console.log(`Database ${databaseName} already exists.`);
        }
    } catch (error) {
        console.error('An error occurred while checking or creating the database:', error);
    } finally {
        // Close the initial connection
        await sequelize.close();
    }
}

// Run the createDatabase function
createDatabase();
