import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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

// Show alert message
function showAlert(message, type) {
  const alertBox = document.getElementById('alertBox');
  alertBox.style.display = 'block';
  alertBox.className = type; // 'error' or 'success'
  alertBox.textContent = message;

  setTimeout(() => {
    alertBox.style.display = 'none';
    alertBox.className = ''; // Clear classes
  }, 5000);
}

// Handle Forgot Password
document.getElementById('forgotPasswordBtn').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('reset').value;

  if (!email) {
    showAlert('Please enter your email to reset your password.', 'error');
    return;
  }

  try {
    const dbRef = ref(database, 'users');
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const users = snapshot.val();
      const emailExists = Object.values(users).some(user => user.email === email);

      if (!emailExists) {
        showAlert('Email not Registered. Please Register.', 'error');
        return;
      }

      await sendPasswordResetEmail(auth, email);
      showAlert('Successfully sent check your email to reset.', 'success');
    } else {
      showAlert('Database is empty. Please sign up.', 'error');
    }
  } catch (error) {
    showAlert(error.message, 'error');
  }
});
