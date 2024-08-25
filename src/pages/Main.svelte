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

  const handleGame = () => {
    window.location.hash = "/game";
  };

  const handleMaker = () => {
    window.location.hash = "/maker";
  };
</script>

<Header location="home" />

<main>
  <div class="main-title">Welcome to Word Search Game</div>
  <div class="main-subtitle">Team Part 01</div>

  <!-- 로그인이 되어있을 경우에만 버튼 두가지 띄움 -->
  {#if isLoggedIn}
    <div class="buttons">
      <button on:click={handleGame} class="game-start-btn">게임 시작</button>
      <button on:click={handleMaker} class="game-maker-btn">게임 메이커</button>
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
