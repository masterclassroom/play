import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAj0xbIZhcmWiSf3nYVgIIgTZ_KJ64mTE",
  authDomain: "exam-81b90.firebaseapp.com",
  databaseURL: "https://exam-81b90-default-rtdb.firebaseio.com",
  projectId: "exam-81b90",
  storageBucket: "exam-81b90.appspot.com",
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
  const errorMessage = document.getElementById('error-message');
  const succesMessage = document.getElementById('succes-message');

  // Clear previous error messages
  errorMessage.style.display = 'none';
  errorMessage.innerText = '';
  
  succesMessage.style.display = 'none';
  succesMessage.innerText = '';

  // Email format validation
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(email)) {
    errorMessage.style.display = 'block';
    errorMessage.innerText = 'Please enter a valid email address.';
    return;
  }

  if (!password) {
    errorMessage.style.display = 'block';
    errorMessage.innerText = 'Please enter your password.';
    return;
  }

  // Password length validation
  if (password.length < 6) {
    errorMessage.style.display = 'block';
    errorMessage.innerText = 'Password must be at least 6 characters long.';
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      await sendEmailVerification(user);
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'Please verify your email before logging in.';
      return;
    }

    const dbRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();

      if (userData.isDisabled) {
        errorMessage.style.display = 'block';
        errorMessage.innerText = 'This account has been disabled. Please contact support.';
        return;
      }

      // Check if another user is already logged in
      const loggedInRef = ref(database, `users/${user.uid}/isLoggedIn`);
      const loggedInSnapshot = await get(loggedInRef);

      if (loggedInSnapshot.exists() && loggedInSnapshot.val() === true) {
        errorMessage.style.display = 'block';
        errorMessage.innerText = 'Another user is using this account.';
        return;
      }

      // Set the user as logged in
      await set(ref(database, `users/${user.uid}/isLoggedIn`), true);
      // Update the user's password in the database
      await update(dbRef, {
        password: password // Update the password here
      });

      setTimeout(() => {
        window.location.href = "Academy.html";
      }, 1000);
    } else {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'No account found with this email.';
    }
  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'No account found with this email.';
    } else {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'Invalid email or password please try again.';
    }
  }
});
