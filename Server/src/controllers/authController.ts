import { Request, Response } from "express"
import { login, register } from "../services/authService"
import { setCookie } from "../lib/setCookie";

export const registerRoute = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.sendStatus(400)
    }
    const token = await register({ email, password })

    if (token)
        res.sendStatus(200)
    else {
        res.status(400).json({ message: "Error Registering" })
    }

}
export const loginRoute = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("POST: Login")
    if (!email || !password) {
        res.sendStatus(400)
    }

    const token = await login({ email, password })
    if (token) {
        setCookie(res, token)
        res.status(200).json({ message: "Login Succesful" })
    }
    else {
        res.status(400).json({ message: "Error login" })
    }

}
export const logout = (req: Request, res: Response) => {
    console.log("GET: auth/logout");
    try {
        res.clearCookie('fitness-auth');
        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.log("Error logging out: ", err)
        res.sendStatus(400)
    }
}
