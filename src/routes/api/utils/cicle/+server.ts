import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { FacultyController } from '$lib/controllers/FacultyController';

export async function GET(event: RequestEvent) {
    console.debug('/api/utils/cicle GET called, url=', event.url.href);
    const result = await FacultyController.getCicluri();
    console.debug('/api/utils/cicle result:', result?.code, result?.status);

    return json(result, { status: result.code });
}
