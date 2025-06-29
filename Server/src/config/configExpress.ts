import express, { Express } from "express";
import cors from "cors";

import CookieParser from "cookie-parser";
import { authMiddleware } from "../middlewares/authMiddleware";


const configExpress = (app: Express) => {
    app.use(express.json());
    app.use(cors({
        origin: 'http://localhost:4200',
        credentials: true,
    }));
    app.use(CookieParser());
    app.use(authMiddleware);

}

export default configExpress;
