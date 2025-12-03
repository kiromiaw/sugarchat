import { token } from "../stores/auth";
import { get } from "svelte/store";
import { domain } from "./domain";
var API = get(domain);

export async function getRoomData(roomId : string) {
    const t = get(token);

    const res = await fetch(`http://${API}:1300/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${t}` }
    });
    return await res.json();
}

export async function loadMessages(roomId : string ) {
    const t = get(token);
    
    const res = await fetch(`http://${API}:1300/rooms/${roomId}/messages`, {
        headers: { Authorization: `Bearer ${t}` }
    });
    return await res.json();
    
    // scroll to bottom after loading
    // await tick();
    // chatContainer.scrollTop = chatContainer.scrollHeight;
}

export async function sendMessage(msgText:string,roomId:string) {
    const t = get(token);

    try {
        const res = await fetch(`http://${API}:1300/rooms/${roomId}/messages`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${t}`,'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: msgText,
                room: roomId
            })
        });
        
        if (!res.ok) throw new Error('Failed to send message');
        
        const data = await res.json();
        // loadMessages() // ! REMOVE THIS LATER, MAKE IT BETTER !
        return data;
    } catch (err) {
        console.error(err);
    }
    // chatContainer.scrollTop = chatContainer.scrollHeight;
}