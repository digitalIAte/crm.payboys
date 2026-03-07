"use server";

import { updateLead, createActivity } from "@/lib/api";
import axios from "axios";
import https from "https";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const API_URL = process.env.N8N_WEBHOOK_URL || "https://n8n.javiasl.es/webhook";
const API_KEY = process.env.N8N_API_KEY || "sk_dash_67890";

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
        const res = await axios.post(`${API_URL}/api/crm-payboys/whatsapp`, {
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
        const res = await axios.post(`${API_URL}/api/crm-payboys/email`, {
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
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        await axios.delete(`${API_URL}/api/crm-payboys/gdpr/delete/${encodeURIComponent(email)}`, {
            headers: { "X-API-KEY": API_KEY },
            httpsAgent
        });
    } catch (error) {
        console.error("Delete lead error", error);
        // Continue even if n8n webhook fails - the DB delete might still work
    }
    revalidatePath("/crm/leads");
    revalidatePath("/crm");
    return true;
}
