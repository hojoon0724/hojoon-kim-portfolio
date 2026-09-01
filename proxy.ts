import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Paths that should be hidden in production.
const PREVIEW_ONLY_PATHS = ["/build", "/components", "/sticky", "/data"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPreviewOnlyPath = PREVIEW_ONLY_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  if (isPreviewOnlyPath && process.env.VERCEL_ENV === "production") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
