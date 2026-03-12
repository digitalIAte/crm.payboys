"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar as CalendarIcon, Loader2, User, Clock, Video } from "lucide-react";

const locales = {
  "es": es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendarClient() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await fetch("/api/appointments");
                const data = await res.json();
                
                if (Array.isArray(data)) {
                    const formattedEvents = data.map((apt: any) => ({
                        id: apt.id,
                        title: apt.title || `Reunión con ${apt.lead_name}`,
                        start: new Date(apt.start_time),
                        end: new Date(apt.end_time),
                        resource: apt,
                    }));
                    setEvents(formattedEvents);
                }
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const components = {
        event: (props: any) => {
            const apt = props.event.resource;
            return (
                <div className="p-1 rounded text-xs font-semibold shadow-sm border border-digitaliate/20">
                    <div className="flex items-center space-x-1 mb-1">
                        <User className="h-3 w-3" />
                        <span className="truncate">{apt.lead_name || 'Prospecto'}</span>
                    </div>
                    {apt.meeting_url && (
                        <a href={apt.meeting_url} target="_blank" rel="noopener noreferrer" 
                           className="flex items-center text-[10px] bg-white/20 px-1 py-0.5 rounded hover:bg-white/40 transition-colors w-max"
                           onClick={(e) => e.stopPropagation()}
                        >
                            <Video className="h-2 w-2 mr-1" /> Unirse
                        </a>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="h-[80vh] bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 flex items-center">
                        <CalendarIcon className="mr-3 h-6 w-6 text-digitaliate" />
                        Calendario de Reuniones
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Vista global de todas las llamadas agendadas vía Calendly.
                    </p>
                </div>
                {loading && (
                    <div className="flex items-center text-sm font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Sincronizando...
                    </div>
                )}
            </div>

            <div className="flex-1 min-h-0 bg-gray-50/30 rounded-2xl p-4 custom-calendar-wrapper">
                <style jsx global>{`
                    .custom-calendar-wrapper .rbc-calendar { font-family: inherit; }
                    .custom-calendar-wrapper .rbc-toolbar button { font-weight: 700; border-radius: 8px; }
                    .custom-calendar-wrapper .rbc-toolbar button.rbc-active { background-color: #2563EB; color: white; border-color: #2563EB; }
                    .custom-calendar-wrapper .rbc-event { background-color: #2563EB; border-radius: 8px; padding: 4px; border: none; }
                    .custom-calendar-wrapper .rbc-today { background-color: #eff6ff; }
                    .custom-calendar-wrapper .rbc-header { padding: 8px; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; color: #6b7280; border-bottom: 2px solid #e5e7eb; }
                `}</style>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%" }}
                    culture="es"
                    messages={{
                        today: "Hoy",
                        previous: "Anterior",
                        next: "Siguiente",
                        month: "Mes",
                        week: "Semana",
                        day: "Día",
                        agenda: "Agenda",
                        date: "Fecha",
                        time: "Hora",
                        event: "Evento",
                        noEventsInRange: "No hay reuniones en este rango de fechas.",
                    }}
                    components={components}
                    popup
                    selectable
                />
            </div>
        </div>
    );
}
