const { Client } = require("pg");

async function run() {
    const cStr = 'postgres://postgres:e21ae9a767726405dffa@37.97.55.111:5432/crm?sslmode=disable';

    // Test without SSL
    console.log("Testing WITHOUT SSL");
    const client1 = new Client({ connectionString: cStr, ssl: false });
    console.time("conn_no_ssl");
    try {
        await client1.connect();
        console.timeEnd("conn_no_ssl");
        console.log("Success!");
    } catch (e) {
        console.error("Failed without SSL:", e.message);
    } finally {
        await client1.end().catch(() => { });
    }

    // Test with SSL
    console.log("Testing WITH SSL object");
    const client2 = new Client({ connectionString: cStr, ssl: { rejectUnauthorized: false } });
    console.time("conn_ssl");
    try {
        await client2.connect();
        console.timeEnd("conn_ssl");
        console.log("Success with SSL!");
    } catch (e) {
        console.error("Failed with SSL:", e.message);
    } finally {
        await client2.end().catch(() => { });
    }
}

run();
