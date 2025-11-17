import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    throw redirect(302, '/');
  }

  if (!event.locals.needsProfileCompletion) {
    throw redirect(302, '/chat');
  }

  return {
    user: event.locals.user
  };
};
