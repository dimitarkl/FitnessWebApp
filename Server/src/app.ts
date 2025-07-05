import { createWorkoutRoute, deleteWorkout, getLastWorkouts, getUserWorkouts, getWorkoutById, reqExercises, updateWorkout } from "./controllers/workoutController"
import { loginRoute, logout, registerRoute } from "./controllers/authController";
import configExpress from "./config/configExpress";
import dotenv from "dotenv";
import express from "express";
import { getMe, getUserById, updateMe } from "./controllers/usersController";

dotenv.config();

const app = express();
configExpress(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
})

app.get("/api/user/workouts", getUserWorkouts);

app.post("/api/create-workout", createWorkoutRoute);
app.get("/api/workouts", getLastWorkouts);
app.get("/api/workouts/:id", getWorkoutById);
app.delete("/api/workouts/:id", deleteWorkout);
app.put("/api/workouts/:id", updateWorkout)

app.post("/auth/register", registerRoute)
app.post("/auth/login", loginRoute)
app.get("/auth/logout", logout)

app.get('/exercises', reqExercises)

app.get('/api/users/me', getMe);
app.put('/api/users/update', updateMe)
app.get('/api/users/:id', getUserById)


