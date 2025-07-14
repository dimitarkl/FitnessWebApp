import { createWorkoutRoute, deleteWorkout, getLastWorkouts, getUserWorkouts, getWorkoutById, reqExercises, updateWorkout } from "./controllers/workoutController"
import { loginRoute, logout, registerRoute } from "./controllers/authController";
import configExpress from "./config/configExpress";
import dotenv from "dotenv";
import express from "express";
import { getMe, getUserById, updateMe } from "./controllers/usersController";
import { likeWorkoutRoute } from "./controllers/likeController";

dotenv.config();
// Default to production unless explicitly running in development
if (process.env.NODE_ENV !== 'development') {
    process.env.NODE_ENV = 'production';
}

const app = express();
configExpress(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    // Determine base URL based on environment
    const baseUrl = process.env.NODE_ENV === 'production'
        ? 'http://api.workoutrec.dimitarkl.me'
        : `http://localhost:${PORT}`;
    console.log(`🚀 Server running on ${baseUrl}`);
});

app.get("/user/workouts", getUserWorkouts);

app.post("/create-workout", createWorkoutRoute);
app.get("/workouts", getLastWorkouts);
app.get("/workouts/:id", getWorkoutById);
app.delete("/workouts/:id", deleteWorkout);
app.put("/workouts/:id", updateWorkout)

app.post("/workouts/:id/like",likeWorkoutRoute)

app.post("/auth/register", registerRoute)
app.post("/auth/login", loginRoute)
app.get("/auth/logout", logout)

app.get('/exercises', reqExercises)

app.get('/users/me', getMe);
app.put('/users/update', updateMe)
app.get('/users/:id', getUserById)


