import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

function getJwtSecret() {
  // Read secret and strip possible surrounding quotes/spaces from .env
  const raw = import.meta.env.VITE_JWT_SECRET as string | undefined;
  if (!raw) return undefined;
  return raw.replace(/^['"]|['"]$/g, '').trim();
}

const JWT_SECRET = getJwtSecret();

export const handle: Handle = async ({ event, resolve }) => {
  const jwtCookie = event.cookies.get('jwt');

  if (import.meta.env.DEV) {
    console.debug('[auth] jwtCookie present:', !!jwtCookie);
    if (!JWT_SECRET) console.debug('[auth] JWT secret is missing');
  }

  if (jwtCookie && JWT_SECRET) {
    try {
      const user = jwt.verify(jwtCookie, JWT_SECRET) as { id: number; email: string; idFacultate?: number | null; idCicluStudii?: number | null };
      if (import.meta.env.DEV) console.debug('[auth] JWT verified for user id:', (user as any).id);
      // expose profile fields on locals
      event.locals.user = user;
      event.locals.needsProfileCompletion = !user.idFacultate || !user.idCicluStudii;
    } catch (err) {
      console.warn('JWT verification failed:', err);
      event.locals.user = undefined;
      event.locals.needsProfileCompletion = false;
    }
  } else {
    if (!JWT_SECRET) console.warn('JWT secret is not set (VITE_JWT_SECRET)');
    event.locals.user = undefined;
    event.locals.needsProfileCompletion = false;
  }

  // If user is authenticated but hasn't completed profile, block access to other pages
  if (event.locals.user && event.locals.needsProfileCompletion) {
    const p = event.url.pathname;
    const allowedPrefixes = [
      '/student-info',
      '/api/user/student-info',
      '/api/auth/logout',
      '/auth/logout',
      '/api/auth/login',
      '/api/auth/register',
      '/favicon.ico',
      '/_app',
      '/assets',
      '/static'
    ];

    const allowed = allowedPrefixes.some((pre) => p === pre || p.startsWith(pre + '/') || p.startsWith(pre));

    if (!allowed) {
      return new Response(null, { status: 302, headers: { location: '/student-info' } });
    }
  }

  return resolve(event);
};

