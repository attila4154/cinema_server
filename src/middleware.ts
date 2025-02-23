// import { NextRequest, NextResponse } from "next/server";
// import { getAuthState } from "./app/service/authorizationService";

// // 1. Specify protected and public routes
// const protectedRoutes = ["/api/my-cinemas"];
// const publicRoutes = ["/api/authorize", "/my-cinemas", "/"];

export default function middleware() {}

// export default async function middleware(req: NextRequest) {
//   // 2. Check if the current route is protected or public
//   const path = req.nextUrl.pathname;
//   const isProtectedRoute = protectedRoutes.includes(path);

//   const authState = await getAuthState();

//   // 4. Redirect to /login if the user is not authenticated
//   if (isProtectedRoute && !authState.loggedIn) {
//     return NextResponse.redirect(
//       new URL("/authorize/login", req.nextUrl)
//     );
//   }

//   return NextResponse.next();
// }

// // Routes Middleware should not run on
// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|.*\\.png$).*)",
//   ],
// };
