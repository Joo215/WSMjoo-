<script>
  import Header from "../components/Header.svelte";
  import { initializeApp } from "firebase/app";
  import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

  const firebaseConfig = {

  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  let email = "";
  let password = "";
  let infoMessage = "";

  // 유저 로그인
  const handleLogin = async () => {
    try {
      // 이메일과 패스워드로 로그인하기
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 토큰 가져오기
      const token = await user.getIdToken();
      console.log("Login successful! Token:", token);

      infoMessage = `로그인 성공~ 홈화면으로 돌아가주세요~, ${user.email}`;

      // window.location.hash를 사용하여 메인 화면으로 이동
      window.location.hash = "/";
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      infoMessage = `Login error: ${errorMessage}`;
      console.error("Error during login:", errorCode, errorMessage);
    }
  };
</script>

<Header location="login" />

<main>
  <div class="login-title">로그인</div>

  <form class="login" id="login-form" on:submit|preventDefault={handleLogin}>
    <div class="input-text">
      <label class="login-label" for="login-email">이메일</label>
      <input
        type="email"
        id="login-email"
        name="login-email"
        bind:value={email}
        required
      />
    </div>
    <div class="input-text">
      <label class="login-label" for="login-password">패스워드</label>
      <input
        type="password"
        id="login-password"
        name="login-password"
        bind:value={password}
        required
      />
    </div>

    <div class="input-text">
      <button class="loginsubmit-btn" type="submit">로그인하기</button>
    </div>

    <div id="info">{infoMessage}</div>
  </form>
</main>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>
