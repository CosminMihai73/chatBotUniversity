import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { FacultyController } from '$lib/controllers/FacultyController';

export async function GET(event: RequestEvent) {
    console.debug('/api/utils/faculty GET called, url=', event.url.href);
    const result = await FacultyController.getFacultati();
    console.debug('/api/utils/faculty result:', result?.code, result?.status);

    return json(result, { status: result.code });
}
