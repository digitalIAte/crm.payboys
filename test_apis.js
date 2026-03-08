const axios = require('axios');
const https = require('https');

const API_KEY = 'sk_dash_67890';
const LEAD_ID = '059df8be-1804-4177-ac00-41d436e0f62d';

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

async function testApis() {
    try {
        console.log('--- Testing n8n GET Leads ---');
        const leadsRes = await axios.get('https://n8n.javiasl.es/webhook/api/crm-payboys/leads', {
            headers: { 'x-api-key': API_KEY },
            httpsAgent
        });
        console.log('n8n Leads count:', leadsRes.data.length);

        console.log('\n--- Testing LOCAL API (Dashboard Details) ---');
        // Assuming the server is running on localhost:3000
        const localRes = await axios.get(`http://localhost:3000/api/leads/${LEAD_ID}`, {
            timeout: 5000
        });
        console.log('Local API Status:', localRes.status);
        console.log('Lead + Conversations + Activities:', Object.keys(localRes.data));
        console.log('Lead Name:', localRes.data.lead?.name);
        console.log('Conversations count:', localRes.data.conversations?.length);

        console.log('\n--- Testing Analytics API ---');
        const analyticsRes = await axios.get('http://localhost:3000/api/analytics', {
            timeout: 5000
        });
        console.log('Analytics Status:', analyticsRes.status);
        console.log('Stats Keys:', Object.keys(analyticsRes.data));

    } catch (error) {
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data || error.message);
    }
}

testApis();
