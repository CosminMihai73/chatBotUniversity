import { json } from '@sveltejs/kit';
import { FacultyController } from '$lib/controllers/FacultyController';

export async function GET() {
    const result = await FacultyController.getFacultati();

    return json(result, { status: result.code });
}
