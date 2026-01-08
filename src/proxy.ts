import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/server/auth';

export default async function proxy(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.next();
  }

  if (!session.user.handle || !session.user.displayName) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|.*\\.png$|onboarding).*)',
}
