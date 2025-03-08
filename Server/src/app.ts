import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("Hello, TypeScript Express!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

pool.query("SELECT NOW()", (err: any, res: any) => {
    if (err) {
        console.error("Error executing query", err);
    } else {
        console.log("PostgreSQL Time:", res.rows[0]);
    }
});
