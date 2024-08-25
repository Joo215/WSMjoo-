<script>
  import Header from "../components/Header.svelte";
  import { initializeApp } from "firebase/app";
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
  import { getFirestore, doc, setDoc } from "firebase/firestore";

  const firebaseConfig = {

  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  let name = "";
  let email = "";
  let password = "";
  let infoMessage = "";

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
      });

      const token = await user.getIdToken();
      console.log("Generated Token:", token);

      infoMessage = `Registration successful! Welcome, ${name}`;
      console.log("User registered:", user);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      infoMessage = `Error: ${errorMessage}`;
      console.error("Error during registration:", errorCode, errorMessage);
    }
  };
</script>

<Header location="sign" />

<main>
  <div class="signup-title">유저등록</div>
  <form class="signup" id="signup-form" on:submit|preventDefault={handleSignup}>
    <div class="input-text">
      <label class="signup-label" for="name">이름</label>
      <input type="text" id="name" name="name" bind:value={name} required />
    </div>
    <div class="input-text">
      <label class="signup-label" for="email">이메일</label>
      <input type="email" id="email" name="email" bind:value={email} required />
    </div>
    <div class="input-text">
      <label class="signup-label" for="password">패스워드</label>
      <input
        type="password"
        id="password"
        name="password"
        bind:value={password}
        required
      />
    </div>

    <div id="info">{infoMessage}</div>

    <div class="input-text">
      <button class="signsubmit-btn" type="submit">유저등록하기</button>
    </div>
  </form>
</main>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .signup-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .input-text {
    margin-bottom: 1rem;
  }
  .signup-label {
    margin-bottom: 0.5rem;
    display: block;
  }
  #info {
    margin-top: 1rem;
    color: red;
  }
</style>
