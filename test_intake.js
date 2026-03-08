const axios = require('axios');
const https = require('https');

const URL = 'https://n8n.javiasl.es/webhook/api/crm-payboys/lead-intake';
const API_KEY = 'sk_dash_67890';

const data = {
    email: 'javier@gmail.com',
    name: 'Javier PJ V5',
    phone: '666111666',
    source: 'formulario'
};

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

async function test() {
    try {
        console.log('Sending request...');
        const res = await axios.post(URL, data, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY
            },
            httpsAgent: httpsAgent
        });
        console.log('SUCCESS:', res.status, res.data);
    } catch (error) {
        console.error('ERROR:', error.response?.status, error.response?.data);
    }
}

test();
