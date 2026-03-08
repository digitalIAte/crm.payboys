import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
});

// GET /api/reminders?leadId=123 (or all pending if no leadId)
export async function GET(request: NextRequest) {
    const leadId = request.nextUrl.searchParams.get("leadId");

    try {
        const client = await pool.connect();
        try {
            let query = `
                SELECT r.*, l.name as lead_name 
                FROM reminders r
                LEFT JOIN leads l ON r.lead_id = l.id
            `;
            const params = [];

            if (leadId) {
                query += ` WHERE r.lead_id = $1 ORDER BY r.due_date ASC`;
                params.push(leadId);
            } else {
                query += ` WHERE r.done = false ORDER BY r.due_date ASC LIMIT 50`;
            }

            const result = await client.query(query, params);
            return NextResponse.json({ reminders: result.rows });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error("Fetch reminders DB error:", error.message);
        return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 });
    }
}

// POST /api/reminders
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { lead_id, text, due_date } = body;

        if (!lead_id || !text || !due_date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            const result = await client.query(
                `INSERT INTO reminders (lead_id, text, due_date) VALUES ($1, $2, $3) RETURNING *`,
                [lead_id, text, due_date]
            );
            return NextResponse.json({ reminder: result.rows[0] });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error("Create reminder DB error:", error.message);
        return NextResponse.json({ error: "Failed to create reminder" }, { status: 500 });
    }
}

// PATCH /api/reminders
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, done } = body;

        if (!id || done === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            const result = await client.query(
                `UPDATE reminders SET done = $1 WHERE id = $2 RETURNING *`,
                [done, id]
            );
            return NextResponse.json({ reminder: result.rows[0] });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error("Update reminder DB error:", error.message);
        return NextResponse.json({ error: "Failed to update reminder" }, { status: 500 });
    }
}
