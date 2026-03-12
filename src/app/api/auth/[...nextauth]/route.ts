import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { ensureDatabaseReady } from "@/lib/services";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "tu@email.com" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials) {
                console.log("Auth attempt for:", credentials?.email);
                
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                // Ensure tables exist before querying
                const dbReady = await ensureDatabaseReady();
                if (!dbReady) {
                    console.error("CRITICAL: pb_users table not found! Run /api/install first.");
                }

                const client = await pool.connect();
                try {
                    const res = await client.query("SELECT * FROM pb_users WHERE email = $1", [credentials.email]);
                    console.log("Database result count:", res.rows.length);

                    if (res.rows.length === 0) {
                        console.log("User not found in pb_users");
                        return null;
                    }

                    const user = res.rows[0];
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    console.log("Password valid:", isPasswordValid);

                    if (!isPasswordValid) {
                        return null;
                    }

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: user.name,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                } finally {
                    client.release();
                }
            }
        })
    ],
    pages: {
        signIn: "/crm/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || "payboys-secret-key-12345",
});

export { handler as GET, handler as POST };
