"use server";

import axios from "axios";
import https from "https";
import { revalidatePath } from "next/cache";
import pool from "@/lib/db";
import { Lead } from "@/lib/api";

const API_URL = process.env.N8N_WEBHOOK_URL || "https://n8n.javiasl.es/webhook";
const WHATSAPP_WEBHOOK_ID = process.env.N8N_WHATSAPP_WEBHOOK_ID || "b949a121-d460-4c43-8bbb-12dad5eafab4";
const EMAIL_WEBHOOK_ID = process.env.N8N_EMAIL_WEBHOOK_ID || "5e98b182-ec37-41c3-839e-7fb4a473a624";

export async function submitLeadUpdate(id: string, updates: any) {
    try {
        const client = await pool.connect();
        try {
            const fields = Object.keys(updates);
            if (fields.length === 0) return true;

            const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
            const values = fields.map(f => updates[f]);

            await client.query(
                `UPDATE leads SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1}`,
                [...values, id]
            );
        } finally {
            client.release();
        }
        revalidatePath(`/crm/leads/${id}`);
        revalidatePath(`/crm/leads`);
        return true;
    } catch (e: any) {
        console.error("Direct update lead error:", e.message);
        return false;
    }
}

export async function submitNewActivity(payload: any) {
    try {
        const client = await pool.connect();
        try {
            await client.query(
                `INSERT INTO activities (lead_id, type, note, source) VALUES ($1, $2, $3, $4)`,
                [payload.lead_id, payload.type, payload.note, payload.source || 'Dashboard User']
            );
        } finally {
            client.release();
        }
        revalidatePath(`/crm/leads/${payload.lead_id}`);
        return true;
    } catch (e: any) {
        console.error("Direct create activity error:", e.message);
        return false;
    }
}

export async function triggerWhatsApp(lead: any, message: string) {
    if (!lead || !lead.phone) return false;
    try {
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        const res = await axios.post(`${API_URL}/${WHATSAPP_WEBHOOK_ID}`, {
            phone_number: lead.phone,
            message: message,
            lead: lead // Included entire lead object for N8N context
        }, {
            headers: {
                "Content-Type": "application/json"
            },
            httpsAgent
        });
        return res.status >= 200 && res.status < 300;
    } catch (error) {
        console.error("WhatsApp trigger error", error);
        return false;
    }
}

export async function triggerEmail(lead: any, subject: string, copy: string) {
    if (!lead || !lead.email) return false;
    try {
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        const res = await axios.post(`${API_URL}/${EMAIL_WEBHOOK_ID}`, {
            email: lead.email,
            subject: subject,
            message: copy,
            lead: lead // Included entire lead object for N8N context
        }, {
            headers: {
                "Content-Type": "application/json"
            },
            httpsAgent
        });
        return res.status >= 200 && res.status < 300;
    } catch (error) {
        console.error("Email trigger error", error);
        return false;
    }
}

export async function deleteLead(id: string, email: string): Promise<boolean> {
    try {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query("DELETE FROM activities WHERE lead_id = $1", [id]);
            await client.query("DELETE FROM conversations WHERE lead_id = $1", [id]);
            await client.query("DELETE FROM reminders WHERE lead_id = $1", [id]);
            await client.query("DELETE FROM leads WHERE id = $1", [id]);
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
        revalidatePath("/crm/leads");
        revalidatePath("/crm");
        return true;
    } catch (error: any) {
        console.error("Direct delete lead error:", error.message);
        return false;
    }
}
