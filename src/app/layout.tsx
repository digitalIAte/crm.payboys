import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CRM Dashboard",
    description: "Internal CRM Dashboard running on n8n webhooks",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body>{children}</body>
        </html>
    );
}
