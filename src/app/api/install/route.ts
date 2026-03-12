import { NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
    });

    const client = await pool.connect();
    try {
        const dbRes = await client.query("SELECT current_database()");
        const dbName = dbRes.rows[0].current_database;

        // Create all Payboys (pb_*) tables
        await client.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

            CREATE TABLE IF NOT EXISTS pb_leads (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                email VARCHAR(255) UNIQUE,
                phone VARCHAR(50),
                name VARCHAR(255),
                company VARCHAR(255),
                status VARCHAR(50) DEFAULT 'new',
                stage VARCHAR(50) DEFAULT 'inbound',
                score INT DEFAULT 0,
                intent VARCHAR(100),
                risk_flags JSONB DEFAULT '[]'::jsonb,
                owner_email VARCHAR(255),
                notes TEXT,
                source VARCHAR(50),
                utm_source VARCHAR(100),
                utm_medium VARCHAR(100),
                utm_campaign VARCHAR(100),
                utm_content VARCHAR(100),
                utm_term VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS idx_pb_leads_email ON pb_leads(email);
            CREATE INDEX IF NOT EXISTS idx_pb_leads_phone ON pb_leads(phone);
            CREATE INDEX IF NOT EXISTS idx_pb_leads_status ON pb_leads(status);
            CREATE INDEX IF NOT EXISTS idx_pb_leads_owner ON pb_leads(owner_email);

            CREATE TABLE IF NOT EXISTS pb_conversations (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                lead_id UUID REFERENCES pb_leads(id) ON DELETE CASCADE,
                session_id VARCHAR(255),
                message TEXT,
                transcript TEXT,
                source VARCHAR(50) DEFAULT 'chatbot',
                page_url TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS pb_activities (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                lead_id UUID REFERENCES pb_leads(id) ON DELETE CASCADE,
                type VARCHAR(50),
                note TEXT,
                source VARCHAR(50),
                owner_email VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS pb_reminders (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                lead_id UUID REFERENCES pb_leads(id) ON DELETE CASCADE,
                text TEXT NOT NULL,
                due_date TIMESTAMP WITH TIME ZONE NOT NULL,
                done BOOLEAN DEFAULT false,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS pb_templates (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(255) NOT NULL,
                channel VARCHAR(50) NOT NULL,
                subject TEXT,
                body TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

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

            CREATE TABLE IF NOT EXISTS pb_workspace_settings (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                calendly_url VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            INSERT INTO pb_workspace_settings (calendly_url)
            SELECT NULL WHERE NOT EXISTS (SELECT * FROM pb_workspace_settings);

            CREATE TABLE IF NOT EXISTS pb_appointments (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                lead_id UUID REFERENCES pb_leads(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                status VARCHAR(50) DEFAULT 'scheduled',
                start_time TIMESTAMP WITH TIME ZONE NOT NULL,
                end_time TIMESTAMP WITH TIME ZONE NOT NULL,
                meeting_url TEXT,
                external_id VARCHAR(255) UNIQUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS pb_users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE OR REPLACE FUNCTION pb_update_updated_at()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ language 'plpgsql';

            DO $$
            BEGIN
              IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'pb_update_leads_updated_at') THEN
                CREATE TRIGGER pb_update_leads_updated_at
                BEFORE UPDATE ON pb_leads
                FOR EACH ROW
                EXECUTE FUNCTION pb_update_updated_at();
              END IF;
            END $$;
        `);

        const tablesRes = await client.query(`
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name LIKE 'pb_%'
            ORDER BY table_name
        `);

        // Admin User Check for Payboys
        const adminCheck = await client.query("SELECT * FROM pb_users WHERE email = $1", ["admin@payboys.es"]);
        if (adminCheck.rows.length === 0) {
            console.log("Provisioning default admin user for Payboys...");
            const hashed = await bcrypt.hash("admin123", 10);
            await client.query(
                "INSERT INTO pb_users (name, email, password) VALUES ($1, $2, $3)",
                ["Admin Payboys", "admin@payboys.es", hashed]
            );
        }

        return NextResponse.json({
            success: true,
            message: `✅ Payboys tables created in "${dbName}"!`,
            database: dbName,
            tables_created: tablesRes.rows.map((r: { table_name: string }) => r.table_name),
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    } finally {
        client.release();
        await pool.end();
    }
}
