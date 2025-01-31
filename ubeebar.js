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
const messageBox = document.getElementById("message");

// Check User Auth State
onAuthStateChanged(auth, (user) => {
  if (!user) {
    showMessage("You must be logged in to access this page. Redirecting to login...", "error");
    setTimeout(() => {
      window.location.href = "login.html"; 
    }, 2000);
  }
});

// Show Username Change Section
showUsernameChangeButton.addEventListener("click", () => {
  usernameChangeSection.classList.remove("hidden");
});

// Update Username
updateUsernameButton.addEventListener("click", async () => {
  const newUsername = newUsernameInput.value.trim();
  
  if (!newUsername) {
    showMessage("Please enter a new username.", "error");
    return;
  }

  if (newUsername.length > 14) {
    showMessage("Invalid username. Must be 14 characters or less.", "error");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    showMessage("You must be logged in to update your username.", "error");
    return;
  }

  try {
    const userRef = ref(database, `users/${user.uid}/username`);
    await set(userRef, newUsername);
    showMessage("Your username has been updated successfully.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
});

// Show Message Function
function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = type;
  messageBox.classList.remove("hidden");

  setTimeout(() => {
    messageBox.classList.add("hidden");
  }, 3000);
                }
