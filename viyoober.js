import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBAj0xbIZhcmWiSf3nYVgIIgTZ_KJ64mTE",
  authDomain: "exam-81b90.firebaseapp.com",
  databaseURL: "https://exam-81b90-default-rtdb.firebaseio.com",
  projectId: "exam-81b90",
  storageBucket: "exam-81b90.appspot.com",
  messagingSenderId: "461178422237",
  appId: "1:461178422237:web:8433ab42b524b0a17bac34"
};

// Init
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Elements
const inputs = document.querySelectorAll(".pin-input");
const alertBox = document.getElementById("alertBox");
let currentUser = null;

// Show message
function showAlert(message, type) {
  alertBox.style.display = "block";
  alertBox.innerText = message;
  alertBox.className = type === "success" ? "success" : "error";
}

// Clear message
function clearAlert() {
  alertBox.style.display = "none";
  alertBox.innerText = "";
  alertBox.className = "";
}

// Auto-focus & Validation
inputs.forEach((input, index) => {
  input.setAttribute("type", "number");
  input.setAttribute("maxlength", "1");

  input.addEventListener("input", () => {
  const value = input.value;

  // Allow only one digit
  if (value.length > 1) {
    input.value = "";
    showAlert("Only one number allowed in each box!", "error");
    return;
  }

  if (isNaN(value)) {
    input.value = "";
    showAlert("Only numbers are allowed!", "error");
    return;
  }

  // Check ALL previous inputs
  for (let i = 0; i < index; i++) {
    if (inputs[i].value === "") {
      input.value = ""; // Clear the current input
      inputs[i].focus(); // Focus the first empty one before this
      showAlert(`Please fill the box before this one!`, "error");
      return;
    }
  }

  clearAlert();

  // Auto move to next
  if (value && index < inputs.length - 1) {
    inputs[index + 1].focus();
  }
});

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
      input.value = "";
      if (index > 0) inputs[index - 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputs[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  });
});

// Auth check
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    showAlert("Logged in as: " + user.email, "success");
  } else {
    showAlert("You must be logged in first!", "error");
  }
});

// Check PIN
document.getElementById("jecker").addEventListener("click", async () => {
  if (!currentUser) {
    showAlert("You must be logged in first!", "error");
    return;
  }

  const pin = Array.from(inputs).map(i => i.value).join("");

  if (pin.length !== inputs.length) {
    showAlert("Please enter full pin code!", "error");
    return;
  }

  try {
    const userRef = ref(database, `users/${currentUser.uid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      showAlert("User data not found!", "error");
      return;
    }

    const savedPin = snapshot.val().Pin;

    if (pin === savedPin) {
      showAlert("Pin is correct! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } else {
      showAlert("Incorrect pin!", "error");
    }

  } catch (err) {
    console.error(err);
    showAlert("Something went wrong!", "error");
  }
});
