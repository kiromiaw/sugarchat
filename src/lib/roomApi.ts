import { token } from "../stores/auth";
import { get } from "svelte/store";
import { domain } from "./domain";
var API = get(domain);

export async function loadRooms() {
    const t = get(token);
    const res = await fetch(`http://${API}:1300/rooms/`, {
        headers: {
        Authorization: `Bearer ${t}`,
        },
    });
    if (!res.ok) {
        console.error('failed to fetch rooms', await res.text());
        return null;
    }
    
    return await res.json();
}

export async function joinRoom(room:string){
    const t = get(token);
    const res = await fetch(`http://${API}:1300/rooms/${room}/join`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${t}`,
        },
    });
    
    console.log(await res.json());
    return loadRooms();
}

export async function leaveRoom(room:string){
    console.log(room);
    const t = get(token);
    const res = await fetch(`http://${API}:1300/rooms/${room}/leave`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${t}`,
        },
    });
    
    console.log(await res.json());
}