import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getLeadById } from "@/lib/services";

export const dynamic = "force-dynamic";

// GET /api/leads/[id] - Lead details + conversations + activities
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    if (!id) return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });

    try {
        const data = await getLeadById(id);
        if (!data) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Fetch lead details error:", error.message);
        return NextResponse.json({ error: "Failed to fetch lead details" }, { status: 500 });
    }
}

// PATCH /api/leads/[id] - Update lead details
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const body = await request.json();
    if (!id) return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });

    try {
        const client = await pool.connect();
        try {
            const fields = Object.keys(body);
            if (fields.length === 0) return NextResponse.json({ error: "No fields to update" }, { status: 400 });

            const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
            const values = fields.map(f => body[f]);

            await client.query(
                `UPDATE pb_leads SET ${setClause} WHERE id = $${fields.length + 1}`,
                [...values, id]
            );
            return NextResponse.json({ success: true });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error("Update lead DB error:", error.message);
        return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
    }
}

// DELETE /api/leads/[id] - Delete lead + history
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    if (!id) return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });

    try {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query("DELETE FROM pb_activities WHERE lead_id = $1", [id]);
            await client.query("DELETE FROM pb_conversations WHERE lead_id = $1", [id]);
            const result = await client.query("DELETE FROM pb_leads WHERE id = $1 RETURNING id", [id]);
            await client.query("COMMIT");
            if (result.rowCount === 0) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
            return NextResponse.json({ success: true, deletedId: id });
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error("Delete lead DB error:", error.message);
        return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
    }
}
