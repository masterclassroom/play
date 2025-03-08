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

// Function to get current date as YYYY-MM
function getCurrentMonth() {
  return new Date().toISOString().substring(0, 7); // Example: "2025-03"
}

// Handle Login
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');
  const succesMessage = document.getElementById('succes-message');

  // Clear previous messages
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

  if (password.length < 6) {
    errorMessage.style.display = 'block';
    errorMessage.innerText = 'Password must be at least 6 characters long.';
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'Please verify your email.';
      return;
    }

    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);

    const currentMonth = getCurrentMonth();
    let loginAttempts = 10;

    if (snapshot.exists()) {
      const userData = snapshot.val();

      if (userData.isDisabled) {
        errorMessage.style.display = 'block';
        errorMessage.innerText = 'This account has been disabled. Please contact support.';
        return;
      }

      if (userData.lastLoginMonth && userData.lastLoginMonth === currentMonth) {
        loginAttempts = userData.loginAttempts ?? 10;
      } else {
        loginAttempts = 10; // Reset login attempts for the new month
      }

      if (loginAttempts <= 0) {
        errorMessage.style.display = 'block';
        errorMessage.innerText = 'You have reached your login limit for this month. Please wait for the next month.';
        return;
      }

      loginAttempts--; // Decrease attempts
      await update(userRef, {
        loginAttempts: loginAttempts,
        lastLoginMonth: currentMonth,
        isLoggedIn: true
      });

      alert(`Login Successful! You have ${loginAttempts} logins left this month.`);
      setTimeout(() => {
        window.location.href = "Pincode.html";
      }, 1000);
    } else {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'No account found with this email.';
    }
  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'This account has been blocked.';
    } else {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'Invalid email or password. Please try again.';
    }
  }
});
