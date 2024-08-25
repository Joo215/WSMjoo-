<script>
  import Header from "../components/Header.svelte";
  import { onMount } from "svelte";
  import { getAuth, onAuthStateChanged } from "firebase/auth";

  let isLoggedIn = false;

  onMount(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        isLoggedIn = true;
      } else {
        isLoggedIn = false;
      }
    });
  });
</script>

<Header location="home" />

<main>
  <div class="main-title">Welcome to Word Search Game</div>
  <div class="main-subtitle">Team Part 01</div>

  {#if isLoggedIn}
    <div class="buttons">
      <button
        on:click={() => (window.location.hash = "/game-start")}
        class="game-start-btn">게임 시작</button
      >
      <button
        on:click={() => (window.location.hash = "/game-maker")}
        class="game-maker-btn">게임 메이커</button
      >
    </div>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
