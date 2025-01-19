import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
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
const showPasswordChangeButton = document.getElementById("showPasswordChange");
const passwordChangeSection = document.getElementById("passwordChangeSection");
const oldPasswordInput = document.getElementById("oldPassword");
const newPasswordInput = document.getElementById("newPassword");
const updatePasswordButton = document.getElementById("updatePasswordButton");

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

// Show Password Change Section
showPasswordChangeButton.addEventListener("click", () => {
  passwordChangeSection.style.display = "block";
});

// Update Password
updatePasswordButton.addEventListener("click", async () => {
  const oldPassword = oldPasswordInput.value.trim();
  const newPassword = newPasswordInput.value.trim();
  
  if (!oldPassword || !newPassword) {
    Swal.fire("Error", "Please fill in both fields.", "error");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    Swal.fire("Error", "You must be logged in to update your password.", "error");
    return;
  }

  try {
    // Step 1: Reauthenticate the user with old password
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    await reauthenticateWithCredential(user, credential);

    // Step 2: Update Password in Firebase Authentication
    await updatePassword(user, newPassword); // Update password in Firebase Authentication

    // Step 3: Update Password in Real-Time Database
    const userRef = ref(database, `users/${user.uid}/password`);
    await set(userRef, newPassword);

    // Show success message after updating the password
    Swal.fire(
      "Password Updated Successfully",
      "Your password has been updated successfully.",
      "success"
    );
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
});

 if(!sessionStorage.getItem("siitar")) {
   Swal.fire('Warning', '', 'warning');
   setTimeout(() => {
     window.location.href = "Coins.html";
   }, 2000);
                            
