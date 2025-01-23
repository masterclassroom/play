// siyoober.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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

// Helper function to show error messages

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Handle Sign Up
document.getElementById('signUpBtn').addEventListener('click', async () => {
  const username = document.getElementById("username").value;
  const email = document.getElementById('email').value;
  const number = document.getElementById("number").value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');
  const succesMessage = document.getElementById('succes-message');

  // Clear previous error messages
  errorMessage.style.display = 'none';
  errorMessage.innerText = '';
  
  succesMessage.style.display = 'none';
  succesMessage.innerText = '';

  try {
    // Clear any previous errors

    // Validate inputs
    if (!username) {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'Username is required';
      return;
    }

    if (!isValidEmail(email)) {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'Invaild email adress';
      return;
    }

    if (!number ||number .length<10) {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'Phone number is required';
      return;
    }

    if (password.length < 8) {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'Password must be at least 6 characters long.';
      return;
    }

    // Check if email or phone number is already registered
    const emailRef = ref(database, `users/`);
    const snapshot = await get(emailRef);

    let emailExists = false;
    let numberExists = false;

    snapshot.forEach((childSnapshot) => {
      if (childSnapshot.val().email === email) {
        emailExists = true;
      }
      if (childSnapshot.val().number === number) {
        numberExists = true;
      }
    });

    if (emailExists) {
      errorMessage.style.display = 'block';
      errorMessage.innerText = 'Email already registered';
      return;
    }

    if (numberExists) {
     errorMessage.style.display = 'block';
      errorMessage.innerText = 'Phone number already registered';
      return;
    }

    // Create User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get current date and time
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Save user data to Realtime Database
    const userRef = ref(database, `users/${user.uid}`);
    await set(userRef, {
      username: username,
      email: email,
      number: number,
      password: password,
      signUpDate: formattedDate,
    });

    // Send Email Verification
    await sendEmailVerification(user);

    // Redirect to login page
    succesMessage.style.display = 'block';
      succesMessage.innerText = 'Account greated succesfully';
    setTimeout(() => {
    window.location.href = "login.html";
    },2500);

  } catch (error) {
    // Handle errors
    showError(error.message);
  }
});
