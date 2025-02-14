import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBAj0xbIZhcmWiSf3nYVgIIgTZ_KJ64mTE",
  authDomain: "exam-81b90.firebaseapp.com",
  databaseURL: "https://exam-81b90-default-rtdb.firebaseio.com",
  projectId: "exam-81b90",
  storageBucket: "exam-81b90.appspot.com",
  messagingSenderId: "461178422237",
  appId: "1:461178422237:web:8433ab42b524b0a17bac34"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// ✅ Hubi haddii user uu login sameeyay
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user.email);
    } else {
        console.log("No user is logged in.");
        Swal.fire('Error', 'You must be logged in first!', 'error');
    }
});

// ✅ Marka button la riixo, hubi pin code
document.getElementById('jecker').addEventListener('click', async () => {
    try {
        const code = document.getElementById("pincode").value.trim(); // Hel pincode la geliyay
        const user = auth.currentUser; // Isticmaalaha hadda jira
        
        if (!user) {
            Swal.fire('Error', 'You must be logged in first!', 'error');
            return;
        }
        
        if (!code) {
            Swal.fire('Error', 'Please enter a verification code!', 'warning');
            return;
        }

        const userID = user.uid;
        const userRef = ref(database, `users/${userID}`); // Xogta user-ka
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
            Swal.fire('Error', 'User data not found!', 'error');
            return;
        }

        const userData = snapshot.val();
        const savedPin = userData.Pin; // Hel Pin code-ka kaydsan
        
        console.log("Stored Pin:", savedPin); // Log-ka arag si aad u xaqiijiso

        if (savedPin === code) {
            Swal.fire('Success!', 'Pin is correct!', 'success').then(() => {
                localStorage.setItem("pinned", "true");
                window.location.href = "Academy.html"; // Haddii pin sax yahay, user wuu gudbiyaa
            });
        } else {
            Swal.fire('Error', 'Incorrect pin!', 'error'); // Pin code khalad ah
        }

    } catch (error) {
        console.error("An error occurred:", error);
        Swal.fire('Error', 'Something went wrong. Please try again later.', 'error'); // Khalad guud
    }
});
