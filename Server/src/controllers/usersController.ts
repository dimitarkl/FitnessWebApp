import { Request, Response } from 'express';
import { getUser, updateUser } from '../services/userService';

export const getMe = async (req: Request, res: Response) => {
    console.log("GET: users/me");
    if (req.user) {
        const user = await getUser(req.user.id)
        res.json({ authenticated: true, user })
    } else {
        res.json({ authenticated: false });
    }
}
export const updateMe = async (req: Request, res: Response) => {
    console.log("PUT: users/me");
    const { username, weightUnit } = req.body;
    if (!req.user)
        res.status(401).json({ error: 'User not authenticated' });
    else if (!username || !weightUnit) {
        res.status(400).json({ error: 'Username and weight unit are required' });

    }
    try {
        await updateUser(req.user.id, username, weightUnit)
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: 'Failed to update user' });
    }

}

export const getUserById = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) res.sendStatus(400)

    const user = await getUser(id);
    res.json(user)
}