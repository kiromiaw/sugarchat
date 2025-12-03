import axios from "axios";
import { token, user } from "../stores/auth";
import { get } from "svelte/store";
import { domain } from "./domain";

var API = get(domain); // your backend

export async function logout(){
  token.set(null);
  user.set(null);

  localStorage.removeItem("authToken");
}

export async function verifySavedLogin() {
  console.log("checking login...")
  const savedToken = localStorage.getItem("authToken"); //get token
  if (!savedToken) return false;//no token return

  try {
    const res = await axios.get(`http://${API}:1300/users/me`, {
      headers: { Authorization: `Bearer ${savedToken}` }
    });
    token.set(savedToken);
    user.set(res.data);
    return true;
  } catch {
    return false;
  }
}

export async function login(username: string, password: string, targetDomain:string) {
  if(targetDomain){
    domain.set(targetDomain); // domain persists
    console.log(targetDomain)
    console.log(`http://${API}:1300`)
  }
  else return;

  try {
    const res = await axios.post(`http://${API}:1300/users/login`, { username, password });
    token.set(res.data.token);
    localStorage.setItem("authToken", res.data.token);

    // fetch current user
    const userRes = await axios.get(`http://${API}:1300/users/me`, {
      headers: { Authorization: `Bearer ${res.data.token}` }
    });
    user.set(userRes.data);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function register(username: string, password: string) {
  try {
    const res = await axios.post(`http://${API}:1300/users/register`, { username, password });
    token.set(res.data.token);

    const userRes = await axios.get(`http://${API}:1300/users/me`, {
      headers: { Authorization: `Bearer ${res.data.token}` }
    });
    user.set(userRes.data);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
