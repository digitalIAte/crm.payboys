"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Loader2, Plus, ExternalLink, Video, Clock } from "lucide-react";

export default function AppointmentsPanel({ leadId, leadName, calendlyUrl }: { leadId: string, leadName: string, calendlyUrl: string }) {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            // Reusing the global appointments endpoint but filtering could be done client-side for now 
            // since we don't have a specific GET /leads/:id/appointments yet. 
            // Or better, creating it. Let's assume we filter the global one for now, or we just fetch it.
            const res = await fetch("/api/appointments");
            const data = await res.json();
            if (Array.isArray(data)) {
                setAppointments(data.filter(a => a.lead_id === leadId));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [leadId]);

    const handleScheduleClick = () => {
        // Build the calendly URL with prefilled data
        const url = new URL(calendlyUrl);
        url.searchParams.set("name", leadName);
        window.open(url.toString(), "_blank");
    };

    return (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5 text-digitaliate" />
                    Citas y Reuniones
                </h3>
                <button 
                    onClick={handleScheduleClick}
                    className="flex items-center text-xs font-bold bg-digitaliate/10 text-digitaliate px-3 py-1.5 rounded-lg hover:bg-digitaliate/20 transition-colors"
                >
                    <Plus className="h-3 w-3 mr-1" />
                    Agendar
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin text-gray-300 h-6 w-6" />
                </div>
            ) : appointments.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <CalendarIcon className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sin Citas</p>
                    <p className="text-[10px] text-gray-400">Este lead no tiene reuniones programadas.</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {appointments.map(apt => {
                        const isPast = new Date(apt.start_time) < new Date();
                        return (
                            <div key={apt.id} className={`p-3 rounded-xl border flex flex-col ${isPast ? 'bg-gray-50 border-gray-100 opacity-70' : 'bg-blue-50 border-blue-100'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <strong className="text-sm text-gray-900 truncate pr-2">{apt.title || "Reunión"}</strong>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isPast ? 'bg-gray-200 text-gray-600' : 'bg-blue-200 text-blue-800'}`}>
                                        {isPast ? 'Pasada' : 'Próxima'}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-600 flex items-center mb-2">
                                    <Clock className="h-3 w-3 mr-1 text-gray-400" />
                                    {new Date(apt.start_time).toLocaleString()}
                                </div>
                                {apt.meeting_url && !isPast && (
                                    <a href={apt.meeting_url} target="_blank" rel="noopener noreferrer" 
                                       className="mt-1 flex items-center justify-center text-xs font-bold bg-white text-digitaliate border border-digitaliate/20 py-1.5 rounded-lg hover:bg-digitaliate/5 transition-colors">
                                        <Video className="h-3 w-3 mr-1" />
                                        Unirse a la Llamada
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
