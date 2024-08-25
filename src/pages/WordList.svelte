<script>
  export let wordList = [];
  export let foundWords = [];
</script>

<div class="word-list">
  <h3>Words to Find:</h3>
  <ul>
    {#each wordList as word}
      <li>{word}</li>
    {/each}
  </ul>
  <h3>Found Words:</h3>
  <ul>
    {#each foundWords as word}
      <li>{word}</li>
    {/each}
  </ul>
</div>
