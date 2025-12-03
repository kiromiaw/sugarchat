<script lang="ts">
    import { showPage } from "../lib/pageStore"
    import { login, verifySavedLogin } from "$lib/api";
    let username = "";
    let password = "";
    let domain = "";
    let error = "";

    async function submit() {
        const success = await login(username, password, domain);
        if (!success) error = "invalid credentials";
        else showPage("roomList");
    }

    verifySavedLogin().then(ok => {
        showPage(ok ? "roomList" : "login");
    });

</script>

<h1>sugarchat login</h1>

<form>
    <input placeholder="username" bind:value={username} />
    <input type="password" placeholder="password" bind:value={password} />
    <input type="domain" placeholder="domain" bind:value={domain} />
    <button on:click={submit}>login</button>
</form>

<p>{error}</p>

<style>
    form{
        display:flex;
        flex-direction: column;
    }
    h1{
        margin:0.5em;
        margin-top:1em;
    }
    input{
        all:unset;
        background-color: #222;
        padding: 0.5em;
        margin: 0.3em 0.2cm;
        display:block;
        width: auto;
        box-sizing: border-box;
        border-radius: 5px;
    }

    button{
        all:unset;
        background-color: #333;
        padding: 0.5em 1em;
        margin: 0.5em 0.2cm;
        width: fit-content;
        border-radius: 10px;
    }

    button:hover{
        background-color: #444;
    }
    p{
        margin: 1em;
    }
</style>