const axios = require('axios');
const https = require('https');

const WEBHOOK_URL = 'https://n8n.javiasl.es/webhook/api/crm-payboys/lead-intake';
const API_KEY = 'sk_dash_67890';

const fakeLeads = [
    { name: "Carlos Mendoza", email: "carlos.m@example.com", phone: "600111222", source: "formulario" },
    { name: "Lucía Fernández", email: "lucia.fer@example.com", phone: "611222333", source: "chatbot" },
    { name: "Marcos Varela", email: "mvarela89@gmail.com", phone: "655444333", source: "formulario" },
    { name: "Elena Gómez", email: "egomez.design@hotmail.com", phone: "644999888", source: "chatbot" },
    { name: "David Ruiz", email: "david.ruiz123@yahoo.es", phone: "633777666", source: "formulario" },
    { name: "Sofía Navarro", email: "s.navarro@empresa.com", phone: "622111000", source: "chatbot" },
    { name: "Javier López", email: "javilopez90@gmail.com", phone: "688555444", source: "formulario" },
    { name: "Ana Martínez", email: "ana_mtz_88@outlook.com", phone: "677333222", source: "chatbot" },
    { name: "Rafael Silva", email: "rafa.silva@tech.es", phone: "699000111", source: "formulario" },
    { name: "Carmen Ortiz", email: "cortiz.consulting@gmail.com", phone: "666222111", source: "chatbot" },
    { name: "Pablo Romero", email: "promero.dev@yahoo.com", phone: "611555999", source: "formulario" },
    { name: "Laura Sánchez", email: "laura.sanchez.p@hotmail.es", phone: "644111333", source: "chatbot" },
    { name: "Hugo Castillo", email: "hugo.cast@empresa.es", phone: "655777888", source: "formulario" },
    { name: "Isabel Torres", email: "isa.torres.mx@gmail.com", phone: "622999444", source: "chatbot" },
    { name: "Alejandro Flores", email: "alex.flores.85@outlook.com", phone: "688111222", source: "formulario" }
];

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

async function sendLeads() {
    console.log(`Testing webhook...`);
    try {
        const res = await axios.post(WEBHOOK_URL, fakeLeads[0], {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY
            },
            httpsAgent: httpsAgent
        });
        console.log(`Status: ${res.status}`);
    } catch (error) {
        console.error(`Status code:`, error.response?.status);
        console.error(`Response data:`, error.response?.data);
    }
}

sendLeads();
