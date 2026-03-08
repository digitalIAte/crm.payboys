const { Client } = require('pg');

const connectionString = "postgres://postgres:e21ae9a767726405dffa@37.97.55.111:5432/crm?sslmode=disable";

async function checkTables() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('Connected to database: crm');
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('Tables found:');
        res.rows.forEach(row => console.log('- ' + row.table_name));
    } catch (err) {
        console.error('Connection error:', err);
    } finally {
        await client.end();
    }
}

checkTables();
