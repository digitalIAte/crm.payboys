"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutDashboard, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/crm' && pathname === '/crm') return true;
        if (path !== '/crm' && pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
            <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-payboys text-black font-extrabold text-xl shadow-lg shadow-payboys/20">
                    P
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-payboys-light to-white bg-clip-text text-transparent">
                    PAYBOYS CRM
                </span>
            </div>

            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto mt-4">
                <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Overview</p>
                <Link
                    href="/crm"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/crm')
                        ? 'bg-payboys shadow-md shadow-payboys/20 text-black'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <LayoutDashboard size={20} className={isActive('/crm') ? 'text-black/80' : 'text-slate-500 group-hover:text-slate-300'} />
                    <span className="font-medium">Dashboard</span>
                </Link>

                <Link
                    href="/crm/leads"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 flex-1 group ${isActive('/crm/leads')
                        ? 'bg-payboys shadow-md shadow-payboys/20 text-black'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <Users size={20} className={isActive('/crm/leads') ? 'text-black/80' : 'text-slate-500 group-hover:text-slate-300'} />
                    <span className="font-medium flex-1">Leads Pipeline</span>
                </Link>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold border border-slate-600">
                            P
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">PAYBOYS Admin</p>
                            <p className="text-xs text-slate-400">admin@payboys.es</p>
                        </div>
                    </div>
                </div>

                <Link
                    href="/crm/login"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
                >
                    <LogOut size={20} className="group-hover:text-red-400 text-slate-500 -ml-1" />
                    <span className="font-medium">Log out</span>
                </Link>
            </div>
        </aside>
    );
}
