import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/chats"
];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("roleRallyUserToken")?.value;
  const { pathname } = request.nextUrl;

  if (!PROTECTED_ROUTES.some(p => pathname.startsWith(p))) {
    if (token) {
      if (pathname === "/login") {
        return NextResponse.redirect(new URL("/chats", request.url));
      }
    } else {
      return NextResponse.next();
    }
  } else {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    } else {
      const user = await (await fetch(`${request.nextUrl.origin}/api/users/testUser`)).json();
      if (!user.data) {
        request.cookies.delete("roleRallyUserToken");
      }
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};