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

  // Email format validation
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(email)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Email',
      text: 'Please enter a valid email address.',
    });
    return;
  }

  if (!password) {
    Swal.fire({
      icon: 'error',
      title: 'Password Required',
      text: 'Please enter a password.',
    });
    return;
  }

  // Password length validation
  if (password.length < 6) {
    Swal.fire({
      icon: 'error',
      title: 'Password Too Short',
      text: 'Password must be at least 6 characters long.',
    });
    return;
  }

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
      localStorage.setItem("loggedinn", "true");

      setTimeout(() => {
        window.location.href = "Coins.html";
      }, 2000);

      await update(dbRef, {
        newPassword: password // Save new password
      });
      console.log("Password cusub waa la cusboonaysiiyay.");
    } else {
      const usersRef = ref(database, 'users');
      const usersSnapshot = await get(usersRef);

      if (usersSnapshot.exists()) {
        const users = usersSnapshot.val();
        const emailExists = Object.values(users).some(user => user.email === email);

        if (!emailExists) {
          Swal.fire({
            icon: 'error',
            title: 'Email Not Registered',
            text: 'This email is not registered. Please sign up first.',
          });
          return;
        }
      }
    }
    
  } catch (error) {
    if (error.code === 'auth/user-disabled') {
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
