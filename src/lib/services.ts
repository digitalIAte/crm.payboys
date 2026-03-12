import pool from "./db";

export interface Lead {
    id: string;
    email: string;
    phone?: string;
    name: string;
    status: string;
    stage: string;
    score: number;
    owner_email: string;
    created_at: string;
    tags?: string[];
    source?: string;
}

// All Payboys tables use the pb_ prefix to be independent from Digitaliate
// within the shared 'crm' database

export async function getLeads(): Promise<Lead[]> {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT * FROM pb_leads 
            ORDER BY created_at DESC 
            LIMIT 1000
        `);
        return result.rows;
    } finally {
        client.release();
    }
}

export async function getLeadById(id: string) {
    const client = await pool.connect();
    try {
        const leadRes = await client.query("SELECT * FROM pb_leads WHERE id = $1", [id]);
        if (leadRes.rows.length === 0) return null;

        const convsRes = await client.query(
            "SELECT * FROM pb_conversations WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",
            [id]
        );
        const actsRes = await client.query(
            "SELECT * FROM pb_activities WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",
            [id]
        );

        return {
            lead: leadRes.rows[0],
            conversations: convsRes.rows,
            activities: actsRes.rows
        };
    } finally {
        client.release();
    }
}

export interface KanbanColumn {
    id: string;
    title: string;
    color: string;
    position: number;
}

export async function getKanbanColumns(): Promise<KanbanColumn[]> {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT * FROM pb_kanban_columns ORDER BY position ASC
        `);
        return result.rows;
    } catch (e: any) {
        // Auto-create if table does not exist
        if (e.code === '42P01' || e.message.includes('pb_kanban_columns')) {
            console.log("pb_kanban_columns table missing. Auto-creating...");
            await client.query(`
                CREATE TABLE IF NOT EXISTS pb_kanban_columns (
                    id VARCHAR(50) PRIMARY KEY,
                    title VARCHAR(100) NOT NULL,
                    color VARCHAR(100) DEFAULT 'border-neutral-800 bg-neutral-900',
                    position INT DEFAULT 0
                );
                
                INSERT INTO pb_kanban_columns (id, title, color, position) VALUES
                ('new', 'Nuevos', 'border-yellow-500 bg-yellow-900/10', 0),
                ('contacted', 'Contactados', 'border-orange-500 bg-orange-900/10', 1),
                ('qualified', 'Cualificados', 'border-emerald-500 bg-emerald-900/10', 2),
                ('lost', 'Perdidos', 'border-red-800 bg-red-900/10', 3)
                ON CONFLICT (id) DO NOTHING;
            `);
            const retryResult = await client.query(`
                SELECT * FROM pb_kanban_columns ORDER BY position ASC
            `);
            return retryResult.rows;
        }
        throw e;
    } finally {
        client.release();
    }
}

export async function addKanbanColumn(title: string, color: string): Promise<boolean> {
    const client = await pool.connect();
    try {
        const id = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        const posRes = await client.query("SELECT COALESCE(MAX(position), -1) + 1 as next_pos FROM pb_kanban_columns");
        const nextPos = posRes.rows[0].next_pos;
        await client.query(
            "INSERT INTO pb_kanban_columns (id, title, color, position) VALUES ($1, $2, $3, $4)",
            [id, title, color, nextPos]
        );
        return true;
    } catch (e: any) {
        console.error("Add column error:", e.message);
        return false;
    } finally {
        client.release();
    }
}

export async function updateKanbanColumn(id: string, title: string): Promise<boolean> {
    const client = await pool.connect();
    try {
        await client.query("UPDATE pb_kanban_columns SET title = $1 WHERE id = $2", [title, id]);
        return true;
    } catch (e: any) {
        console.error("Update column error:", e.message);
        return false;
    } finally {
        client.release();
    }
}

export async function getWorkspaceSettings() {
    const client = await pool.connect();
    try {
        const res = await client.query("SELECT * FROM pb_workspace_settings WHERE id = 1");
        // Ensure defaults if not found
        if (res.rows.length === 0) {
            return {
                id: 1,
                agency_name: 'PAYBOYS CRM',
                primary_color: '#B08D57',
                n8n_webhook_url: null,
                calendly_url: null
            };
        }
        return res.rows[0];
    } catch (e) {
        // Migration fallback if table missing
        return {
            id: 1,
            agency_name: 'PAYBOYS CRM',
            primary_color: '#B08D57',
            n8n_webhook_url: null,
            calendly_url: null
        };
    } finally {
        client.release();
    }
}

export async function updateWorkspaceSettings(agency_name: string, n8n_webhook_url: string, primary_color: string, calendly_url: string) {
    const client = await pool.connect();
    try {
        // Create if missing
        await client.query(`
            INSERT INTO pb_workspace_settings (id, agency_name, calendly_url, primary_color, n8n_webhook_url)
            VALUES (1, $1, $4, $3, $2)
            ON CONFLICT (id) DO UPDATE 
            SET agency_name = $1, n8n_webhook_url = $2, primary_color = $3, calendly_url = $4
            WHERE pb_workspace_settings.id = 1
        `, [agency_name, n8n_webhook_url, primary_color, calendly_url]);
        return true;
    } catch (e) {
        console.error("Update settings error:", e);
        return false;
    } finally {
        client.release();
    }
}

import bcrypt from "bcryptjs";

export async function updatePassword(userId: string, currentPass: string, newPass: string) {
    const client = await pool.connect();
    try {
        const res = await client.query("SELECT password FROM pb_users WHERE id = $1", [userId]);
        if (res.rows.length === 0) return { success: false, error: "Usuario no encontrado" };

        const isValid = await bcrypt.compare(currentPass, res.rows[0].password);
        if (!isValid) return { success: false, error: "Contraseña actual incorrecta" };

        const hashed = await bcrypt.hash(newPass, 10);
        await client.query("UPDATE pb_users SET password = $1 WHERE id = $2", [hashed, userId]);
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    } finally {
        client.release();
    }
}

export async function ensureDatabaseReady() {
    // Basic verification - assume install route handled full schema
    return true;
}
