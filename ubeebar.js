import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase Config
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

// DOM Elements
const showUsernameChangeButton = document.getElementById("showUsernameChange");
const usernameChangeSection = document.getElementById("usernameChangeSection");
const newUsernameInput = document.getElementById("newUsername");
const updateUsernameButton = document.getElementById("updateUsernameButton");

// Check User Auth State
onAuthStateChanged(auth, (user) => {
  if (!user) {
    Swal.fire(
      "Not Logged In",
      "You must be logged in to access this page. Redirecting to login...",
      "warning"
    );
    setTimeout(() => {
      window.location.href = "login.html"; // Replace with your login page
    }, 2000);
  }
});

// Show Username Change Section
showUsernameChangeButton.addEventListener("click", () => {
  usernameChangeSection.style.display = "block";
});

// Update Username
updateUsernameButton.addEventListener("click", async () => {
  const newUsername = newUsernameInput.value.trim();
  
  if (!newUsername) {
    Swal.fire("Error", "Please enter a new username.", "error");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    Swal.fire("Error", "You must be logged in to update your username.", "error");
    return;
  }
  if(newUsername.length>14) {
    Swal.fire('Error', 'Invalid username', 'error');
  }

  try {
    // Step 1: Update Username in Real-Time Database
    const userRef = ref(database, `users/${user.uid}/username`);
    await set(userRef, newUsername);

    // Step 2: Show success message after updating the username
    Swal.fire(
      "Username Updated Successfully",
      "Your username has been updated successfully.",
      "success"
    );
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
});
