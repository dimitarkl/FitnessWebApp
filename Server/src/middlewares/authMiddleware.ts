import { Request, Response, NextFunction } from "express";
import jwt from "../lib/jwt";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["fitness-auth"];
    if (!token) return next()
    try {
        const decodedToken = await jwt.verify(token, process.env.SECRET as string);
        req.user = decodedToken;
    } catch (err) {
        res.clearCookie('fitness-auth');
        console.error('Failed to authenticate token:', (err as Error).message)
        return next();
    }

    next();
};
export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
}