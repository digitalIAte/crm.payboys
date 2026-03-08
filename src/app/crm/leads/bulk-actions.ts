"use server";
import { revalidatePath } from "next/cache";
import pool from "@/lib/db";

export async function bulkUpdateStatus(ids: string[], status: string): Promise<boolean> {
    try {
        if (ids.length === 0) return true;
        const client = await pool.connect();
        try {
            await client.query(
                "UPDATE leads SET status = $1, updated_at = NOW() WHERE id = ANY($2::uuid[])",
                [status, ids]
            );
        } finally {
            client.release();
        }
        revalidatePath("/crm/leads");
        revalidatePath("/crm");
        return true;
    } catch (e: any) {
        console.error("Bulk status update DB error:", e.message);
        return false;
    }
}

export async function bulkDeleteLeads(ids: string[]): Promise<boolean> {
    try {
        if (ids.length === 0) return true;
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query("DELETE FROM activities WHERE lead_id = ANY($1::uuid[])", [ids]);
            await client.query("DELETE FROM conversations WHERE lead_id = ANY($1::uuid[])", [ids]);
            await client.query("DELETE FROM reminders WHERE lead_id = ANY($1::uuid[])", [ids]);
            await client.query("DELETE FROM leads WHERE id = ANY($1::uuid[])", [ids]);
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
    } catch (e: any) {
        console.error("Bulk delete DB error:", e.message);
        return false;
    }
}

import { addKanbanColumn as addCol, updateKanbanColumn as updateCol } from "@/lib/services";

export async function addKanbanColumnAction(title: string, color: string): Promise<boolean> {
    const success = await addCol(title, color);
    if (success) {
        revalidatePath("/crm/leads");
        revalidatePath("/crm");
    }
    return success;
}

export async function updateKanbanColumnAction(id: string, title: string): Promise<boolean> {
    const success = await updateCol(id, title);
    if (success) {
        revalidatePath("/crm/leads");
        revalidatePath("/crm");
    }
    return success;
}
