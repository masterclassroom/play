import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
const coinsCount = document.getElementById("coinsCount").innerText;


let userCoins = 0;

// Check User Auth State
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    showMessage("You must be logged in to access this page.", "error");
    setTimeout(() => {
      window.location.href = "login.html"; 
    }, 2000);
    return;
  }

  // Retrieve user coins
  const coinsRef = ref(database, `users/${user.uid}/coins`);
  const snapshot = await get(coinsRef);
  if (snapshot.exists()) {
    userCoins = snapshot.val();
    coinsCount.textContent = userCoins;
  } else {
    userCoins = 0;
    coinsCount.textContent = "0";
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

  if (newUsername.length > 25) {
    showMessage("Invalid username. Must be 25 characters or less.", "error");
    return;
  }

  if (userCoins < 10) {
    showMessage("Not enough coins! You need 10 coins to change your username.", "error");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    showMessage("You must be logged in to update your username.", "error");
    return;
  }

  try {
    const userRef = ref(database, `users/${user.uid}/username`);
    const coinsRef = ref(database, `users/${user.uid}/coins`);

    // Update Username
    await set(userRef, newUsername);

    // Deduct 10 coins
    await update(coinsRef, userCoins - 10);
    coinsCount.innerText = userCoins - 10;
    
    showMessage("Your username has been updated successfully!", "success");
    setTimeout(() => {
      window.location.replace("Academy.html");
    }, 3000);
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
  }, 5000);
    }
