import { NextResponse, type NextRequest } from "next/server";

/** Fast pre-check only. Real session validation happens server-side in the admin layout and every admin API. */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!req.cookies.get("aura_admin")?.value) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }
  const res = NextResponse.next();
  if (pathname.startsWith("/admin")) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
