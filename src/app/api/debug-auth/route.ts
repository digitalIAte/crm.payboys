import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
    const client = await pool.connect();
    try {
        // 1. Check if table pb_users exists
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'pb_users'
            );
        `);
        
        if (!tableCheck.rows[0].exists) {
            return NextResponse.json({ error: "Table pb_users does not exist. Run /api/install first." });
        }

        // 2. Check for the admin user
        const userRes = await client.query("SELECT * FROM pb_users WHERE email = $1", ["admin@payboys.es"]);
        
        if (userRes.rows.length === 0) {
            return NextResponse.json({ 
                error: "User admin@payboys.es not found in pb_users table.",
                total_users: (await client.query("SELECT count(*) FROM pb_users")).rows[0].count
            });
        }

        const user = userRes.rows[0];
        
        // 3. Verify the password hash matches expected "admin123"
        const isMatch = await bcrypt.compare("admin123", user.password);

        return NextResponse.json({
            success: true,
            user_found: true,
            email: user.email,
            id: user.id,
            password_check_admin123: isMatch ? "MATCH" : "NO MATCH",
            created_at: user.created_at,
            next_auth_url: process.env.NEXTAUTH_URL || "not set",
            next_auth_secret: process.env.NEXTAUTH_SECRET ? "hidden" : "missing"
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    } finally {
        client.release();
    }
}
