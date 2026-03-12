"use server";

import pool from "@/lib/db";

export async function runKanbanMigration() {
    try {
        const client = await pool.connect();
        try {
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
            console.log("Migration successful.");
            return true;
        } finally {
            client.release();
        }
    } catch (e) {
        console.error("Migration failed:", e);
        return false;
    }
}
