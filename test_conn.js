const { Client } = require("pg");
require("dotenv").config();

async function run() {
    console.log("Connecting to:", process.env.DATABASE_URL);
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes("localhost")
            ? false
            : { rejectUnauthorized: false },
    });

    console.time("Connect");
    try {
        await client.connect();
        console.timeEnd("Connect");

        console.time("Query Leads");
        const res = await client.query("SELECT COUNT(*) FROM leads");
        console.timeEnd("Query Leads");
        console.log("Leads count:", res.rows[0].count);

    } catch (e) {
        console.error("error:", e);
    } finally {
        await client.end();
    }
}
run();
