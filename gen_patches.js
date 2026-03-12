const fs = require('fs');

const f1 = 'C:/Users/Abdel Otsmani/.gemini/antigravity/brain/c637dd06-aa66-4124-97bb-fd523483134a/.system_generated/steps/3902/output.txt';
let raw1 = JSON.parse(fs.readFileSync(f1, 'utf8'));
let wf1 = raw1.data || raw1.workflow || raw1;
const n1 = wf1.nodes.find(n => n.name === 'Upsert_Lead');
const n2 = wf1.nodes.find(n => n.name === 'Insert_Conv');

const q1 = n1.parameters.query.replace(/INTO leads/g, 'INTO pb_leads').replace(/ leads/g, ' pb_leads').replace(/leads\./g, 'pb_leads.');
const q2 = n2.parameters.query.replace(/INTO conversations/g, 'INTO pb_conversations').replace(/ conversations /g, ' pb_conversations ');

fs.writeFileSync('ops1.json', JSON.stringify([
    { type: 'updateNode', nodeId: 'Upsert_Lead', changes: { parameters: { ...n1.parameters, query: q1 } } },
    { type: 'updateNode', nodeId: 'Insert_Conv', changes: { parameters: { ...n2.parameters, query: q2 } } }
]));

const f2 = 'C:/Users/Abdel Otsmani/.gemini/antigravity/brain/c637dd06-aa66-4124-97bb-fd523483134a/.system_generated/steps/3903/output.txt';
let raw2 = JSON.parse(fs.readFileSync(f2, 'utf8'));
let wf2 = raw2.data || raw2.workflow || raw2;

const n3 = wf2.nodes.find(n => n.name === 'Get Transcript');
const n4 = wf2.nodes.find(n => n.name === 'Update Lead');

const q3 = n3.parameters.query.replace(/FROM conversations/g, 'FROM pb_conversations').replace(/ conversations /g, ' pb_conversations ');
const q4 = n4.parameters.query.replace(/UPDATE leads/g, 'UPDATE pb_leads').replace(/ leads /g, ' pb_leads ').replace(/leads\./g, 'pb_leads.');

fs.writeFileSync('ops2.json', JSON.stringify([
    { type: 'updateNode', nodeId: 'Get Transcript', changes: { parameters: { ...n3.parameters, query: q3 } } },
    { type: 'updateNode', nodeId: 'Update Lead', changes: { parameters: { ...n4.parameters, query: q4 } } }
]));

console.log("JSON patches created");
