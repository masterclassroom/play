import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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

// Function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex to check valid email format
  return emailRegex.test(email);
}

// Handle Sign Up
document.getElementById('signUpBtn').addEventListener('click', async () => {
  const username = document.getElementById("username").value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    // Validate email format
    if (!isValidEmail(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
      });
      return;
    }

    // Check if password length is at least 6 characters
    if (password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long.',
      });
      return;
    }

    // Check if email is already registered in the Realtime Database
    const emailRef = ref(database, `users/`);
    const snapshot = await get(emailRef);

    let emailExists = false;
    snapshot.forEach((childSnapshot) => {
      if (childSnapshot.val().email === email) {
        emailExists = true;
      }
    });

    if (emailExists) {
      Swal.fire({
        icon: 'error',
        title: 'Email Already Registered',
        text: 'This email is already registered.',
      });
      return;
    }

    // Create User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data to Realtime Database
    const userRef = ref(database, `users/${user.uid}`);
    await set(userRef, {
      username: username,
      email: email,
      password: password
    });

    // Send Email Verification
    await sendEmailVerification(user);

    Swal.fire({
      icon: 'success',
      title: 'Account Created!',
      text: 'Please check your email for verification.',
    });

  } catch (error) {
    // Handle errors
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message,
    });
  }
});
