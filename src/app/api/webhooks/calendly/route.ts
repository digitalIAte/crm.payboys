import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Expected payload from n8n / Calendly
        const { lead_id, email, title, start_time, end_time, meeting_url } = body;

        let targetLeadId = lead_id;

        const client = await pool.connect();
        try {
            // Priority 1: Use provided lead_id
            // Priority 2: Find lead by email if no lead_id is provided
            if (!targetLeadId && email) {
                const leadRes = await client.query("SELECT id FROM pb_leads WHERE email = $1 LIMIT 1", [email]);
                if (leadRes.rows.length > 0) {
                    targetLeadId = leadRes.rows[0].id;
                }
            }

            if (!targetLeadId) {
                return NextResponse.json({ error: "Lead not found. Please provide lead_id or email matching a lead." }, { status: 404 });
            }

            // Insert the appointment
            const result = await client.query(
                `INSERT into pb_appointments (lead_id, title, start_time, end_time, meeting_url) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [targetLeadId, title || "Reunión de Calendly", new Date(start_time), new Date(end_time), meeting_url]
            );

            // Also add an activity record so it shows up in the lead timeline
            await client.query(
                `INSERT INTO pb_activities (lead_id, type, note, source) VALUES ($1, $2, $3, $4)`,
                [targetLeadId, "meeting", `Nueva cita agendada: ${title || 'Calendly'} para el ${new Date(start_time).toLocaleString()}`, "Calendly/N8N"]
            );

            // Update lead status to "contacted" if it was "new" (optional automated pipeline movement)
            await client.query(
                `UPDATE pb_leads SET stage = 'contacted' WHERE id = $1 AND stage = 'new'`,
                [targetLeadId]
            );

            return NextResponse.json({ success: true, appointmentId: result.rows[0].id });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error("Webhook Calendly Error:", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
