import type { RequestHandler } from '@sveltejs/kit';
import { UserController } from '$lib/controllers/UserController';

export const POST: RequestHandler = async () => {
  try {
    const result = await UserController.logoutUser();

    const headers: [string, string][] = [];
    if (result.cookies) {
      for (const c of result.cookies) {
        headers.push(['set-cookie', c]);
      }
    }

    return new Response(JSON.stringify({ status: result.status, message: result.message }), {
      status: result.code,
      headers
    });
  } catch (err) {
    console.error('Eroare la logout:', err);
    return new Response(JSON.stringify({ status: 'failed', error: err instanceof Error ? err.message : String(err) }), { status: 500 });
  }
};
