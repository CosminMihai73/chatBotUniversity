import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    if (event.locals.needsProfileCompletion) throw redirect(302, '/student-info');
    throw redirect(302, '/chat');
  }
  return {};
};
