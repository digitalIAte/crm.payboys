"use strict";(()=>{var e={};e.id=350,e.ids=[350],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5900:e=>{e.exports=require("pg")},1072:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>y,patchFetch:()=>A,requestAsyncStorage:()=>p,routeModule:()=>u,serverHooks:()=>R,staticGenerationAsyncStorage:()=>E});var r={};a.r(r),a.d(r,{GET:()=>c,dynamic:()=>d});var n=a(9303),o=a(8716),s=a(670),i=a(7070),l=a(9196);let d="force-dynamic";async function c(){try{let e=await (0,l.hh)();return i.NextResponse.json(e)}catch(e){return console.error("Fetch leads error:",e.message),i.NextResponse.json({error:"Failed to fetch leads"},{status:500})}}let u=new n.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/leads/route",pathname:"/api/leads",filename:"route",bundlePath:"app/api/leads/route"},resolvedPagePath:"C:\\Abdel\\Antigravity\\n8n-antigravity\\dashboard-payboys\\src\\app\\api\\leads\\route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:p,staticGenerationAsyncStorage:E,serverHooks:R}=u,y="/api/leads/route";function A(){return(0,s.patchFetch)({serverHooks:R,staticGenerationAsyncStorage:E})}},5748:(e,t,a)=>{a.d(t,{Z:()=>r});let r=new(a(5900)).Pool({connectionString:process.env.DATABASE_URL,ssl:!process.env.DATABASE_URL?.includes("localhost")&&{rejectUnauthorized:!1}})},9196:(e,t,a)=>{a.d(t,{Gk:()=>s,hh:()=>n,zs:()=>o});var r=a(5748);async function n(){let e=await r.Z.connect();try{return(await e.query(`
            SELECT * FROM leads 
            ORDER BY created_at DESC 
            LIMIT 1000
        `)).rows}finally{e.release()}}async function o(e){let t=await r.Z.connect();try{let a=await t.query("SELECT * FROM leads WHERE id = $1",[e]);if(0===a.rows.length)return null;let r=await t.query("SELECT * FROM conversations WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",[e]),n=await t.query("SELECT * FROM activities WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",[e]);return{lead:a.rows[0],conversations:r.rows,activities:n.rows}}finally{t.release()}}async function s(){let e=await r.Z.connect();try{return(await e.query(`
            SELECT * FROM kanban_columns ORDER BY position ASC
        `)).rows}catch(t){if("42P01"===t.code||t.message.includes("kanban_columns"))return console.log("kanban_columns table missing. Auto-creating..."),await e.query(`
                CREATE TABLE IF NOT EXISTS kanban_columns (
                    id VARCHAR(50) PRIMARY KEY,
                    title VARCHAR(100) NOT NULL,
                    color VARCHAR(100) DEFAULT 'border-gray-200 bg-gray-50/50',
                    position INT DEFAULT 0
                );
                
                INSERT INTO kanban_columns (id, title, color, position) VALUES
                ('new', 'Nuevos', 'border-blue-200 bg-blue-50/50', 0),
                ('contacted', 'Contactados', 'border-yellow-200 bg-yellow-50/50', 1),
                ('qualified', 'Cualificados', 'border-emerald-200 bg-emerald-50/50', 2),
                ('lost', 'Perdidos', 'border-red-200 bg-red-50/50', 3)
                ON CONFLICT (id) DO NOTHING;
            `),(await e.query(`
                SELECT * FROM kanban_columns ORDER BY position ASC
            `)).rows;throw t}finally{e.release()}}}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[948,972],()=>a(1072));module.exports=r})();