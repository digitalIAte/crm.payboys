import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const client = await pool.connect();
        try {
            const result = await client.query(`SELECT * FROM pb_templates ORDER BY name ASC`);
            return NextResponse.json({ templates: result.rows });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error("Fetch templates DB error:", error.message);
        return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, channel, subject, body } = await request.json();

        if (!name || !channel || !body) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            const result = await client.query(
                `INSERT INTO pb_templates (name, channel, subject, body) VALUES ($1, $2, $3, $4) RETURNING *`,
                [name, channel, subject || null, body]
            );
            return NextResponse.json({ template: result.rows[0] });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error("Create template DB error:", error.message);
        return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
    }
}
