const axios = require('axios');
const https = require('https');

const WEBHOOK_URL = 'https://n8n.javiasl.es/webhook/api/crm-payboys/lead-intake';
const API_KEY = 'sk_dash_67890';

const fakeLeads = [
    { name: "Carlos Mendoza", email: "carlos.m@example.com", phone: "600111222", source: "formulario" }
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
