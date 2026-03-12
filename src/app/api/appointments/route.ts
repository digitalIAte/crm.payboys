import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import pool from "@/lib/db";

export async function GET() {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT a.id, a.title, a.start_time, a.end_time, a.status, a.meeting_url, 
                   l.name as lead_name, l.email as lead_email, l.id as lead_id
            from pb_appointments a
            LEFT JOIN pb_leads l ON a.lead_id = l.id
            ORDER BY a.start_time ASC
        `);
        return NextResponse.json(res.rows);
    } catch (error) {
        console.error("GET /api/appointments Error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    } finally {
        client.release();
    }
}
