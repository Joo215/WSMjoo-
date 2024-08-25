<script>
  import Main from "./pages/Main.svelte";
  import Login from "./pages/Login.svelte";
  import NotFound from "./pages/NotFound.svelte";
  import Router from "svelte-spa-router";
  import "./CSS/style.css";
  import Sign from "./pages/Sign.svelte";
  import {
    getAuth,
    GoogleAuthProvider,
    signInWithCredential,
  } from "firebase/auth";
  import { onMount } from "svelte";
  import { user$ } from "./store";
  import Loading from "./pages/Loading.svelte";
  import Game from "./pages/Game.svelte";
  import Maker from "./pages/Maker.svelte";
  import WordList from "./pages/WordList.svelte";
  import GameGrid from "./pages/GameGrid.svelte";

  let isLoading = true;

  // const auth = getAuth();

  // const checkLogin = async () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return (isLoading = false);
  //   const credential = GoogleAuthProvider.credential(null, token);
  //   const result = await signInWithCredential(auth, credential);
  //   const user = result.user;
  //   user$.set(user);
  //   isLoading = false;
  // };
  const routes = {
    "/": Main,
    "/login": Login,
    "/sign": Sign,
    "/game": Game,
    "/maker": Maker,
    "*": NotFound,
  };
  // onMount(() => checkLogin());
</script>

<Router {routes} />

<!-- {#if isLoading}
  <Loading />
{:else if !$user$}
  <Login />
{:else}
  <Router {routes} />
{/if} -->
