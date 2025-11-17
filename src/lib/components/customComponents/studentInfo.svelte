<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let facultati: any[] = [];  
    let cicluriStudii: any[] = [];   

    let Toaster: any = null;
    let toast: any = null;

    onMount(async () => {
        const module = await import("svelte-sonner");
        Toaster = module.Toaster;
        toast = module.toast;
    });

</script>

<Card.Root class="w-full max-w-sm">
    {#if Toaster}
        <svelte:component this={Toaster} closeButton position="bottom-center" />
    {/if}
    <Card.Header>
        <Card.Title class="text-2xl font-bold mb-2">Informații personale</Card.Title>
        <Card.Description>
           Pentru a avea o experiență cât mai bună, te rugăm să îți completezi informațiile despre studii.
        </Card.Description>
    </Card.Header>

    <Card.Content>
        <form>
            <div class="flex flex-col gap-6">
                <div class="grid gap-2">
                    <Label for="username">Facultatea</Label>
                    
                </div>

                <div class="grid gap-2">
                    <Label for="email">Ciclu de studii</Label>
                   
                </div>

                <Button type="submit" class="w-full">Salvează informațiile</Button>
            </div>
        </form>
    </Card.Content>

    <Card.Footer></Card.Footer>
</Card.Root>
