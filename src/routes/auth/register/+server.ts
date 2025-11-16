import type { RequestHandler } from '@sveltejs/kit';
import { UserController } from '$lib/controllers/UserController';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const result = await UserController.createUser(data);

    return new Response(JSON.stringify(result), { status: result.code });
  } catch (err) {
    console.error('Eroare la crearea utilizatorului:', err);
    return new Response(
      JSON.stringify({ status: 'failed', error: err instanceof Error ? err.message : String(err) }),
      { status: 500 }
    );
  }
};
