<script lang="ts">
    import { showPage } from "../lib/pageStore"
    export let name: string
    export let id: string
    export let img: string
</script>

<button class="main" on:click={() => showPage('chatRoom',id)}>
    <img class="image" src={img} alt={name}/>
    <div class="info">
        <div class="infotitle">
            <h3>{name}</h3>
        </div>
        <h5>{id}</h5>
    </div>
</button>

<style>
.main{
    all:unset;
    border: 2px solid #333;
    border-radius: 10px;
    height:3cm;
    width:auto;
    margin:0.1cm 0cm;
    display:flex;
    transition: all 0.3s ease-out;
    background-color: black;
}

.main:hover{
    background-color: #333;
    transition: all 0s;
}

.main h3,
.main h5 {
    transition: all 0.3s ease-out;
}

.main:hover h3,
.main:hover h5 {
    color: white;
    transition: all 0s;
}

.image{
    background-color: #333;
    aspect-ratio: 1/1;
    margin: 0.2cm;
    object-fit: cover;
    border-radius: 10px;
}

.infotitle{
    display:flex;
}

h3 {
    margin: 0;
}

h5 {
    width: 100%;
    margin:0;
    margin-top: auto;
    text-align: right;
    color: #333;
}

.info {
    display:flex;
    flex-direction: column;
    flex:1;
    padding: 10px;
}

</style>