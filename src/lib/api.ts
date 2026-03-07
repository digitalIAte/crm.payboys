const API_URL = process.env.N8N_WEBHOOK_URL || "https://n8n.javiasl.es/webhook";
const API_KEY = process.env.N8N_API_KEY || "sk_dash_67890";

import axios from 'axios';
import https from 'https';

// Because n8n is served behind a specific proxy/SNI that Node.js native fetch rejects,
// we create a custom HTTPS agent that ignores unauthorized SSL certs strictly for these internal Next.js Server API calls.
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

axios.defaults.adapter = 'http';

export interface Lead {
    id: string;
    email: string;
    phone?: string;
    name: string;
    status: string;
    stage: string;
    score: number;
    owner_email: string;
    created_at: string;
    source?: string;
}

const MOCK_LEADS: Lead[] = [
    { id: "mock-1", email: "carlos.m@example.com", phone: "600111222", name: "Carlos Mendoza", status: "new", stage: "NEW", score: 85, owner_email: "crm@payboys.es", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), source: "📝 Formulario" },
    { id: "mock-2", email: "lucia.fer@example.com", phone: "611222333", name: "Lucía Fernández", status: "contacted", stage: "CONTACTED", score: 45, owner_email: "crm@payboys.es", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), source: "🤖 Chatbot" },
    { id: "mock-3", email: "mvarela89@gmail.com", phone: "655444333", name: "Marcos Varela", status: "new", stage: "NEW", score: 92, owner_email: "crm@payboys.es", created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), source: "📝 Formulario" },
    { id: "mock-4", email: "egomez.design@hotmail.com", phone: "644999888", name: "Elena Gómez", status: "qualified", stage: "QUALIFIED", score: 71, owner_email: "crm@payboys.es", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), source: "🤖 Chatbot" },
    { id: "mock-5", email: "david.ruiz123@yahoo.es", phone: "633777666", name: "David Ruiz", status: "lost", stage: "LOST", score: 12, owner_email: "crm@payboys.es", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), source: "📝 Formulario" },
    { id: "mock-6", email: "s.navarro@empresa.com", phone: "622111000", name: "Sofía Navarro", status: "new", stage: "NEW", score: 55, owner_email: "crm@payboys.es", created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), source: "🤖 Chatbot" },
    { id: "mock-7", email: "javilopez90@gmail.com", phone: "688555444", name: "Javier López", status: "contacted", stage: "CONTACTED", score: 68, owner_email: "crm@payboys.es", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), source: "📝 Formulario" },
    { id: "mock-8", email: "ana_mtz_88@outlook.com", phone: "677333222", name: "Ana Martínez", status: "qualified", stage: "QUALIFIED", score: 95, owner_email: "crm@payboys.es", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), source: "🤖 Chatbot" },
    { id: "mock-9", email: "rafa.silva@tech.es", phone: "699000111", name: "Rafael Silva", status: "new", stage: "NEW", score: 32, owner_email: "crm@payboys.es", created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), source: "📝 Formulario" },
    { id: "mock-10", email: "cortiz.consulting@gmail.com", phone: "666222111", name: "Carmen Ortiz", status: "lost", stage: "LOST", score: 18, owner_email: "crm@payboys.es", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), source: "🤖 Chatbot" },
    { id: "mock-11", email: "promero.dev@yahoo.com", phone: "611555999", name: "Pablo Romero", status: "contacted", stage: "CONTACTED", score: 77, owner_email: "crm@payboys.es", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), source: "📝 Formulario" },
    { id: "mock-12", email: "laura.sanchez.p@hotmail.es", phone: "644111333", name: "Laura Sánchez", status: "new", stage: "NEW", score: 48, owner_email: "crm@payboys.es", created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), source: "🤖 Chatbot" },
    { id: "mock-13", email: "hugo.cast@empresa.es", phone: "655777888", name: "Hugo Castillo", status: "qualified", stage: "QUALIFIED", score: 88, owner_email: "crm@payboys.es", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(), source: "📝 Formulario" },
    { id: "mock-14", email: "isa.torres.mx@gmail.com", phone: "622999444", name: "Isabel Torres", status: "lost", stage: "LOST", score: 25, owner_email: "crm@payboys.es", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(), source: "🤖 Chatbot" },
    { id: "mock-15", email: "alex.flores.85@outlook.com", phone: "688111222", name: "Alejandro Flores", status: "new", stage: "NEW", score: 62, owner_email: "crm@payboys.es", created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), source: "📝 Formulario" }
];

export async function fetchLeads(): Promise<Lead[]> {
    try {
        const res = await axios.get(`${API_URL}/api/crm-payboys/leads`, {
            headers: { "X-API-KEY": API_KEY },
            httpsAgent: httpsAgent
        });
        const data = res.data;
        return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
        console.warn("Failed to fetch leads from n8n, returning mock data instead for UI preview.");
        return MOCK_LEADS;
    }
}
// Handle both { data: [...] } structure and raw [...] array structure
export async function fetchLeadById(id: string) {
    try {
        const res = await axios.get(`${API_URL}/api/crm-payboys/leads/${id}`, {
            headers: { "X-API-KEY": API_KEY },
            httpsAgent: httpsAgent
        });
        const data = res.data;
        if (!data || !data.lead) return null;
        return data;
    } catch (error) {
        console.error(`Failed to fetch lead ${id}`, error);
        return null;
    }
}

export async function updateLead(id: string, updates: Partial<Lead>) {
    try {
        const res = await axios.patch(`${API_URL}/api/crm-payboys/leads/${id}`, updates, {
            headers: {
                "X-API-KEY": API_KEY,
                "Content-Type": "application/json"
            },
            httpsAgent: httpsAgent
        });
        if (res.status >= 200 && res.status < 300) {
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Failed to update lead ${id}`, error);
        throw error;
    }
}

export async function createActivity(payload: { lead_id: string, type: string, note?: string, source?: string }) {
    try {
        const res = await axios.post(`${API_URL}/api/crm-payboys/activities`, payload, {
            headers: {
                "X-API-KEY": API_KEY,
                "Content-Type": "application/json"
            },
            httpsAgent: httpsAgent
        });
        if (res.status >= 200 && res.status < 300) {
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Failed to create activity for lead ${payload.lead_id}`, error);
        throw error;
    }
}
