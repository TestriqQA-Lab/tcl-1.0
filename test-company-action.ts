import { getCompanyProfileById } from "./src/actions/company.actions";
import { db } from "./src/lib/db/db";

async function run() {
    const userId = "30623ae6-d284-4499-858b-e78ee1041520"; // From browser subagent
    console.log("Fetching for:", userId);
    try {
        const company = await getCompanyProfileById(userId);
        console.log("Result:", company);
    } catch (e) {
        console.error("Failed:", e);
    }
    process.exit(0);
}

run();
