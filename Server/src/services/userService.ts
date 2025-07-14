import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { User } from '@shared/types/user';
import db from '../db';
import { usersTable } from '../db/schema';

export const updateUser = async (userId: string, username: string, weightUnit: string) => {
    try {
        return await db.update(usersTable).set({
            username: username || null,
            preferred_weight_unit: weightUnit || 'kg',
        }).where(eq(usersTable.id, BigInt(userId)))
            .returning({
                id: usersTable.id
            })

    } catch (err) {
        console.error("Error updating user:", err);
        throw new Error("Failed to update user");
    }
}
export const getUser = async (userId: string): Promise<User> => {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, BigInt(userId)))

    return {
        id: String(user.id),
        username: user.username,
        email: user.email,
        preferredWeightUnit: user.preferred_weight_unit
    }
}