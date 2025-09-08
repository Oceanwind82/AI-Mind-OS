import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Bypass all redirects/auth during e2e testing
  if (process.env.NEXT_PUBLIC_E2E === "true") {
    return NextResponse.next();
  }
  
  // Your existing auth/redirect logic would go here
  return NextResponse.next();
}
