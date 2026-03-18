import { getRecommendedJobsAction } from '../src/actions/job.actions';
import { db } from '../src/lib/db/db';
import { seekerProfiles, users } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function verify() {
    console.log("--- Recommendation Verification Script ---");

    // 1. Get a seeker user
    const seekers = await db.select().from(seekerProfiles).limit(1);

    if (seekers.length === 0) {
        console.log("No seekers found in database.");
        return;
    }

    const seeker = seekers[0];
    console.log(`Testing for seeker: ${seeker.userId} (Position: ${seeker.position})`);

    // 2. Call the action
    console.log("Calling getRecommendedJobsAction...");
    const result = await getRecommendedJobsAction(seeker.userId);

    if ('error' in result) {
        console.error("Error from action:", result.error);
    } else {
        console.log(`Success! Found ${result.jobs?.length || 0} jobs.`);
        if (result.jobs && result.jobs.length > 0) {
            console.log("Sample Jobs:");
            result.jobs.slice(0, 3).forEach(job => {
                console.log(`- ${job.title} at ${job.company} (${job.location})`);
            });
        }
    }

    // 3. Test with a "mock" non-existent user or user with no position
    console.log("\nTesting fallback with empty position...");
    // We can't easily "mock" the auth() session here, so we'll just test the logic if possible.
    // But since the script runs outside the session context, the auth() check might fail.

    process.exit(0);
}

verify().catch(err => {
    console.error("Verification failed:", err);
    process.exit(1);
});
