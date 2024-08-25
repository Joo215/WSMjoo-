<script>
  export let grid = [];
  export let selectedCells = [];
  export let handleCellMouseDown;
  export let handleCellMouseEnter;
  export let handleCellMouseUp;
</script>

<div class="game-grid" on:mouseup={handleCellMouseUp} role="grid" tabindex="0">
  {#each grid as row, rowIndex}
    <div class="grid-row">
      {#each row as cell, colIndex}
        <div
          class="grid-cell"
          on:mousedown={() => handleCellMouseDown(rowIndex, colIndex)}
          on:mouseenter={() => handleCellMouseEnter(rowIndex, colIndex)}
          role="button"
          tabindex="0"
          class:selected={selectedCells.some(
            (selected) => selected.row === rowIndex && selected.col === colIndex
          )}
          class:wrong={selectedCells.some(
            (selected) =>
              selected.row === rowIndex &&
              selected.col === colIndex &&
              selected.wrong
          )}
        >
          {cell}
        </div>
      {/each}
    </div>
  {/each}
</div>
