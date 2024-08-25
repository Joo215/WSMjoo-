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
let foundWords = [];
let selectedCells = [];
let score = 0;
let timeLeft = 300; // 5분 = 300초
let gameOver = false;
let gameId = null;
let gameTitles = []; // 모든 게임 타이틀 저장

// 격자판 생성 함수
export function generateRandomGrid(rows, cols) {
  // 격자 초기화
  grid = Array.from({ length: rows }, () => Array(cols).fill(""));

  // 단어를 그리드에 배치
  wordList.forEach((word) => {
    let placed = false;

    while (!placed) {
      // 무작위로 방향 선택 (0: 수평, 1: 수직, 2: 대각선)
      const direction = Math.floor(Math.random() * 3);
      let startRow, startCol;

      if (direction === 0) {
        // 수평 배치
        startRow = Math.floor(Math.random() * rows);
        startCol = Math.floor(Math.random() * (cols - word.length + 1));
        if (canPlaceWord(word, startRow, startCol, 0, 1)) {
          for (let i = 0; i < word.length; i++) {
            grid[startRow][startCol + i] = word[i];
          }
          placed = true;
        }
      } else if (direction === 1) {
        // 수직 배치
        startRow = Math.floor(Math.random() * (rows - word.length + 1));
        startCol = Math.floor(Math.random() * cols);
        if (canPlaceWord(word, startRow, startCol, 1, 0)) {
          for (let i = 0; i < word.length; i++) {
            grid[startRow + i][startCol] = word[i];
          }
          placed = true;
        }
      } else {
        // 대각선 배치
        startRow = Math.floor(Math.random() * (rows - word.length + 1));
        startCol = Math.floor(Math.random() * (cols - word.length + 1));
        if (canPlaceWord(word, startRow, startCol, 1, 1)) {
          for (let i = 0; i < word.length; i++) {
            grid[startRow + i][startCol + i] = word[i];
          }
          placed = true;
        }
      }
    }
  });

  // 남은 빈 칸을 무작위 문자로 채우기
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === "") {
        grid[rowIndex][colIndex] = letters.charAt(
          Math.floor(Math.random() * letters.length)
        );
      }
    });
  });
}

// 단어를 배치할 수 있는지 확인하는 함수
export function canPlaceWord(word, row, col, rowIncrement, colIncrement) {
  for (let i = 0; i < word.length; i++) {
    if (grid[row + i * rowIncrement][col + i * colIncrement] !== "") {
      return false;
    }
  }
  return true;
}

// 게임 타이틀 목록 불러오기
export function fetchGameTitles() {
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
export function loadGameData(selectedGameId) {
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
        startTimer();
      }
    },
    (error) => {
      console.error("데이터 가져오기 오류:", error);
    }
  );
}

export function startTimer() {
  const timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft -= 1;
    } else {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

export function endGame() {
  gameOver = true;
  alert(`Game Over! Your score: ${score}`);
}

export function checkWord() {
  const selectedWord = selectedCells
    .map((cell) => grid[cell.row][cell.col])
    .join("");
  if (wordList.includes(selectedWord)) {
    foundWords.push(selectedWord);
    wordList = wordList.filter((word) => word !== selectedWord);
    score += 1;
  } else {
    selectedCells.forEach((cell) => (cell.wrong = true));
    setTimeout(
      () => selectedCells.forEach((cell) => (cell.wrong = false)),
      500
    );
  }
  selectedCells = [];
  if (wordList.length === 0) {
    endGame();
  }
}

export function handleCellMouseDown(row, col) {
  if (!gameOver) {
    selectedCells = [{ row, col }];
  }
}

export function handleCellMouseEnter(row, col) {
  if (selectedCells.length) {
    selectedCells.push({ row, col });
  }
}

export function handleCellMouseUp() {
  if (selectedCells.length) {
    checkWord();
  }
}

export function handleGameSelection(event) {
  const selectedGameId = event.target.value; // JavaScript에서는 그냥 이렇게 접근하면 됩니다.
  loadGameData(selectedGameId);
}
