import bcrypt from 'bcrypt'
import jwt from '../lib/jwt'
import { usersTable } from "../db/schema"
import db from "../db";
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { errString } from '../utils/util';

export const register = async (userData: {
    email: string,
    password: string
}) => {
    const password = await bcrypt.hash(userData.password, 12)
    try {
        const userId = await db.insert(usersTable).values({
            email: userData.email,
            password: password,
            username: null,
        }).returning({
            id: usersTable.id
        })
        const token = await tokenCreation({
            id: userId.toString(),
            email: userData.email,
        });
        console.log("Register Succesful")
        return token
    } catch (err) {
        console.log(errString, err)
        return null
    }
};
export const login = async (userData: {
    email: string,
    password: string
}) => {
    try {
        const user = (await db.select().from(usersTable).where(eq(usersTable.email, userData.email)).limit(1))[0];
        if (!user) throw new Error("Email or password is invalid");
        const isValid = await bcrypt.compare(userData.password, user.password)
        if (!isValid) throw new Error("Email or password is invalid");
        const token = await tokenCreation({
            id: user.id.toString(),
            email: user.email,
        });

        console.log('Login Succesful')
        return token;
    } catch (err) {
        console.log(errString, err)
        return null
    }
}
function tokenCreation(user: {
    id: string,
    email: string,
}) {

    const payload = {
        ...user
    }

    return jwt.sign(payload, process.env.SECRET as string, { expiresIn: "2h" });
}
