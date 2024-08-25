<script>
  import Header from "../components/Header.svelte";

  let title = "Example Game Title";
  let description =
    "This is a sample description of the game. It provides some basic information about the game's purpose, rules, and other details that players should be aware of before starting the game.";
</script>

<Header location="game" />

<main>
  <div class="game-title">Title: {title}</div>
  <div class="game-description">
    <div class="game-description__label">Description:</div>
    <div class="game-description__info">
      {description}
    </div>
  </div>
</main>

<style>
  main {
    padding: 2rem;
    font-family: Arial, sans-serif;
    background-color: #f8f8f8;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
