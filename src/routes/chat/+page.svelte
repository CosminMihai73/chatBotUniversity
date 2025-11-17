<script lang="ts">
  import { goto } from '$app/navigation';
  export let data: { user: { id: number; email: string } };

  async function logout() {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Logout failed');
      goto('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }
</script>

<h1>Bine ai venit, {data.user.email}!</h1>
<p>Doar utilizatorii logați pot vedea această pagină.</p>

<div class="mt-4">
  <button on:click={logout} class="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
</div>
