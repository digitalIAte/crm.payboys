"use server";

import { updateLead, createActivity } from "@/lib/api";
import axios from "axios";
import https from "https";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const API_URL = process.env.N8N_WEBHOOK_URL || "https://n8n.javiasl.es/webhook";
const API_KEY = process.env.N8N_API_KEY || "sk_dash_67890";
const WHATSAPP_WEBHOOK_ID = process.env.N8N_WHATSAPP_WEBHOOK_ID || "b949a121-d460-4c43-8bbb-12dad5eafab4";
const EMAIL_WEBHOOK_ID = process.env.N8N_EMAIL_WEBHOOK_ID || "5e98b182-ec37-41c3-839e-7fb4a473a624";

export async function submitLeadUpdate(id: string, updates: any) {
    const success = await updateLead(id, updates);
    if (success) {
        revalidatePath(`/crm/leads/${id}`);
        revalidatePath(`/crm/leads`);
    }
    return success;
}

export async function submitNewActivity(payload: any) {
    const success = await createActivity(payload);
    if (success) {
        revalidatePath(`/crm/leads/${payload.lead_id}`);
    }
    return success;
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
        // Call internal Next.js API route — deletes directly from Postgres
        // Requires DATABASE_URL env var in EasyPanel
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://crm-crm.vvy9xr.easypanel.host";
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        const res = await axios.delete(
            `${appUrl}/api/leads/${encodeURIComponent(id)}`,
            { httpsAgent }
        );
        if (res.status < 200 || res.status >= 300) return false;
    } catch (error: any) {
        console.error("Delete lead error:", error?.response?.status, error?.response?.data || error.message);
        return false;
    }
    revalidatePath("/crm/leads");
    revalidatePath("/crm");
    return true;
}
