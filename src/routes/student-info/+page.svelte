<script lang="ts">
  import { goto } from '$app/navigation';
  import StudentInfo from '$lib/components/customComponents/studentInfo.svelte';
  
  let idFacultate: number | null = null;
  let idCicluStudii: number | null = null;

  async function submit(e?: Event) {
    e?.preventDefault();
    try {
      const res = await fetch('/api/user/student-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idFacultate, idCicluStudii })
      });
      if (!res.ok) throw new Error('Failed to save');
      goto('/chat');
    } catch (err) {
      console.error('Save error', err);
    }
  }
</script>

<div class="flex justify-center items-center h-screen bg-gray-200">
    <StudentInfo />
</div>
