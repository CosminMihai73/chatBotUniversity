import type { RequestHandler } from '@sveltejs/kit';
import { UserController } from '$lib/controllers/UserController';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const result = await UserController.loginUser(data);

    const headers: [string, string][] = [];
    if (result.cookies) {
      for (const c of result.cookies) {
        headers.push(['set-cookie', c]);
      }
    }

    return new Response(JSON.stringify({ status: result.status, message: result.message, user: result.user }), {
      status: result.code,
      headers
    });
  } catch (err) {
    console.error('Eroare la conectare:', err);
    return new Response(
      JSON.stringify({ status: 'failed', error: err instanceof Error ? err.message : String(err) }),
      { status: 500 }
    );
  }
};
