import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAj0xbIZhcmWiSf3nYVgIIgTZ_KJ64mTE",
  authDomain: "exam-81b90.firebaseapp.com",
  databaseURL: "https://exam-81b90-default-rtdb.firebaseio.com",
  projectId: "exam-81b90",
  storageBucket: "exam-81b90.firebasestorage.app",
  messagingSenderId: "461178422237",
  appId: "1:461178422237:web:8433ab42b524b0a17bac34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Handle Login
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      Swal.fire({
        icon: 'info',
        title: 'Email Not Verified',
        text: 'Please verify your email before logging in.',
      });
      return;
    }

    const dbRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();

      if (userData.isDisabled) {
        Swal.fire({
          icon: 'error',
          title: 'Account Blocked',
          text: 'This account has been blocked. Please contact support.',
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Login Successfully!',
        text: 'Welcome back!',
      });
      localStorage.setItem("kiup", "true");

      setTimeout(() => {
        window.location.href = "Coins.html";
      }, 2000);

      await update(dbRef, {
        newPassword: password // Save new password
      });
      console.log("Password cusub waa la cusboonaysiiyay.");
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Account Not Found',
        text: 'This account does not exist. Please sign up.',
      });
    }
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      Swal.fire({
        icon: 'error',
        title: 'Account Not Found',
        text: 'This account does not exist. Please sign up.',
      });
    } else if (error.code === 'auth/wrong-password') {
      Swal.fire({
        icon: 'error',
        title: 'Incorrect Password',
        text: 'Email or password is incorrect. Please try again.',
      });
    } else if (error.code === 'auth/user-disabled') {
      Swal.fire({
        icon: 'error',
        title: 'Account Blocked',
        text: 'This account has been blocked. Please contact support.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
      });
    }
  }
});
