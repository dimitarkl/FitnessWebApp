import { Response } from "express";

export const setCookie = (res: Response, token: string) => {
    res.cookie("fitness-auth", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};