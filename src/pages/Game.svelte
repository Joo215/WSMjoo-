<script>
  import Header from "../components/Header.svelte";
  import { onMount } from "svelte";
  import { initializeApp } from "firebase/app";
  import { getDatabase, ref, onValue } from "firebase/database";
  import { getAuth } from "firebase/auth";

  // Firebase 초기화 설정
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

  // Firebase 초기화
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth();

  let title = "";
  let description = "";
  let wordList = [];
  let grid = [];
  let gameId = null;
  let gameTitles = []; // 모든 게임 타이틀 저장

  // 격자판 생성 함수
  function generateRandomGrid(rows, cols) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () =>
        letters.charAt(Math.floor(Math.random() * letters.length))
      )
    );
  }

  // 게임 타이틀 목록 불러오기
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

  // 선택된 게임 데이터를 불러오기
  function loadGameData(selectedGameId) {
    const gameRef = ref(database, `games/${selectedGameId}`);
    onValue(
      gameRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          gameId = selectedGameId;
          title = data.title || "제목 없음";
          description = data.description || "설명이 없습니다.";
          wordList = data.words || [];
          generateRandomGrid(10, 10);
        }
      },
      (error) => {
        console.error("데이터 가져오기 오류:", error);
      }
    );
  }

  onMount(() => {
    fetchGameTitles(); // 컴포넌트 마운트 시 게임 타이틀 목록을 불러옴
  });

  function handleGameSelection(event) {
    const selectedGameId = event.target.value; // JavaScript에서는 그냥 이렇게 접근하면 됩니다.
    loadGameData(selectedGameId);
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
  </div>

  {#if title}
    <div class="game-title">Title: {title}</div>
    <div class="game-description">
      <div class="game-description__label">Description:</div>
      <div class="game-description__info">
        {description}
      </div>
    </div>

    <div class="game-container">
      <div class="game-grid">
        {#each grid as row, rowIndex}
          <div class="grid-row">
            {#each row as cell, colIndex}
              <div class="grid-cell">{cell}</div>
            {/each}
          </div>
        {/each}
      </div>

      <div class="word-list">
        <h3>Word List</h3>
        <ul>
          {#each wordList as word}
            <li>{word}</li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
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
