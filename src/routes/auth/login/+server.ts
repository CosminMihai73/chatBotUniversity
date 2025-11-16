import { UserController } from '$lib/controllers/UserController';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
  try {
    const data = await event.request.json();
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
    return new Response(JSON.stringify({ status: 'failed', error: err instanceof Error ? err.message : String(err) }), { status: 500 });
  }
};
