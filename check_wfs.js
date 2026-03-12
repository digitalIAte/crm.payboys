const fs = require('fs');

const files = [3902, 3903, 3904, 3905, 3906, 3907].map(id => `C:/Users/Abdel Otsmani/.gemini/antigravity/brain/c637dd06-aa66-4124-97bb-fd523483134a/.system_generated/steps/${id}/output.txt`);

files.forEach(f => {
  try {
    const raw = fs.readFileSync(f, 'utf8');
    const parsed = JSON.parse(raw);
    const wf = parsed.data || parsed.workflow || parsed; // Handle different possible wrapper structures
    const nodes = wf.nodes || [];
    const wfName = wf.name || 'Unknown';
    const wfId = wf.id || 'Unknown';
    
    console.log(`\n--- Workflow: ${wfName} (${wfId}) ---`);
    nodes.forEach(n => {
      if (n.type === 'n8n-nodes-base.postgres') {
        const pStr = JSON.stringify(n.parameters || {});
        // Find if it uses a table explicitly:
        const tableMatch = n.parameters?.table;
        const queryMatch = n.parameters?.query;
        
        console.log(`[Postgres Node] ${n.name}:`);
        if (tableMatch) console.log(`  Table parameter: ${tableMatch}`);
        if (queryMatch) console.log(`  Query parameter: ${queryMatch.substring(0, 100).replace(/\n/g, ' ')}...`);
        
        if (tableMatch && !tableMatch.startsWith('pb_')) {
             console.log(`  ⚠️ ALERT: Uses non-pb_ table -> ${tableMatch}`);
        }
        if (queryMatch && queryMatch.includes(' INTO ') && !queryMatch.includes(' pb_')) {
             console.log(`  ⚠️ ALERT: Query might use non-pb_ table -> ${queryMatch}`);
        }
        if (queryMatch && queryMatch.includes(' FROM ') && !queryMatch.includes(' pb_')) {
             console.log(`  ⚠️ ALERT: Query might use non-pb_ table -> ${queryMatch}`);
        }
      }
    });
  } catch (e) {
    console.log(`Error parsing ${f}: ${e.message}`);
  }
});
