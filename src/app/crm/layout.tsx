import Link from "next/link";
import { Users, LayoutDashboard, Settings } from "lucide-react"; // Assuming we install lucide-react

import { Metadata } from "next";
import Sidebar from "./Sidebar";

export const metadata: Metadata = {
    title: "Digitaliate CRM",
    description: "Intelligent Lead Management Dashboard",
};

export default function CRMLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative">
                {/* Subtle top decoration */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-digitaliate/10 to-transparent -z-10 pointer-events-none"></div>

                <div className="p-10 pt-12 min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
