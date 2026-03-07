const fs = require('fs');
const file = 'c:/Abdel/Antigravity/n8n-antigravity/dashboard-payboys/src/app/crm/leads/LeadsClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// Toolbar
content = content.replace('bg-white p-4 rounded-xl border border-gray-100', 'bg-[#111111] p-4 rounded-xl border border-gray-800');
content = content.replace(/border border-gray-200/g, 'border border-gray-700 bg-[#1a1a1a] text-white');
content = content.replace(/text-gray-600/g, 'text-gray-300');
content = content.replace(/text-gray-700/g, 'text-white');
content = content.replace(/text-gray-500/g, 'text-gray-400');

// Bulk action bar
content = content.replace('bg-payboys/10 border border-payboys/20', 'bg-payboys/20 border border-payboys/40');
content = content.replace('text-payboys-dark', 'text-payboys');
content = content.replace('bg-white', 'bg-[#111111] text-white'); // for select dropdown inside bulk action
content = content.replace('bg-white', 'bg-[#111111]'); // global replace can be dangerous, let's target specifically

// Table Container
content = content.replace('bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden', 'bg-[#111111] shadow-sm rounded-xl border border-gray-800 overflow-hidden');
content = content.replace('divide-y divide-gray-100', 'divide-y divide-gray-800');
content = content.replace('bg-gray-50', 'bg-[#0a0a0a]');

// Table internal
content = content.replace('bg-white divide-y divide-gray-50', 'bg-[#111111] divide-y divide-gray-800');
content = content.replace('hover:bg-slate-50', 'hover:bg-white/5');
content = content.replace('bg-blue-50/50', 'bg-blue-900/20'); // selected row bg
content = content.replace(/text-gray-900/g, 'text-white');
content = content.replace('bg-gradient-to-br from-payboys to-blue-400', 'bg-gradient-to-br from-payboys to-payboys-dark text-black');
content = content.replace('bg-gray-200', 'bg-gray-800'); // score background bar

// Results count
content = content.replace('text-gray-400', 'text-gray-500');

// Status Styles
content = content.replace('bg-blue-50 text-blue-700 border-blue-200', 'bg-blue-900/30 text-blue-400 border-blue-800');
content = content.replace('bg-yellow-50 text-yellow-700 border-yellow-200', 'bg-payboys/20 text-payboys border-payboys/40');
content = content.replace('bg-emerald-50 text-emerald-700 border-emerald-200', 'bg-emerald-900/30 text-emerald-400 border-emerald-800');
content = content.replace('bg-red-50 text-red-700 border-red-200', 'bg-red-900/30 text-red-400 border-red-800');
content = content.replace('bg-gray-100 text-gray-600 border-gray-200', 'bg-gray-800 text-gray-300 border-gray-700');

// Link Button
content = content.replace('text-payboys font-medium hover:text-payboys-dark bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100', 'text-payboys font-medium hover:text-payboys-light bg-payboys/10 px-3 py-1.5 rounded-lg hover:bg-payboys/20');

fs.writeFileSync(file, content);
console.log('updated table styles');
