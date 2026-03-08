import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    const client = await pool.connect();
    try {
        // Get database name
        const dbRes = await client.query("SELECT current_database()");
        const dbName = dbRes.rows[0].current_database;

        // Get all tables in public schema
        const tablesRes = await client.query(`
            SELECT table_name, 
                   (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
            FROM information_schema.tables t
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        // Try to count leads
        let leadsCount = 0;
        try {
            const countRes = await client.query("SELECT COUNT(*) FROM leads");
            leadsCount = parseInt(countRes.rows[0].count);
        } catch (e) { }

        return NextResponse.json({
            database: dbName,
            tables: tablesRes.rows,
            leadsCount,
            env: {
                DATABASE_URL_PREVIEW: process.env.DATABASE_URL
                    ? process.env.DATABASE_URL.replace(/:[^@]+@/, ":****@")
                    : "NOT SET"
            }
        });
    } finally {
        client.release();
    }
}
