import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSy...",
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
  const successMessage = document.getElementById('success-message');

  // Clear any previous messages
  errorMessage.style.display = 'none';
  successMessage.style.display = 'none';

  // Basic validation
  if (!email || !password) {
    errorMessage.style.display = 'block';
    errorMessage.innerText = 'Email and password are required.';
    return;
  }

  // Email format validation
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(email)) {
    errorMessage.style.display = 'block';
    errorMessage.innerText = 'Please enter a valid email address.';
    return;
  }

  // Password length validation
  if (password.length < 6) {
    errorMessage.style.display = 'block';
    errorMessage.innerText = 'Password must be at least 6 characters long.';
    return;
  }

  try {
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if email is verified
    if (!user.emailVerified) {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'Please verify your email before logging in.';
      return;
    }

    // Get user data from the database
    const dbRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();

      // Check if account is disabled
      if (userData.isDisabled) {
        errorMessage.style.display = 'block';
        errorMessage.innerText = 'This account has been disabled. Contact support.';
        return;
      }

      // Show success message
      successMessage.style.display = 'block';
      successMessage.innerText = 'Login successfully! Welcome back to your account.';

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "Academy.html";
      }, 2000);

      // Update password in the database (optional)
      await update(dbRef, { password: password });
    } else {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'No account found with this email.';
    }
  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'Incorrect password.';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'No account found with this email.';
    } else {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'An error occurred. Please try again.';
    }
  }
});
