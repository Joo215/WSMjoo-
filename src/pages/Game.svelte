<script>
  import Header from "../components/Header.svelte";
  import { onMount } from "svelte";
  import { initializeApp } from "firebase/app";
  import {
    getDatabase,
    ref,
    onValue,
    push,
    query,
    orderByChild,
  } from "firebase/database";
  import { getAuth } from "firebase/auth";

  const firebaseConfig = {
    apiKey: "AIzaSyAqEGY7SClDIBIEFuKEDIWXsGWdPyNyha4",
    authDomain: "wsm-clone-ad6b5.firebaseapp.com",
    projectId: "wsm-clone-ad6b5",
    storageBucket: "wsm-clone-ad6b5.appspot.com",
    messagingSenderId: "826732808522",
    appId: "1:826732808522:web:45189193293d8ce5e819b3",
    databaseURL:
      "https://wsm-clone-ad6b5-default-rtdb.asia-southeast1.firebasedatabase.app/",
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth();

  let title = "Game Title";
  let description = "Description will appear here.";
  let wordList = new Array(10).fill("");
  let grid = Array.from({ length: 10 }, () => Array(10).fill(""));
  let foundWords = [];
  let selectedCells = [];
  let score = 0;
  let timeLeft = 300; // 5분 = 300초
  let gameOver = false;
  let gameId = null;
  let gameTitles = [];
  let selectedGameId = null;
  let timerInterval;
  let startTime;
  let rankings = [];

  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 1;
      } else {
        clearInterval(timerInterval);
        endGame();
      }
    }, 1000);
  }

  function endGame() {
    gameOver = true;
    alert(`시간초과로 게임이 종료되었습니다.`);
    saveRanking(false);
  }

  function GameClear() {
    gameOver = true;
    alert(`게임클리어~! 축하드립니다~`);
    clearInterval(timerInterval);
    saveRanking(true);
  }

  function saveRanking(isCleared) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && isCleared) {
      const elapsedTime = Date.now() - startTime;
      const rankingRef = ref(database, `rankings/${gameId}`);
      push(rankingRef, {
        email: user.email,
        time: elapsedTime,
      });
    }
  }

  function fetchRankings() {
    if (!selectedGameId) return;
    const rankingRef = query(
      ref(database, `rankings/${selectedGameId}`),
      orderByChild("time")
    );
    onValue(rankingRef, (snapshot) => {
      rankings = [];
      snapshot.forEach((childSnapshot) => {
        rankings.push(childSnapshot.val());
      });
      rankings = rankings.slice(0, 10); // 상위 10명만 표시
    });
  }

  async function generateRandomGrid(rows, cols) {
    grid = Array.from({ length: rows }, () => Array(cols).fill(""));

    for (const word of wordList) {
      let placed = false;

      for (let attempt = 0; attempt < 100 && !placed; attempt++) {
        const direction = Math.floor(Math.random() * 3);
        let startRow, startCol;

        if (direction === 0) {
          // 수평 배치
          startRow = Math.floor(Math.random() * rows);
          startCol = Math.floor(Math.random() * (cols - word.length + 1));
          if (await canPlaceWord(word, startRow, startCol, 0, 1)) {
            for (let i = 0; i < word.length; i++) {
              grid[startRow][startCol + i] = word[i];
            }
            placed = true;
          }
        } else if (direction === 1) {
          // 수직 배치
          startRow = Math.floor(Math.random() * (rows - word.length + 1));
          startCol = Math.floor(Math.random() * cols);
          if (await canPlaceWord(word, startRow, startCol, 1, 0)) {
            for (let i = 0; i < word.length; i++) {
              grid[startRow + i][startCol] = word[i];
            }
            placed = true;
          }
        } else {
          // 대각선 배치
          startRow = Math.floor(Math.random() * (rows - word.length + 1));
          startCol = Math.floor(Math.random() * (cols - word.length + 1));
          if (await canPlaceWord(word, startRow, startCol, 1, 1)) {
            for (let i = 0; i < word.length; i++) {
              grid[startRow + i][startCol + i] = word[i];
            }
            placed = true;
          }
        }
      }

      if (!placed) {
        console.warn(`단어를 배치할 공간이 부족합니다: ${word}`);
        wordList = wordList.filter((w) => w !== word); // 배치되지 않은 단어를 리스트에서 제거
      }
    }

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        if (grid[rowIndex][colIndex] === "") {
          grid[rowIndex][colIndex] = letters.charAt(
            Math.floor(Math.random() * letters.length)
          );
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
    }
  }

  async function canPlaceWord(word, row, col, rowIncrement, colIncrement) {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * rowIncrement;
      const newCol = col + i * colIncrement;

      if (
        newRow >= grid.length ||
        newCol >= grid[0].length ||
        grid[newRow][newCol] !== ""
      ) {
        return false;
      }
    }
    return true;
  }

  async function loadGameData() {
    if (!selectedGameId) return;
    const gameRef = ref(database, `games/${selectedGameId}`);
    onValue(
      gameRef,
      async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          gameId = selectedGameId;
          title = data.title || "No title";
          description = data.description || "No description.";
          wordList = data.words || [];
          await generateRandomGrid(10, 10);
          fetchRankings();
        }
      },
      (error) => {
        console.error("데이터 가져오기 오류:", error);
      }
    );
  }

  function fetchGameTitles() {
    const gamesRef = ref(database, "games");
    onValue(gamesRef, (snapshot) => {
      const games = snapshot.val();
      gameTitles = [];
      for (const id in games) {
        if (games.hasOwnProperty(id)) {
          gameTitles.push({ id, title: games[id].title });
        }
      }
    });
  }

  onMount(() => {
    fetchGameTitles();
  });

  function handleGameSelection(event) {
    selectedGameId = event.target.value;
  }

  function handleStartGame() {
    if (selectedGameId) {
      loadGameData();
      startTimer();
    } else {
      alert("게임을 선택하세요!");
    }
  }

  function handleCellClick(row, col) {
    if (!gameOver) {
      const cellIndex = selectedCells.findIndex(
        (cell) => cell.row === row && cell.col === col
      );

      if (cellIndex !== -1) {
        selectedCells.splice(cellIndex, 1); // 이미 선택된 셀이면 선택 취소
      } else {
        selectedCells.push({ row, col });
      }

      checkWord();
    }
  }

  function checkWord() {
    const selectedWord = selectedCells
      .map((cell) => grid[cell.row][cell.col])
      .join("");
    if (wordList.includes(selectedWord)) {
      foundWords.push(selectedWord);
      wordList = wordList.filter((word) => word !== selectedWord);
      score += 1;
      selectedCells = []; // 맞춘 단어는 선택 초기화
    }

    if (wordList.length === 0) {
      GameClear();
    }
  }
</script>

<Header location="game" />

<main>
  <div class="game-selection">
    <label for="game-select">Select a Game:</label>
    <select id="game-select" on:change={handleGameSelection}>
      <option value="" disabled selected>Select a game</option>
      {#each gameTitles as game}
        <option value={game.id}>{game.title}</option>
      {/each}
    </select>
    <button class="game-start-btn" on:click={handleStartGame}>게임 시작</button>
  </div>

  <div class="game-info">
    <div class="game-title">Title: {title}</div>
    <div class="game-description">
      <div class="game-description__label">Description:</div>
      <div class="game-description__info">
        {description}
      </div>
    </div>
    <div class="timer">
      Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60)
        .toString()
        .padStart(2, "0")}
    </div>
    <div class="score">Score: {score}</div>
  </div>

  <div class="game-container">
    <div class="game-grid" role="grid" tabindex="0">
      {#each grid as row, rowIndex}
        <div class="grid-row">
          {#each row as cell, colIndex}
            <div
              class="grid-cell"
              on:click={() => handleCellClick(rowIndex, colIndex)}
              on:keydown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  handleCellClick(rowIndex, colIndex);
                }
              }}
              role="button"
              tabindex="0"
              class:selected={selectedCells.some(
                (selected) =>
                  selected.row === rowIndex && selected.col === colIndex
              )}
            >
              {cell}
            </div>
          {/each}
        </div>
      {/each}
    </div>
    <div>
      <div class="word-list">
        <h3>Words List :</h3>
        <ul>
          {#each wordList as word}
            <li class:found={foundWords.includes(word)}>{word}</li>
          {/each}
        </ul>
      </div>
    </div>
    <div class="rankings">
      <h3>Top 10 Rankings</h3>
      <ul>
        {#each rankings as rank}
          <li>{rank.email}: {Math.floor(rank.time / 1000)}초</li>
        {/each}
      </ul>
    </div>
  </div>
</main>

<style>
  main {
    padding: 2rem;
    font-family: Arial, sans-serif;
    background-color: #f8f8f8;
    max-width: 1000px;
    margin: 0 auto;
  }
</style>
