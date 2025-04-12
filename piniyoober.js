import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
const showPasswordChangeButton = document.getElementById("showPasswordChange");
const passwordChangeSection = document.getElementById("passwordChangeSection");
const oldPasswordInput = document.getElementById("oldPassword");
const newPasswordInput = document.getElementById("newPassword");
const updatePasswordButton = document.getElementById("updatePasswordButton");
const coinsBalanceText = document.getElementById("coinsBalance");

// Function to show messages
function showMessage(text, isSuccess) {
  Swal.fire({
    title: isSuccess ? "Success" : "Error",
    text: text,
    icon: isSuccess ? "success" : "error",
    timer: 3000,
    showConfirmButton: true
  });
}

// Check User Auth State
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Get user coins balance
    const userRef = ref(database, `users/${user.uid}/coins`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      coinsBalanceText.textContent = snapshot.val();
    } else {
      coinsBalanceText.textContent = "0";
    }
  } else {
    setTimeout(() => {
      Swal.fire({
        title: "Not Logged In",
        text: "You must be logged in to access this page.",
        icon: "warning",
        confirmButtonText: "Go to Login"
      }).then(() => {
        window.location.href = "login.html";
      });
    }, 1000);
  }
});

// Show Password Change Section
showPasswordChangeButton.addEventListener("click", () => {
  passwordChangeSection.style.display = "block";
});

// Update Pincode
updatePasswordButton.addEventListener("click", async () => {
  const oldPassword = oldPasswordInput.value.trim();
  const Newpin = newPasswordInput.value.trim();
  
  if (!oldPassword || !Newpin) {
    showMessage("Please fill in both fields.", false);
    return;
  }
  if (Newpin.length !== 4) {
    showMessage("Please choose a 4-digit code.", false);
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    showMessage("You must be logged in to update your Pincode.", false);
    return;
  }

  try {
    // Reauthenticate user
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    await reauthenticateWithCredential(user, credential);

    // Get user coins balance
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      showMessage("User data not found!", false);
      return;
    }

    const userData = snapshot.val();
    const userCoins = userData.coins || 0;

    if (userCoins < 1) {
      showMessage("Not enough coins you need 1 coins to change pincode!", false);
      return;
    }

    await set(ref(database, `users/${user.uid}/Pin`), Newpin);
    await set(ref(database, `users/${user.uid}/coins`), userCoins - 1);

    coinsBalanceText.textContent = userCoins - 1;

    showMessage("Your Pincode has been updated successfully!", true);

    setTimeout(() => {
      window.location.replace("dashboard.html");
    }, 2500);
  } catch (error) {
    showMessage("Incorrect password or an error occurred.", false);
  }
});
