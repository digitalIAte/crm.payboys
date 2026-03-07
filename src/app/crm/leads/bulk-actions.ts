"use server";
import { revalidatePath } from "next/cache";
import axios from "axios";
import https from "https";

const API_URL = process.env.N8N_WEBHOOK_URL || "https://n8n.javiasl.es/webhook";
const API_KEY = process.env.N8N_API_KEY || "sk_dash_67890";
const UPDATE_LEAD_WEBHOOK_ID = process.env.N8N_UPDATE_LEAD_WEBHOOK_ID || "ac177c2e-c6fe-4f34-a734-56da8a44993d";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export async function bulkUpdateStatus(ids: string[], status: string): Promise<boolean> {
    try {
        await Promise.all(ids.map(id =>
            axios.patch(`${API_URL}/${UPDATE_LEAD_WEBHOOK_ID}?id=${id}`, { status }, {
                headers: { "X-API-KEY": API_KEY, "Content-Type": "application/json" },
                httpsAgent
            })
        ));
        revalidatePath("/crm/leads");
        revalidatePath("/crm");
        return true;
    } catch (e: any) {
        console.error("Bulk status update error:", e.message);
        return false;
    }
}

export async function bulkDeleteLeads(ids: string[]): Promise<boolean> {
    try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://crm-crm.vvy9xr.easypanel.host";
        await Promise.all(ids.map(id =>
            axios.delete(`${appUrl}/api/leads/${encodeURIComponent(id)}`, { httpsAgent })
        ));
        revalidatePath("/crm/leads");
        revalidatePath("/crm");
        return true;
    } catch (e: any) {
        console.error("Bulk delete error:", e.message);
        return false;
    }
}
