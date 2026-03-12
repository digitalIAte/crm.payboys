import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/crm/login",
  },
});

export const config = {
  matcher: [
    "/crm/:path*", // Protect all CRM routes
    "/api/leads/:path*", // Also protect internal API leads routes
    "/api/analytics/:path*",
    "/api/reminders/:path*",
    "/api/templates/:path*",
  ],
};
