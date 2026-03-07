"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutDashboard, Settings, BarChart3, MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar() {
    const pathname = usePathname();
    const [newLeadsCount, setNewLeadsCount] = useState(0);

    // Poll for new leads every 30 seconds compared to last visit
    useEffect(() => {
        const checkNewLeads = async () => {
            try {
                // If we are ON the leads page, update the "last visited" timestamp
                if (pathname === "/crm/leads") {
                    localStorage.setItem("last_leads_visit", new Date().toISOString());
                    setNewLeadsCount(0);
                    return;
                }

                // If not, see how many leads were created since our last visit
                const lastVisit = localStorage.getItem("last_leads_visit");
                if (!lastVisit) {
                    localStorage.setItem("last_leads_visit", new Date(Date.now() - 86400000).toISOString());
                    return;
                }

                // Call a quick analytics endpoint or custom endpoint to check counts
                const res = await fetch("/api/analytics");
                const data = await res.json();

                if (data && data.leadsByDay && data.leadsByDay.length > 0) {
                    // Very simple heuristic: if there are new leads today, and we haven't visited leads today, show a badge.
                    // For a true implementation, we'd need an endpoint like /api/leads/count?since=timestamp
                    // We'll approximate by checking the most recent day's count
                    const todayDate = new Date().toISOString().split('T')[0];
                    const todayData = data.leadsByDay.find((d: any) => new Date(d.date).toISOString().split('T')[0] === todayDate);

                    if (todayData && new Date(lastVisit) < new Date(new Date().setHours(0, 0, 0, 0))) {
                        setNewLeadsCount(parseInt(todayData.count));
                    }
                }
            } catch (e) { }
        };

        checkNewLeads();
        const interval = setInterval(checkNewLeads, 30000);
        return () => clearInterval(interval);
    }, [pathname]);

    const navigation = [
        { name: "Dashboard", href: "/crm", icon: LayoutDashboard },
        { name: "Analytics", href: "/crm/analytics", icon: BarChart3 },
        { name: "Leads Pipeline", href: "/crm/leads", icon: Users, badge: newLeadsCount },
        { name: "Plantillas", href: "/crm/templates", icon: MessageSquareText },
        { name: "Settings", href: "/crm/settings", icon: Settings },
    ];

    return (
        <aside className="w-64 bg-[#0a0a0a] border-r border-gray-800 flex flex-col shadow-sm z-10">
            <div className="h-16 flex items-center px-6 border-b border-gray-800">
                <Link href="/crm" className="flex items-center">
                    <img src="/images/logo_payboys.png" alt="PAYBOYS CRM" className="h-8 w-auto object-contain" />
                </Link>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/crm");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                group flex items-center px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-150
                                ${isActive
                                    ? "bg-payboys/20 text-payboys"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }
                            `}
                        >
                            <item.icon
                                className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-150
                                    ${isActive ? "text-payboys" : "text-gray-400 group-hover:text-gray-500"}
                                `}
                                aria-hidden="true"
                            />
                            {item.name}

                            {item.badge ? (
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                    {item.badge} Novedades
                                </span>
                            ) : null}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div className="bg-gradient-to-br from-white/5 to-white/5 rounded-xl p-4 text-center border border-white/10">
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Desarrollado por</p>
                    <div className="font-bold text-gray-200 tracking-tight">Abdel Otsmani</div>
                    <div className="text-[10px] font-semibold text-payboys mt-1 uppercase">AI-Powered System</div>
                </div>
            </div>
        </aside>
    );
}
