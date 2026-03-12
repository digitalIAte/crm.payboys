"use strict";(()=>{var e={};e.id=350,e.ids=[350],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},35900:e=>{e.exports=require("pg")},6113:e=>{e.exports=require("crypto")},81072:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>R,patchFetch:()=>_,requestAsyncStorage:()=>p,routeModule:()=>d,serverHooks:()=>y,staticGenerationAsyncStorage:()=>E});var a={};t.r(a),t.d(a,{GET:()=>u,dynamic:()=>c});var n=t(49303),o=t(88716),s=t(60670),i=t(87070),l=t(9196);let c="force-dynamic";async function u(){try{let e=await (0,l.hh)();return i.NextResponse.json(e)}catch(e){return console.error("Fetch leads error:",e.message),i.NextResponse.json({error:"Failed to fetch leads"},{status:500})}}let d=new n.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/leads/route",pathname:"/api/leads",filename:"route",bundlePath:"app/api/leads/route"},resolvedPagePath:"C:\\Abdel\\Antigravity\\n8n-antigravity\\dashboard-payboys\\src\\app\\api\\leads\\route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:p,staticGenerationAsyncStorage:E,serverHooks:y}=d,R="/api/leads/route";function _(){return(0,s.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:E})}},75748:(e,r,t)=>{t.d(r,{Z:()=>a});let a=new(t(35900)).Pool({connectionString:process.env.DATABASE_URL,ssl:!process.env.DATABASE_URL?.includes("localhost")&&{rejectUnauthorized:!1}})},9196:(e,r,t)=>{t.d(r,{Gk:()=>s,ST:()=>l,hh:()=>n,pd:()=>i,zs:()=>o});var a=t(75748);async function n(){let e=await a.Z.connect();try{return(await e.query(`
            SELECT * FROM pb_leads 
            ORDER BY created_at DESC 
            LIMIT 1000
        `)).rows}finally{e.release()}}async function o(e){let r=await a.Z.connect();try{let t=await r.query("SELECT * FROM pb_leads WHERE id = $1",[e]);if(0===t.rows.length)return null;let a=await r.query("SELECT * FROM pb_conversations WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",[e]),n=await r.query("SELECT * FROM pb_activities WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",[e]);return{lead:t.rows[0],conversations:a.rows,activities:n.rows}}finally{r.release()}}async function s(){let e=await a.Z.connect();try{return(await e.query(`
            SELECT * FROM pb_kanban_columns ORDER BY position ASC
        `)).rows}catch(r){if("42P01"===r.code||r.message.includes("pb_kanban_columns"))return console.log("pb_kanban_columns table missing. Auto-creating..."),await e.query(`
                CREATE TABLE IF NOT EXISTS pb_kanban_columns (
                    id VARCHAR(50) PRIMARY KEY,
                    title VARCHAR(100) NOT NULL,
                    color VARCHAR(100) DEFAULT 'border-neutral-800 bg-neutral-900',
                    position INT DEFAULT 0
                );
                
                INSERT INTO pb_kanban_columns (id, title, color, position) VALUES
                ('new', 'Nuevos', 'border-yellow-500 bg-yellow-900/10', 0),
                ('contacted', 'Contactados', 'border-orange-500 bg-orange-900/10', 1),
                ('qualified', 'Cualificados', 'border-emerald-500 bg-emerald-900/10', 2),
                ('lost', 'Perdidos', 'border-red-800 bg-red-900/10', 3)
                ON CONFLICT (id) DO NOTHING;
            `),(await e.query(`
                SELECT * FROM pb_kanban_columns ORDER BY position ASC
            `)).rows;throw r}finally{e.release()}}async function i(){let e=await a.Z.connect();try{let r=await e.query("SELECT * FROM pb_workspace_settings WHERE id = 1");if(0===r.rows.length)return{id:1,agency_name:"PAYBOYS CRM",primary_color:"#B08D57",n8n_webhook_url:null,calendly_url:null};return r.rows[0]}catch(e){return{id:1,agency_name:"PAYBOYS CRM",primary_color:"#B08D57",n8n_webhook_url:null,calendly_url:null}}finally{e.release()}}async function l(){return!0}t(98691)}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[948,972,691],()=>t(81072));module.exports=a})();