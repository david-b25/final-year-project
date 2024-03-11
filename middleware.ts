import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextFetchEvent, NextResponse } from "next/server";
 
export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  const url = req.nextUrl;
  const requestHeaders = new Headers(req.headers)
  const customDomain = requestHeaders.get('X-Served-For')
  
  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers
    .get('host')!
    .replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ''
  }`;

  if (customDomain) {
    return NextResponse.rewrite(new URL(`/${customDomain}${path}`, req.url));
  }

  if (
    hostname !== "localhost:3000" &&
    hostname !== process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
  }

  return authMiddleware({
    publicRoutes: ["/", "/contact", "/privacy", "/terms"],
  })(req, event);
}

