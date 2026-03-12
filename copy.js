const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Abdel/Antigravity/n8n-antigravity/dashboard/src';
const destDir = 'c:/Abdel/Antigravity/n8n-antigravity/dashboard-payboys/src';

const filesToCopy = [
  'app/api/appointments/route.ts',
  'app/api/auth/[...nextauth]/route.ts',
  'app/api/settings/route.ts',
  'app/api/webhooks/calendly/route.ts',
  'app/crm/AuthProvider.tsx',
  'app/crm/calendar/CalendarClient.tsx',
  'app/crm/calendar/page.tsx',
  'app/crm/debug/page.tsx',
  'app/crm/leads/migrate-action.ts',
  'app/crm/leads/[id]/AppointmentsPanel.tsx',
  'app/crm/settings/actions.ts',
  'app/crm/settings/page.tsx',
  'app/crm/settings/SettingsClient.tsx',
  'middleware.ts'
];

filesToCopy.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    let content = fs.readFileSync(srcPath, 'utf8');
    
    // Replace table names
    content = content.replace(/workspace_settings/g, 'pb_workspace_settings');
    content = content.replace(/into appointments/ig, 'into pb_appointments');
    content = content.replace(/from appointments/ig, 'from pb_appointments');
    content = content.replace(/table appointments/ig, 'table pb_appointments');
    content = content.replace(/update appointments/ig, 'update pb_appointments');
    content = content.replace(/"appointments"/g, '"pb_appointments"');
    content = content.replace(/'appointments'/g, "'pb_appointments'");
    content = content.replace(/`appointments`/g, '`pb_appointments`');
    
    if (file === 'app/api/webhooks/calendly/route.ts') {
        content = content.replace(/FROM leads/g, 'FROM pb_leads');
    }
    
    if (file === 'app/api/appointments/route.ts') {
        content = content.replace(/FROM leads/g, 'FROM pb_leads');
    }

    fs.writeFileSync(destPath, content);
    console.log('Copied and adapted:', file);
  } else {
    console.log('Missing in src:', file);
  }
});
