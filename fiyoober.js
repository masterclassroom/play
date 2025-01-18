import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
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

// Handle Forgot Password
document.getElementById('forgotPasswordBtn').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('reset').value;

  if (!email) {
    Swal.fire({
      icon: 'error',
      title: 'Warning',
      text: 'Please enter your email to reset your password.',
    });
    return;
  }

  try {
    // Check if the email exists in the database
    const dbRef = ref(database, 'users');
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const users = snapshot.val();
      const emailExists = Object.values(users).some(user => user.email === email);

      if (!emailExists) {
        Swal.fire({
          icon: 'error',
          title: 'warning',
          text: 'Email not registered please register.',
        });
        return;
      }

      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        icon: 'success',
        title: 'Successfully!',
        text: 'Check your email to reset your password.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'No Users Found',
        text: 'Database is empty. Please sign up.',
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message,
    });
  }
});

// Listen for Authentication Changes and Update Database
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const dbRef = ref(database, `users/${user.uid}`);
    await update(dbRef, {
      newPassword: "waiting....", // Ensure password is updated with a new one if required
    });
    console.log("Password cusub waa la cusboonaysiiyay.");
  }
});
