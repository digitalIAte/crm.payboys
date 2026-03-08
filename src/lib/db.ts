import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    ssl: (!connectionString || connectionString.includes("localhost") || connectionString.includes("sslmode=disable"))
        ? false
        : { rejectUnauthorized: false },
});

export default pool;
