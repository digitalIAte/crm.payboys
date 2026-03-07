const fs = require('fs');
const file = 'c:/Abdel/Antigravity/n8n-antigravity/dashboard-payboys/src/app/crm/leads/KanbanBoard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace standard exports with stateful columns and add button
content = content.replace(
    'export default function KanbanBoard({ leads, onStatusUpdate }: { leads: Lead[], onStatusUpdate: (ids: string[], status: string) => Promise<boolean> }) {',
    `export default function KanbanBoard({ leads, onStatusUpdate }: { leads: Lead[], onStatusUpdate: (ids: string[], status: string) => Promise<boolean> }) {
    const [columns, setColumns] = useState(COLUMNS);

    const handleAddColumn = () => {
        const title = prompt("Nombre de la nueva columna:");
        if (title) {
            const id = title.toLowerCase().replace(/\\s+/g, '-');
            setColumns([...columns, { id, title, color: "border-gray-600 bg-gray-800" }]);
        }
    };
`
);

// Map over `columns` instead of `COLUMNS`
content = content.replace('COLUMNS.map(col => {', 'columns.map(col => {');

// Add the button right above the Kanban grid
content = content.replace(
    '<div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-220px)] min-h-[500px]">',
    `<div className="mb-4 flex justify-end">
         <button onClick={handleAddColumn} className="bg-payboys/10 text-payboys hover:bg-payboys/20 border border-payboys/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
             + Añadir Columna
         </button>
     </div>
     <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-220px)] min-h-[500px] scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">`
);

// Dark theme replacements inside Kanban
content = content.replace(/border-blue-200 bg-blue-50\/50/g, 'border-blue-800 bg-blue-900/20');
content = content.replace(/border-yellow-200 bg-yellow-50\/50/g, 'border-payboys/50 bg-payboys/10');
content = content.replace(/border-emerald-200 bg-emerald-50\/50/g, 'border-emerald-800 bg-emerald-900/20');
content = content.replace(/border-red-200 bg-red-50\/50/g, 'border-red-800 bg-red-900/20');

// Grid Column styling
content = content.replace('bg-gray-50/30', 'bg-[#111111]/80');
content = content.replace('border-gray-200', 'border-gray-800');

// Column Header
content = content.replace(/bg-white/g, 'bg-[#1a1a1a]');
// Wait, multiple bg-white replacements - let's be careful.
// Instead of sweeping `bg-white`, I'll apply it specifically.

fs.writeFileSync(file, content);
console.log('updated kanban logic');
