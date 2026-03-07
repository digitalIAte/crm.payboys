const fs = require('fs');
const file = 'c:/Abdel/Antigravity/n8n-antigravity/dashboard-payboys/src/app/crm/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Title row
content = content.replace('text-gray-900 tracking-tight', 'text-white tracking-tight');
content = content.replace('bg-indigo-600 text-white', 'bg-payboys text-black');
content = content.replace('hover:bg-indigo-700', 'hover:bg-payboys-dark');

// Cards
content = content.replace(/bg-white rounded-xl shadow-sm border border-gray-100/g, 'bg-[#111111] rounded-xl shadow-sm border border-gray-800');
content = content.replace(/text-gray-900/g, 'text-white');
content = content.replace('bg-indigo-50', 'bg-payboys/10');
content = content.replace('text-indigo-600', 'text-payboys');
content = content.replace('bg-emerald-50', 'bg-emerald-900/30');
content = content.replace('text-amber-500', 'text-payboys');
content = content.replace('bg-amber-50', 'bg-payboys/10');

// Table Container
content = content.replace('bg-white shadow-sm rounded-xl border border-gray-100', 'bg-[#111111] shadow-sm rounded-xl border border-gray-800');
content = content.replace('bg-gray-50/50', 'bg-[#0a0a0a]');
content = content.replace('border-b border-gray-100', 'border-b border-gray-800');
content = content.replace('divide-y divide-gray-200', 'divide-y divide-gray-800');
content = content.replace('bg-gray-50', 'bg-[#0a0a0a]');
content = content.replace('text-gray-500 uppercase tracking-wider', 'text-gray-400 uppercase tracking-wider');

// Table Body
content = content.replace('bg-white divide-y divide-gray-100', 'bg-[#111111] divide-y divide-gray-800');
content = content.replace('hover:bg-slate-50', 'hover:bg-white/5');

// Avatar
content = content.replace('bg-gradient-to-br from-indigo-100 to-indigo-200', 'bg-gradient-to-br from-payboys/20 to-payboys/30');
content = content.replace('text-indigo-700', 'text-payboys');

// Badges
content = content.replace(`'bg-emerald-50 text-emerald-700 border-emerald-200'`, `'bg-emerald-900/30 text-emerald-400 border-emerald-800'`);
content = content.replace(`'bg-red-50 text-red-700 border-red-200'`, `'bg-red-900/30 text-red-400 border-red-800'`);
content = content.replace(`'bg-blue-50 text-blue-700 border-blue-200'`, `'bg-payboys/20 text-payboys border-payboys/30'`);

// Link
content = content.replace('text-indigo-600', 'text-payboys');
content = content.replace('hover:text-indigo-900', 'hover:text-payboys-light');
content = content.replace('bg-indigo-50', 'bg-payboys/10');
content = content.replace('hover:bg-indigo-100', 'hover:bg-payboys/20');

fs.writeFileSync(file, content);
console.log('updated page.tsx');
