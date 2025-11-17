import type { RequestHandler } from '@sveltejs/kit';
import { UserController } from '$lib/controllers/UserController';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  // Provide a simple GET logout that clears cookies and redirects home
  const result = await UserController.logoutUser();

  const headers: [string, string][] = [];
  if (result.cookies) {
    for (const c of result.cookies) {
      headers.push(['set-cookie', c]);
    }
  }

  return new Response(null, {
    status: 302,
    headers: [...headers, ['location', '/']]
  });
};
