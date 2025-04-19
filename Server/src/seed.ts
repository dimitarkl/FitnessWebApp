// filepath: c:\Users\nekav\Documents\GitHub\FitnessWebApp\Server\src\seed.ts
import db from './db';
import { exerciseTable } from './db/schema';
import { standardExercises } from './seed-data/exercises';
import { eq } from 'drizzle-orm';

async function seedDatabase() {
    console.log('Seeding database...');

    for (const exercise of standardExercises) {
        try {
            // Check if exercise already exists by name
            const existing = await db.select({ id: exerciseTable.id })
                                     .from(exerciseTable)
                                     .where(eq(exerciseTable.name, exercise.name))
                                     .limit(1);

            if (existing.length === 0) {
                // Insert if it doesn't exist
                await db.insert(exerciseTable).values(exercise);
                console.log(`Inserted exercise: ${exercise.name}`);
            } else {
                console.log(`Exercise already exists: ${exercise.name}`);
                // Optional: Update existing exercise if needed
            }
        } catch (error) {
            console.error(`Failed to seed exercise ${exercise.name}:`, error);
        }
    }

    console.log('Database seeding finished.');
    // Ensure the script exits cleanly, especially if run standalone
    process.exit(0);
}

seedDatabase().catch(error => {
    console.error('Database seeding failed:', error);
    process.exit(1);
});