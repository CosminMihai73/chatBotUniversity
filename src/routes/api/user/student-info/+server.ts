import type { RequestHandler } from '@sveltejs/kit';
import { UserController } from '$lib/controllers/UserController';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    if (!locals.user) {
      return new Response(JSON.stringify({ status: 'failed', error: 'Unauthorized' }), { status: 401 });
    }

    const data = await request.json();
    const idFacultate = data.idFacultate ?? null;
    const idCicluStudii = data.idCicluStudii ?? null;

    const result = await UserController.setStudentInfo(locals.user.id, { idFacultate, idCicluStudii });

    const headers: [string, string][] = [];
    if (result.cookies) {
      for (const c of result.cookies) {
        headers.push(['set-cookie', c]);
      }
    }

    return new Response(JSON.stringify({ status: result.status, message: result.message }), { status: result.code, headers });
  } catch (err) {
    console.error('Eroare la setStudentInfo:', err);
    return new Response(JSON.stringify({ status: 'failed', error: err instanceof Error ? err.message : String(err) }), { status: 500 });
  }
};
