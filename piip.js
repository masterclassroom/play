// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBAj0xbIZhcmWiSf3nYVgIIgTZ_KJ64mTE",
    authDomain: "exam-81b90.firebaseapp.com",
    databaseURL: "https://exam-81b90-default-rtdb.firebaseio.com",
    projectId: "exam-81b90",
    storageBucket: "exam-81b90.firebasestorage.app",
    messagingSenderId: "461178422237",
    appId: "1:461178422237:web:8433ab42b524b0a17bac34",
    measurementId: "G-KKDNZBZLPG"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Check if the user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        const userID = user.uid;
        const userRef = ref(database, 'users/' + userID);

        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                const username = userData.username;
                const email = user.email;
                const number = userData.number;

                document.getElementById('number').textContent = "Phone number: " + number;
                document.getElementById('userName').textContent = "Username: " + username;
                document.getElementById('userEmail').textContent = "Email: " + email;
            } else {
                document.getElementById('number').textContent = "User not found.";
                document.getElementById('userName').textContent = "";
                document.getElementById('userEmail').textContent = "";
            }
        });
    } else {
        alert("You must be logged in to view this page.");
        window.location.href = "login.html";
    }
});

// Back button functionality
document.getElementById('backButton').addEventListener('click', () => {
    window.history.back();
});

// Edit button functionality
document.getElementById('edit').addEventListener('click', () => {
    window.location.href = "Select.html";
});
