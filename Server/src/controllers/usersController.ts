import { Request, Response } from 'express';

export const getMe = (req: Request, res: Response) => {
    console.log("GET: users/me");
    if (req.user) {
        res.json({
            authenticated: true, user: {
                id: req.user.id,
                email: req.user.email,
                username: req.user.username || '',
                preferredWeightUnit: req.user.preferredWeightUnit || 'kg',
            },
        });
    } else {
        res.json({ authenticated: false });
    }
}