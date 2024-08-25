<script>
  import Header from "../components/Header.svelte";
  import { getDatabase, ref, set } from "firebase/database";
  import { getAuth, onAuthStateChanged } from "firebase/auth";

  let title = "";
  let description = "";
  let words = Array(30).fill("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const gameId = `${user.uid}_${Date.now()}`; // 게임 ID 생성 (유저ID_타임스탬프)
      const db = getDatabase();
      const gameRef = ref(db, `games/${gameId}`);

      try {
        await set(gameRef, {
          title: title,
          description: description,
          words: words
            .filter((word) => word.trim() !== "") // 빈 단어 제외
            .map((word) => word.toUpperCase()), // 대문자로 변환
          createdBy: user.uid,
          createdAt: Date.now(),
        });
        alert("게임이 성공적으로 저장되었습니다!");
        window.location.hash = "/"; // 저장 후 메인 화면으로 이동
      } catch (error) {
        console.error("Error saving game:", error);
        alert("게임을 저장하는 중 오류가 발생했습니다.");
      }
    } else {
      alert("로그인이 필요합니다.");
    }
  };
</script>

<Header location="maker" />

<main>
  <form id="maker-form" on:submit={handleFormSubmit}>
    <div class="maker-box">
      <h1>게임 만들기</h1>
      <!-- 제목 -->
      <div class="maker-box__info">
        <div>
          <label for="title">Title</label>
          <input type="text" id="title" bind:value={title} required />
        </div>
      </div>
      <!-- 설명 -->
      <div class="maker-box__info">
        <div>
          <label for="description">Description</label>
          <input
            type="text"
            id="description"
            bind:value={description}
            required
          />
        </div>
      </div>
      <!-- 단어 입력 -->
      <div>
        <div class="maker-box__info">
          <label for="word-list">Word List</label>
        </div>
        <div style="margin:0;">
          Between 3 and 30 words. Puzzles are randomly generated using a
          selection of your words at play time.
        </div>
      </div>
      <div class="wordlist">
        {#each Array.from({ length: 30 }) as _, i}
          <div id={"wrd" + i} class="word">
            <input type="text" bind:value={words[i]} />
          </div>
        {/each}
      </div>
      <!-- 게임 생성 버튼 -->
      <div>
        <button class="maker-btn" type="submit">게임 만들기</button>
      </div>
    </div>
  </form>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
  }
  .maker-box {
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
  }
</style>
