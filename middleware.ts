import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard and builder routes
        if (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/builder")) {
          return !!token
        }
        return true
      },
    },
  },
)

export const config = {
  matcher: ["/dashboard/:path*", "/builder/:path*"],
}
