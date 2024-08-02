import { MongoClient, ServerApiVersion } from "mongodb";

export const db_client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

export async function db_startup() {
    try {
        await db_client.connect();
        await db_client.db("admin").command({ping: 1});
        console.log("Successfully pinged database");
    } 
    catch(e) {
        console.error("Failed to connect to database...");
    }
}
