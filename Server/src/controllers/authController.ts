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
        res.sendStatus(400)
    }
}
export const loginRoute = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("POST:Login")
    console.log(req.body)
    if (!email || !password) {
        res.sendStatus(400)
    }
    try {
        const token = await login({ email, password })
        setCookie(res, token)
        res.sendStatus(200)
    } catch (err) {
        console.log("Error login: ", (err as Error).message)
        res.sendStatus(400)
    }
}