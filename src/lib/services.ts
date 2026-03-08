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

export async function getLeads(): Promise<Lead[]> {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT * FROM leads 
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
        const leadRes = await client.query("SELECT * FROM leads WHERE id = $1", [id]);
        if (leadRes.rows.length === 0) return null;

        const convsRes = await client.query(
            "SELECT * FROM conversations WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",
            [id]
        );
        const actsRes = await client.query(
            "SELECT * FROM activities WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",
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
            SELECT * FROM kanban_columns ORDER BY position ASC
        `);
        return result.rows;
    } catch (e: any) {
        // Auto-migrate if table does not exist
        if (e.code === '42P01' || e.message.includes('kanban_columns')) {
            console.log("kanban_columns table missing. Auto-creating...");
            await client.query(`
                CREATE TABLE IF NOT EXISTS kanban_columns (
                    id VARCHAR(50) PRIMARY KEY,
                    title VARCHAR(100) NOT NULL,
                    color VARCHAR(100) DEFAULT 'border-gray-200 bg-gray-50/50',
                    position INT DEFAULT 0
                );
                
                INSERT INTO kanban_columns (id, title, color, position) VALUES
                ('new', 'Nuevos', 'border-blue-200 bg-blue-50/50', 0),
                ('contacted', 'Contactados', 'border-yellow-200 bg-yellow-50/50', 1),
                ('qualified', 'Cualificados', 'border-emerald-200 bg-emerald-50/50', 2),
                ('lost', 'Perdidos', 'border-red-200 bg-red-50/50', 3)
                ON CONFLICT (id) DO NOTHING;
            `);
            const retryResult = await client.query(`
                SELECT * FROM kanban_columns ORDER BY position ASC
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
        // Get max position
        const posRes = await client.query("SELECT COALESCE(MAX(position), -1) + 1 as next_pos FROM kanban_columns");
        const nextPos = posRes.rows[0].next_pos;

        await client.query(
            "INSERT INTO kanban_columns (id, title, color, position) VALUES ($1, $2, $3, $4)",
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
        await client.query("UPDATE kanban_columns SET title = $1 WHERE id = $2", [title, id]);
        return true;
    } catch (e: any) {
        console.error("Update column error:", e.message);
        return false;
    } finally {
        client.release();
    }
}
