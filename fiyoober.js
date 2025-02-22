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

// Function to generate a random captcha code
function generateCaptcha() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let captchaCode = '';
  for (let i = 0; i < 9; i++) {
    captchaCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  document.getElementById('captchaCode').textContent = captchaCode;
  return captchaCode;
}

// Show alert message
function showAlert(message, type) {
  const alertBox = document.getElementById('alertBox');
  alertBox.style.display = 'block';
  alertBox.className = type; // 'error' or 'success'
  alertBox.textContent = message;

  setTimeout(() => {
    alertBox.style.display = 'none';
    alertBox.className = ''; // Clear classes
  }, 3000);
}

// Generate captcha when the page loads
let captchaCode = generateCaptcha();

// Handle Forgot Password
document.getElementById('forgotPasswordBtn').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('reset').value;
  const captchaInput = document.getElementById('captchaInput').value;

  // Check if email or captcha input is empty
  if (!email) {
    showAlert('Please enter your email to reset your password.', 'error');
    return;
  }

  if (captchaInput !== captchaCode) {
    showAlert('Captcha code is incorrect.', 'error');
    captchaCode = generateCaptcha(); // Regenerate captcha if it's wrong
    return;
  }

  try {
    // Send password reset email directly without checking snapshot
    await sendPasswordResetEmail(auth, email);
    showAlert('Successfully sent, check your email to reset your password.', 'success');
  captchaCode = generateCaptcha();
  } catch (error) {
    showAlert(error.message, 'error');
  }
});
