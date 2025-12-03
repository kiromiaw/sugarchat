<!-- todo list -->
<script lang="ts">
    import { onDestroy, onMount, tick } from 'svelte';
    import { get } from 'svelte/store';
    import { token } from '../stores/auth';
    import { showPage, currentChat } from "../lib/pageStore"
    import ChatMessage from '../components/ChatMessage.svelte'
    import { leaveRoom } from '../lib/roomApi'
    import { getRoomData, loadMessages, sendMessage } from '../lib/chatApi'

    import Popup from '../components/Popup.svelte'
    let roomSettings: boolean = false;

    let ws: WebSocket;
    let messages: any[] = []
    let roomData: any = {};
    let chatContainer: HTMLDivElement;
    let msgText: string;
    
    $: roomId = $currentChat;

    function connectWS() {
        ws = new WebSocket('ws://localhost:5001');

        ws.onopen = () => console.log('ws connected');
        ws.onmessage = async (e) => {
        const data = JSON.parse(e.data);
        if (data.type === 'message' && data.roomId === roomId) {
            messages = [...messages, data.message];
            await tick();
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        };

        ws.onclose = () => {
        console.log('ws disconnected, reconnecting in 2s');
        setTimeout(connectWS, 2000);
        };
    }


    async function handleLeave() {
        if (!roomId) return;
        await leaveRoom(roomId);
        showPage('roomList')
    }

    async function handleGetRoomData() {
        if (roomId){
            roomData = await getRoomData(roomId);
        }
    }

    async function handleLoadMessages() {
        if (roomId){
            messages = await loadMessages(roomId);
            await tick();
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    async function handleSendMessage() {
        if (roomId){
            await sendMessage(msgText, roomId)
        }
        msgText = "";
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function handleKey(e: KeyboardEvent) {
        if (e.key === 'Enter') handleSendMessage();
        if (e.key === 'Escape') showPage("roomList");
    }

    onMount(() => {
        connectWS();
        handleGetRoomData();
        handleLoadMessages();
        window.addEventListener("keydown", handleKey);
    });

    onDestroy(() => {
        ws.close();
        window.removeEventListener("keydown", handleKey);
    });

</script>

<div class="chat-layout">
    <header>
        <button class="back" on:click={() => showPage('roomList')}><img src="/back.svg" alt="back"></button>
        <button class="room-button" on:click={() => roomSettings = true}>
            <img class="room-image" src={roomData.roomImage} alt="room">
        </button>
        <h2>{roomData.roomName}</h2>
    </header>

    <div bind:this={chatContainer} class="chat-room">
        {#each messages as m}
            <ChatMessage owner={m.owner.displayName} text={m.text} time={m.sentAt} pfp={m.owner.profilePicture} />
        {/each}
    </div>
    <footer>
        <input class="text-input" placeholder="Send message..." type="text" bind:value={msgText}/>
        <button on:click={() => handleSendMessage()}>
            send
        </button>
    </footer>
</div>

<!-- settings popup -->
{#if roomSettings}
<Popup
title="join room"
open={roomSettings}
onClose={() => roomSettings = false}
>
    <div class="popup-body">
        <img class="popup-image" src={roomData.roomImage} alt="room"/>
        <div>
            <h4 class="popup-menu">{roomData.roomName}</h4>
            <button class="popup-button" on:click={handleLeave}>Leave room</button>
        </div>
    </div>
</Popup>
{/if}



<style>
    .popup-body{
        display:flex;
        gap:10px;
    }

    .popup-image{
        aspect-ratio: 1/1;
        width: 30%;
    }

    .room-button {
        all:unset;
        margin: auto 0;
        height:50px;
    }
    
    .room-image {
        width: 50px;
        height :50px;
        border-radius: 100%;
        transition: all 300ms
    }

    .room-button:hover .room-image {
        filter:brightness(1.2);
        transform: scale(1.1);
        transition: all 50ms;
    }
    
    .back {
        all: unset;
        transition: all 0.4s;
        height:60px;
        width:60px;
        aspect-ratio: 1/1;
        background-color: rgb(53, 53, 53);
    }

    .back:hover {
        background-color: rgb(105, 105, 105);
        width: 70px;
        transition:all 0.1s;
    }

    .back img {
        height:60px;
        width:60px;
    }

    /* profile etc */
    header{
        display:flex;
        height:60px;
        background-color: rgb(30, 30, 30);
        gap: 10px;
    }

    footer{
        background-color: rgb(30, 30, 30);
        display:flex;
        height:50px;
        padding:5px;
        gap: 5px;
    }

    footer button {
        all:unset;
        background-color: black;
        border-radius: 100%;
        height:100%;
        aspect-ratio: 1 / 1;
        text-align: center;
    }

    /* text input */
    .text-input{
        all:unset;
        width:100%;
        background-color: black;
        padding:20px;
    }

    .chat-room {
        flex:1;
        overflow-y:scroll;
        -webkit-overflow-scrolling: touch;
        padding: 0px 10px;
        padding-bottom: 10px;
    }

    .chat-layout {
        display: flex;
        flex-direction: column;
        height: 100vh; /* full screen */
    }

</style>
