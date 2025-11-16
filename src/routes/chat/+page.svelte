<script lang="ts">
  export let data: { user: { id: number; email: string } };
</script>

<h1>Bine ai venit, {data.user.email}!</h1>
<p>Doar utilizatorii logați pot vedea această pagină.</p>
