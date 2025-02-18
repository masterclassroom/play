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
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Check if the user is logged in
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userID = user.uid;
        const userRef = ref(database, `users/${userID}`);
        const pinRef = ref(database, `users/${userID}/active`);
        const checkbox = document.getElementById("myCheckbox");

        // Handle checkbox state based on existing pin
        try {
            const snapshot = await get(pinRef); // Await for pin data
            checkbox.checked = snapshot.exists();
        } catch (error) {
            console.error("Error fetching pin data: ", error);
        }

        // Fetch user data (Username, Email, Phone Number)
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

        // Handle checkbox change
        async function checkboxChanged() {
            const userRef = ref(database, `users/${userID}/active`);
            if (checkbox.checked) {
                Swal.fire('Successfully!', 'Pin enabled Successfully', 'success');
                await set(userRef, {
                    active:true,
                });
                
                
            } else {
                Swal.fire("Successfully!", "Pin disabled successfully", "success");
                await set(userRef, {
                    active: null // Set the pin to null in the database
                });
            }
        }

        // Attach event listener to checkbox
        document.getElementById("myCheckbox").addEventListener("change", checkboxChanged);

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
