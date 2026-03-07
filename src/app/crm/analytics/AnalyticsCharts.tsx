"use client";

import { useState, useEffect } from "react";

export default function AnalyticsCharts() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/analytics")
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="animate-pulse space-y-8">
            <div className="h-64 bg-gray-100 rounded-xl"></div>
            <div className="grid grid-cols-2 gap-8"><div className="h-48 bg-gray-100 rounded-xl"></div><div className="h-48 bg-gray-100 rounded-xl"></div></div>
        </div>;
    }

    if (!data || data.error) return <div className="text-red-500">Error loading analytics.</div>;

    const { statusDistribution, leadsByDay, scoreDistribution } = data;

    // Process leads by day for bar chart
    const maxLeads = Math.max(...leadsByDay.map((d: any) => parseInt(d.count)), 1);

    // Process scores for progress bars
    const totalWithScore = parseInt(scoreDistribution.low) + parseInt(scoreDistribution.medium) + parseInt(scoreDistribution.high);

    return (
        <div className="space-y-8">
            {/* Leads by Day - Bar Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-6">Leads (Últimos 7 días)</h3>
                <div className="flex items-end justify-between h-48 gap-2">
                    {leadsByDay.map((day: any, i: number) => {
                        const count = parseInt(day.count);
                        const height = `${(count / maxLeads) * 100}%`;
                        const date = new Date(day.date).toLocaleDateString([], { weekday: 'short', day: 'numeric' });
                        return (
                            <div key={i} className="flex flex-col items-center flex-1 group">
                                <div className="relative w-full flex justify-center h-full items-end pb-2">
                                    <div
                                        className="w-full max-w-[40px] bg-payboys/80 hover:bg-payboys rounded-t-sm transition-all relative group-hover:shadow-md"
                                        style={{ height }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                                            {count}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 mt-2 truncate w-full text-center">{date}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Status Distribution */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6">Distribución por Estado</h3>
                    <div className="space-y-4">
                        {statusDistribution.map((s: any, i: number) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 capitalize">{s.status}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-900">{s.count}</span>
                                    <div className="w-24 bg-gray-100 rounded-full h-2">
                                        <div className="bg-payboys h-2 rounded-full" style={{ width: `${Math.min(100, parseInt(s.count) * 10)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Score Distribution */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6">Calidad (Score)</h3>
                    {totalWithScore === 0 ? <p className="text-sm text-gray-400 italic">No hay leads evaluados.</p> : (
                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-emerald-600">Alta (70-100)</span>
                                    <span className="font-bold text-gray-700">{scoreDistribution.high}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${(parseInt(scoreDistribution.high) / totalWithScore) * 100}%` }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-yellow-600">Media (30-69)</span>
                                    <span className="font-bold text-gray-700">{scoreDistribution.medium}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(parseInt(scoreDistribution.medium) / totalWithScore) * 100}%` }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-red-600">Baja (0-29)</span>
                                    <span className="font-bold text-gray-700">{scoreDistribution.low}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${(parseInt(scoreDistribution.low) / totalWithScore) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
