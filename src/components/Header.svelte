<script>
  import { onMount } from "svelte";
  import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

  export let location;

  let isLoggedIn = false;
  let userName = "";

  onMount(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        isLoggedIn = true;
        userName = user.displayName || user.email; // 유저 이름이 없을 경우 이메일 표시
      } else {
        isLoggedIn = false;
        userName = "";
      }
    });
  });

  const handleHome = () => {
    window.location.hash = "/";
  };

  const handleLogin = () => {
    window.location.hash = "/login";
  };

  const handleSign = () => {
    window.location.hash = "/sign";
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      isLoggedIn = false;
      userName = "";
      window.location.hash = "/"; // 로그아웃 후 메인 화면으로 이동
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
</script>

<header>
  <!-- 메인화면으로 이동 & 메인화면일때와 아닐때 아이콘 모양 바뀜 -->
  <button on:click={handleHome} class="home-btn">
    {#if location === "home"}
      <img src="homeB.svg" alt="home-Black" />
      <div>Home</div>
    {:else}
      <img src="homeW.svg" alt="home-White" />
      <div>Home</div>
    {/if}
  </button>

  <div>
    {#if isLoggedIn}
      <!-- 유저가 로그인된 경우 유저 이름 및 로그아웃 버튼 표시 -->
      <div class="user-index">
        <div class="user-info">
          <img src="user.svg" alt="user-icon" />
          <div>{userName}</div>
        </div>
        <div class="logout">
          <button on:click={handleLogout} class="logout-btn">로그아웃</button>
        </div>
      </div>
    {:else}
      <!-- 유저가 로그인되지 않은 경우 로그인 및 회원가입 버튼 표시 -->
      <button on:click={handleLogin} class="login-btn">
        <img src="user.svg" alt="login" />
        <div>로그인</div>
      </button>
      <button on:click={handleSign} class="sign-btn">
        <img src="sign.svg" alt="sign" />
        <div>유저등록</div>
      </button>
    {/if}
  </div>
</header>

<style>
  header {
    justify-content: space-between;
    display: flex;
    align-items: center;
  }
</style>
