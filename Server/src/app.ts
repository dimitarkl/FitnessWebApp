import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createWorkout } from "./controllers/workoutController"
import { loginRoute, registerRoute } from "./controllers/authController";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
}));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, TypeScript Express!");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
})
app.post("/api/create-workout", createWorkout);
app.post("/auth/register", registerRoute)
app.post("/auth/login", loginRoute)
