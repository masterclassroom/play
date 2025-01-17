// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase Config
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

// DOM Elements
const coinCountDiv = document.getElementById("coinCount");
const claimButton = document.getElementById("claimButton");
const withdrawButton = document.getElementById("withdrawButton");
const logoutButton = document.getElementById("logoutButton");

// Global Variables
let userId = null;
let userCoins = 10;

// Auth State Listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;
    await loadCoins();
  } else {
    window.location.href = "login.html"; // Redirect to login if not authenticated
  }
});

// Load Coins from Firebase
async function loadCoins() {
  const coinsRef = ref(database, `users/${userId}/coins`);
  const snapshot = await get(coinsRef);

  if (snapshot.exists()) {
    userCoins = snapshot.val();
  } else {
    userCoins = 0;
    await set(coinsRef, userCoins); // Initialize coins if not set
  }

  updateCoinDisplay();
}

// Update Coin Display
function updateCoinDisplay() {
  coinCountDiv.textContent = `Coins: ${userCoins}`;
}

// Claim Coins
claimButton.addEventListener("click", async () => {
  userCoins += 1;
  const coinsRef = ref(database, `users/${userId}/coins`);
  await set(coinsRef, userCoins); 
  updateCoinDisplay();
  Swal.fire("Successfully!", "You claimed 1 coins!", "success");
});

// Withdraw Coins
withdrawButton.addEventListener("click", () => {
  Swal.fire("Feature Coming Soon", "The withdraw feature is under development.", "info");
});

// Logout
logoutButton.addEventListener("click", async () => {
  await signOut(auth);
  localStorage.removeItem("loggedinn");
  Swal.fire("Logged Out", "You have been logged out successfully.", "success");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
});

if(!localStorage.getItem("loggedinn")) {
  alert("please log in");
  window.location.replace("login.html");
}
