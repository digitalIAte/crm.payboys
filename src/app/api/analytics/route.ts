import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const client = await pool.connect();
        try {
            // 1. Status distribution
            const statusRes = await client.query(`
                SELECT status, COUNT(*) as count 
                FROM leads 
                WHERE status IS NOT NULL AND status != ''
                GROUP BY status
            `);

            // 2. Leads by day (last 7 days)
            const daysRes = await client.query(`
                SELECT DATE(created_at) as date, COUNT(*) as count
                FROM leads
                WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
                GROUP BY DATE(created_at)
                ORDER BY date ASC
            `);

            // 3. Score distribution
            const scoreRes = await client.query(`
                SELECT 
                    SUM(CASE WHEN score < 30 THEN 1 ELSE 0 END) as low,
                    SUM(CASE WHEN score >= 30 AND score < 70 THEN 1 ELSE 0 END) as medium,
                    SUM(CASE WHEN score >= 70 THEN 1 ELSE 0 END) as high
                FROM leads
            `);

            return NextResponse.json({
                statusDistribution: statusRes.rows,
                leadsByDay: daysRes.rows,
                scoreDistribution: scoreRes.rows[0]
            });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error("Fetch analytics DB error:", error.message);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
