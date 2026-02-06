import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {

//   const { protect } = await auth(); 

  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // "/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"
    "/((?!_next|.*\\.(?:css|js|map|png|jpg|jpeg|gif|svg|webp|ico|txt|xml|json)).*)",
  ],
};
