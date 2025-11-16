import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET;

export const handle: Handle = async ({ event, resolve }) => {
  const cookieHeader = event.request.headers.get('cookie');
  const jwtCookie = cookieHeader?.split('; ').find(c => c.startsWith('jwt='))?.split('=')[1];

  if (jwtCookie) {
    try {
      const user = jwt.verify(jwtCookie, JWT_SECRET) as { id: number; email: string };
      event.locals.user = user;
    } catch {
      event.locals.user = undefined;
    }
  } else {
    event.locals.user = undefined;
  }

  return resolve(event);
};
