import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";  
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";  
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";  
  
const firebaseConfig = {  
  apiKey: "AIzaSyBAj0xbIZhcmWiSf3nYVgIIgTZ_KJ64mTE",  
  authDomain: "exam-81b90.firebaseapp.com",  
  databaseURL: "https://exam-81b90-default-rtdb.firebaseio.com",  
  projectId: "exam-81b90",  
  storageBucket: "exam-81b90.appspot.com",  
  messagingSenderId: "461178422237",  
  appId: "1:461178422237:web:8433ab42b524b0a17bac34"  
};  
  
const app = initializeApp(firebaseConfig);  
const auth = getAuth(app);  
const database = getDatabase(app);  
  
const urlParams = new URLSearchParams(window.location.search);  
const usernameFromUrl = urlParams.get("username");  
  
// Elements  
const userNameEl = document.getElementById("userName");  
const userEmailEl = document.getElementById("userEmail");  
const numberEl = document.getElementById("number");  
const checkbox = document.getElementById("myCheckbox");  
const clickSound = document.getElementById("click");  
const shitSound = document.getElementById("shit");  
const backSound = document.getElementById("back");  
  
onAuthStateChanged(auth, async (user) => {  
  if (!user) {  
    alert("You must be logged in to view this page.");  
    window.location.href = "login.html";  
    return;  
  }  
  
  const userRef = ref(database, `users/${user.uid}`);  
  const snapshot = await get(userRef);  
  
  if (!snapshot.exists()) {  
    window.location.href = "404.html";  
    return;  
  }  
  
  const userData = snapshot.val();  
  const usernameFromDb = userData.username;  
  
  // Haddii URL username uusan jirin  
  if (!usernameFromUrl) {  
    const currentUrl = window.location.href.split("?")[0];  
    const newUrl = `${currentUrl}?username=${encodeURIComponent(usernameFromDb)}`;  
    history.replaceState(null, '', newUrl);  // URL beddel adigoon reload sameynin  
    // Wax kale ma samayn, sii soco koodhka hoose  
  } else {  
    // Haddii username URL iyo DB isku mid ahayn  
    if (usernameFromUrl !== usernameFromDb) {  
      window.location.href = "404.html";  
      return;  
    }  
  }  
  
  // Haddii username sax ah, xogta muuji  
  userNameEl.textContent = "Username: " + usernameFromDb;  
  userEmailEl.textContent = "Email: " + (userData.email || "Not set");  
  numberEl.textContent = "Number: " + (userData.number || "N/A");  
  
  // Checkbox active state ka soo qaad DB  
  const activeRef = ref(database, `users/${user.uid}/active`);  
  const activeSnapshot = await get(activeRef);  
  checkbox.checked = activeSnapshot.exists() && activeSnapshot.val() === true;  
  
  // Checkbox change handler  
  checkbox.addEventListener("change", async () => {  
    shitSound.play();  
  
    if (checkbox.checked) {  
      await set(activeRef, true);  
      Swal.fire('Successfully!', 'Pin enabled Successfully', 'success');  
    } else {  
      await set(activeRef, null);  
      Swal.fire('Successfully!', 'Pin disabled Successfully', 'success');  
    }  
  });  
});  
  
// Back button  
document.getElementById("backButton").addEventListener("click", () => {  
  backSound.currentTime = 0;  
  backSound.play();  
  setTimeout(() => {  
    window.history.back();  
  }, 1200);  
});  
  
// Edit button  
document.getElementById("edit").addEventListener("click", () => {  
  clickSound.currentTime = 0;  
  clickSound.play();  
  setTimeout(() => {  
    window.location.href = "Select.html";  
  }, 1200);  
});
