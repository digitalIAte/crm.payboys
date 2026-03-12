const { Client } = require('pg');

const BASE_URL = 'postgres://postgres:e21ae9a767726405dffa@37.97.55.111:5432/crm?sslmode=disable';
const TARGET_DB = 'crm_payboys';
const NEW_URL = `postgres://postgres:e21ae9a767726405dffa@37.97.55.111:5432/${TARGET_DB}?sslmode=disable`;

async function setup() {
    let client = new Client({
        connectionString: BASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("Connecting to default DB to create crm_payboys...");
        await client.connect();

        // Postgres does not support CREATE DATABASE IF NOT EXISTS directly, so we check first
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${TARGET_DB}'`);
        if (res.rowCount === 0) {
            console.log(`Database ${TARGET_DB} not found. Creating...`);
            await client.query(`CREATE DATABASE ${TARGET_DB}`);
            console.log("Database created successfully!");
        } else {
            console.log(`Database ${TARGET_DB} already exists.`);
        }
    } catch (e) {
        console.error("Error creating database:", e);
        return;
    } finally {
        await client.end();
    }

    // Now connect to the new DB to set up the schema
    console.log(`Connecting to ${TARGET_DB} to setup schema...`);
    const newClient = new Client({
        connectionString: NEW_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await newClient.connect();
        console.log(`Connected to ${TARGET_DB}. Creating tables...`);

        const sql = `
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

            CREATE TABLE IF NOT EXISTS leads (
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

            CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
            CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
            CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
            CREATE INDEX IF NOT EXISTS idx_leads_owner ON leads(owner_email);

            CREATE TABLE IF NOT EXISTS conversations (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
                session_id VARCHAR(255),
                message TEXT,
                transcript TEXT,
                source VARCHAR(50) DEFAULT 'chatbot',
                page_url TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS activities (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
                type VARCHAR(50), 
                note TEXT,
                owner_email VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ language 'plpgsql';

            DO $$
            BEGIN
              IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_leads_updated_at') THEN
                CREATE TRIGGER update_leads_updated_at
                BEFORE UPDATE ON leads
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
              END IF;
            END $$;

            -- Auto-generate Kanban columns for Payboys
            CREATE TABLE IF NOT EXISTS kanban_columns (
                id VARCHAR(50) PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                color VARCHAR(100) DEFAULT 'border-neutral-800 bg-neutral-900',
                position INT DEFAULT 0
            );
            
            INSERT INTO kanban_columns (id, title, color, position) VALUES
            ('new', 'Nuevos', 'payboys-yellow', 0),
            ('contacted', 'Contactados', 'payboys-orange', 1),
            ('qualified', 'Cualificados', 'payboys-emerald', 2),
            ('lost', 'Perdidos', 'payboys-red', 3)
            ON CONFLICT (id) DO NOTHING;
        `;

        await newClient.query(sql);
        console.log("Tables constructed successfully in crm_payboys!");
    } catch (e) {
        console.error("Error setting up schema:", e);
    } finally {
        await newClient.end();
    }
}

setup();
