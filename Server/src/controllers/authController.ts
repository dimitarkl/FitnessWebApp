import { Request, Response } from "express"
import { login, register } from "../services/authService"
import { setCookie } from "../lib/setCookie";

export const registerRoute = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.sendStatus(400)
    }
    try {
        const token = await register({ email, password })
        res.sendStatus(200)
    } catch (err) {
        console.log("Error registering: ", (err as Error).message)
        res.status(400).json({ message: (err as Error).message })
    }
}
export const loginRoute = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("POST: Login")
    if (!email || !password) {
        res.sendStatus(400)
    }
    try {
        const token = await login({ email, password })
        setCookie(res, token)
        res.status(200).json({ message: "Login Succesful" })
    } catch (err) {
        console.log("Error login: ", (err as Error).message)
        res.sendStatus(400)
    }
}
export const logout = (req: Request, res: Response) => {
    console.log("GET: auth/logout");
    try {

        res.clearCookie('fitness-auth');
        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.log("Error logging out: ", (err as Error).message)
        res.sendStatus(400)
    }
}
