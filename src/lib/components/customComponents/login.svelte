<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let email = "";
    let password = "";

    let emailError = false;
    let emailError2 = false;
    let passwordError = false;

    let Toaster: any = null;
    let toast: any = null;

    onMount(async () => {
        const module = await import("svelte-sonner");
        Toaster = module.Toaster;
        toast = module.toast;
    });

    function resetData(reset: boolean = false) {
        emailError = false;
        emailError2 = false;
        passwordError = false;

        if (reset) {
            email = "";
            password = "";
        }
    }

    async function loginUser() {
        resetData();

        email = email.trim();

        if (!email) {
            toast?.warning("Te rugăm să completezi adresa de email", {
                duration: 5000,
            });
            emailError = true;
            return;
        }

        if (!email.includes("@")) {
            toast?.warning("Te rugăm să introduci o adresă de email validă", {
                duration: 5000,
            });
            emailError2 = true;
            return;
        }

        if (!password) {
            toast?.warning("Te rugăm să completezi parola", { duration: 5000 });
            passwordError = true;
            return;
        }

        try {
            const response = await login(email, password);
            if (!response) return;

            if (response.status === "success") {
                toast?.success("Autentificare reușită!", { duration: 5000 });
                goto("/chat");
                resetData(true);
            } else if (response.status === "invalid") {
                toast?.error("Email sau parolă incorectă.", { duration: 5000 });
            } else {
                toast?.error("Eroare la autentificare.", { duration: 5000 });
                console.log("Eroare la login:", response.message);
            }
        } catch (err) {
            console.error("Eroare la loginUser:", err);
            toast?.error("Eroare la server. Încearcă din nou.", {
                duration: 5000,
            });
        }
    }

    async function login(email: string, password: string) {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include", 
            });

            if (!res.ok)
                throw new Error("Răspuns server invalid: " + res.status);
            return await res.json();
        } catch (err) {
            console.error("Eroare login ->", err);
        }
    }
</script>

<Card.Root class="w-full max-w-sm">
    {#if Toaster}
        <svelte:component this={Toaster} closeButton position="bottom-center" />
    {/if}

    <Card.Header>
        <Card.Title>Conectare</Card.Title>
        <Card.Description>
            Introdu adresa ta de email și parola pentru a te conecta la cont
        </Card.Description>
        <Card.Action>
            <Button variant="link" href="/register">Înregistrare</Button>
        </Card.Action>
    </Card.Header>

    <Card.Content>
        <form on:submit|preventDefault={loginUser}>
            <div class="flex flex-col gap-6">
                <div class="grid gap-2">
                    <Label for="email">Email</Label>
                    <Input
                        id="email"
                        type="text"
                        aria-invalid={emailError || emailError2}
                        bind:value={email}
                        placeholder="exemplu@domeniu.com"
                    />
                </div>

                <div class="grid gap-2">
                    <Label for="password">Parolă</Label>
                    <Input
                        id="password"
                        type="password"
                        bind:value={password}
                        aria-invalid={passwordError}
                    />
                </div>

                <Button type="submit" class="w-full">Autentificare</Button>
            </div>
        </form>
    </Card.Content>
</Card.Root>
