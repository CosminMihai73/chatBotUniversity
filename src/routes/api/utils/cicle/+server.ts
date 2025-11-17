import { json } from '@sveltejs/kit';
import { FacultyController } from '$lib/controllers/FacultyController';

export async function GET() {
    const result = await FacultyController.getCicluri();

    return json(result, { status: result.code });
}
