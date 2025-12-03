<!-- <script lang="ts">
  import { invoke } from "@tauri-apps/api/core";

  let name = $state("");
  let greetMsg = $state("");

  async function greet(event: Event) {
    event.preventDefault();
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsg = await invoke("greet", { name });
  }
</script> -->

<script lang="ts">
  import { currentPage, showPage } from '../lib/pageStore';
  import RoomList from './RoomList.svelte';
  import ChatRoom from './ChatRoom.svelte';
  import Login from './Login.svelte';
  import "../styles.css"
  const pages = { roomList: RoomList, chatRoom: ChatRoom, login: Login } as const;

  // autologin if you're already logged in or whatever
  const token = localStorage.getItem("authToken");

  if (token) {
    
  }

</script>

<svelte:component this={pages[$currentPage] as any} {...{ showPage }}/>
