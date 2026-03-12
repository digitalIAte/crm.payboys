"use strict";(()=>{var e={};e.id=567,e.ids=[567],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},35900:e=>{e.exports=require("pg")},41263:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>A,patchFetch:()=>N,requestAsyncStorage:()=>p,routeModule:()=>l,serverHooks:()=>y,staticGenerationAsyncStorage:()=>E});var r={};a.r(r),a.d(r,{GET:()=>d,dynamic:()=>u});var s=a(49303),o=a(88716),n=a(60670),i=a(87070),c=a(75748);let u="force-dynamic";async function d(){try{let e=await c.Z.connect();try{let t=await e.query(`
                SELECT status, COUNT(*) as count 
                FROM pb_leads 
                WHERE status IS NOT NULL AND status != ''
                GROUP BY status
            `),a=await e.query(`
                SELECT DATE(created_at) as date, COUNT(*) as count
                FROM pb_leads
                WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
                GROUP BY DATE(created_at)
                ORDER BY date ASC
            `),r=await e.query(`
                SELECT 
                    SUM(CASE WHEN score < 30 THEN 1 ELSE 0 END) as low,
                    SUM(CASE WHEN score >= 30 AND score < 70 THEN 1 ELSE 0 END) as medium,
                    SUM(CASE WHEN score >= 70 THEN 1 ELSE 0 END) as high
                FROM pb_leads
            `);return i.NextResponse.json({statusDistribution:t.rows,leadsByDay:a.rows,scoreDistribution:r.rows[0]})}finally{e.release()}}catch(e){return console.error("Fetch analytics DB error:",e.message),i.NextResponse.json({error:"Failed to fetch analytics"},{status:500})}}let l=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/analytics/route",pathname:"/api/analytics",filename:"route",bundlePath:"app/api/analytics/route"},resolvedPagePath:"C:\\Abdel\\Antigravity\\n8n-antigravity\\dashboard-payboys\\src\\app\\api\\analytics\\route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:p,staticGenerationAsyncStorage:E,serverHooks:y}=l,A="/api/analytics/route";function N(){return(0,n.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:E})}},75748:(e,t,a)=>{a.d(t,{Z:()=>r});let r=new(a(35900)).Pool({connectionString:process.env.DATABASE_URL,ssl:!process.env.DATABASE_URL?.includes("localhost")&&{rejectUnauthorized:!1}})}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[948,972],()=>a(41263));module.exports=r})();