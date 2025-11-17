<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let facultati: any[] = [];  
    let cicluriStudii: any[] = [];   
    let selectedFacultate: string | undefined = undefined;
    let selectedCiclu: string | undefined = undefined;
        let facultateInvalid: boolean = false;
        let cicluInvalid: boolean = false;

    let Toaster: any = null;
    let toast: any = null;

    onMount(async () => {
        const module = await import("svelte-sonner");
        Toaster = module.Toaster;
        toast = module.toast;

        await getFacultati();
        await getCicluriStudii();
    });

    async function getFacultati() {
        try {
        const res = await fetch('/api/utils/faculty', {
            method: 'GET',
            credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch facultati');
        const data = await res.json();
        facultati = data.data.facultati;
        } catch (err) {
        console.error('getFacultati error:', err);
        }
    }

    async function getCicluriStudii() {
        try {
        const res = await fetch('/api/utils/cicle', {
            method: 'GET',
            credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch cicluri studii');
        const data = await res.json();
        cicluriStudii = data.data.cicluri_studii;
        } catch (err) {
        console.error('getCicluriStudii error:', err);
        }
    }

    function resetValidation() {
        facultateInvalid = false;
        cicluInvalid = false;
    }

    async function handleSubmit() {
        resetValidation();

        if (!selectedFacultate) {
            toast?.warning("Te rugăm să selectezi facultatea", { duration: 5000 });
            facultateInvalid = true;
            return;
        }

        if (!selectedCiclu) {
            toast?.warning("Te rugăm să selectezi ciclul de studii", { duration: 5000 });
            cicluInvalid = true;
            return;
        }

        try {
            const res = await fetch('/api/user/student-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ idFacultate: Number(selectedFacultate), idCicluStudii: Number(selectedCiclu) })
            });

            if (!res.ok) {
                let data = null;
                try { data = await res.json(); } catch (e) {}
                toast?.error(data?.error ?? 'Eroare la salvare', { duration: 5000 });
                return;
            }

            toast?.success('Informațiile au fost salvate', { duration: 5000 });
            goto('/chat');
        } catch (err) {
            console.error('handleSubmit error:', err);
            toast?.error('Eroare la server. Încearcă din nou.', { duration: 5000 });
        }
    }

</script>

<Card.Root class="w-full max-w-sm">
    {#if Toaster}
        <svelte:component this={Toaster} closeButton position="bottom-center" />
    {/if}
    <Card.Header>
        <Card.Title class="text-2xl font-bold mb-2">Informații personale</Card.Title>
        <Card.Description>
           Pentru a avea o experiență cât mai bună, te rugăm să completezi informațiile despre studii.
        </Card.Description>
    </Card.Header>

    <Card.Content>
        <form on:submit|preventDefault={handleSubmit}>
            <div class="flex flex-col gap-6">
                <div class="grid gap-2">
                    <Select.Root type="single" bind:value={selectedFacultate}>
                        <Select.Trigger class="w-full" aria-invalid={facultateInvalid}><span data-slot="select-value">{#if selectedFacultate}{facultati.find(f => String(f.id) === selectedFacultate)?.denumire ?? selectedFacultate}{:else}Alege facultate{/if}</span></Select.Trigger>
                    <Select.Content>
                        {#each facultati as f}
                            <Select.Item value={String(f.id)} label={f.denumire} />
                        {/each}
                    </Select.Content>
                    </Select.Root>
                </div>

                <div class="grid gap-2">
                    <Select.Root type="single" bind:value={selectedCiclu}>
                        <Select.Trigger class="w-full" aria-invalid={cicluInvalid}><span data-slot="select-value">{#if selectedCiclu}{cicluriStudii.find(c => String(c.id) === selectedCiclu)?.denumire ?? selectedCiclu}{:else}Alege ciclu studii{/if}</span></Select.Trigger>
                    <Select.Content>
                        {#each cicluriStudii as c}
                            <Select.Item value={String(c.id)} label={c.denumire} />
                        {/each}
                    </Select.Content>
                    </Select.Root>
                </div>

                <Button type="submit" class="w-full">Salvează informațiile</Button>
            </div>
        </form>
    </Card.Content>

    <Card.Footer></Card.Footer>
</Card.Root>
