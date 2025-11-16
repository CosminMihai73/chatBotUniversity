<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let username = "";
    let usernameError = false;

    let email = "";
    let emailError = false;
    let emailError2 = false;

    let password = "";
    let passwordError = false;
    let passwordError2 = false;

    let confirmPassword = "";
    let confirmPasswordError = false;

    let Toaster: any = null;
    let toast: any = null;

    onMount(async () => {
        const module = await import("svelte-sonner");
        Toaster = module.Toaster;
        toast = module.toast;
    });

    function resetData(reset: boolean = false) {
        usernameError = false;
        emailError = false;
        emailError2 = false;
        passwordError = false;
        passwordError2 = false;
        confirmPasswordError = false;

        if (reset) {
            username = "";
            email = "";
            password = "";
            confirmPassword = "";
        }
    }

    async function registerUser() {
        resetData();

        username = username.trim();
        email = email.trim();

        if (!username) {
            toast?.warning("Te rugăm să completezi numele de utilizator", {
                duration: 5000,
            });
            usernameError = true;
            return;
        }

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

        if (password.length < 6) {
            toast?.warning("Parola trebuie să aibă minim 6 caractere", {
                duration: 5000,
            });
            passwordError2 = true;
            return;
        }

        if (password !== confirmPassword) {
            toast?.warning("Parolele nu coincid", { duration: 5000 });
            confirmPasswordError = true;
            return;
        }

        try {
            const response = await register(username, email, password);
            if (!response) return;

            if (response.status === "success") {
                toast?.success("Cont creat cu succes!", { duration: 5000 });
                goto("/");
                resetData(true);
            } else if (response.status === "duplicate") {
                toast?.info("Email sau username deja existent.");
            } else {
                toast?.error("Eroare la înregistrare.", { duration: 5000 });
                console.log("Eroare la înregistrare:", response.message);
            }
        } catch (err) {
            console.error("Eroare la handleSubmit:", err);
            toast?.error("Eroare la server. Încearcă din nou.", {
                duration: 5000,
            });
        }
    }

    async function register(username: string, email: string, password: string) {
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            if (!res.ok)
                throw new Error("Răspuns server invalid: " + res.status);
            return await res.json();
        } catch (err) {
            console.error("Eroare la funcția register ->", err);
        }
    }
</script>

<Card.Root class="w-full max-w-sm">
    {#if Toaster}
        <svelte:component this={Toaster} closeButton position="bottom-center" />
    {/if}
    <Card.Header>
        <Card.Title>Înregistrare</Card.Title>
        <Card.Description>
            Creează un cont nou completând datele de mai jos.
        </Card.Description>
        <Card.Action>
            <Button variant="link" href="/">Conectare</Button>
        </Card.Action>
    </Card.Header>

    <Card.Content>
        <form on:submit|preventDefault={registerUser}>
            <div class="flex flex-col gap-6">
                <div class="grid gap-2">
                    <Label for="username">Nume utilizator</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="ion.popescu"
                        aria-invalid={usernameError}
                        bind:value={username}
                        title="Nume utilizator"
                    />
                </div>

                <div class="grid gap-2">
                    <Label for="email">Email</Label>
                    <Input
                        id="email"
                        type="text"
                        aria-invalid={emailError || emailError2}
                        placeholder="exemplu@domeniu.com"
                        bind:value={email}
                        title="Email"
                    />
                </div>

                <div class="grid gap-2">
                    <Label for="password">Parola</Label>
                    <Input
                        id="password"
                        type="password"
                        aria-invalid={passwordError || passwordError2}
                        bind:value={password}
                        title="Parola"
                    />
                </div>

                <div class="grid gap-2">
                    <Label for="confirmPassword">Confirmă parola</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        aria-invalid={confirmPasswordError}
                        bind:value={confirmPassword}
                        title="Confirmă parola"
                    />
                </div>

                <Button type="submit" class="w-full">Creează contul</Button>
            </div>
        </form>
    </Card.Content>

    <Card.Footer></Card.Footer>
</Card.Root>
