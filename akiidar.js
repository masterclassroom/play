import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAj0xbIZhcmWiSf3nYVgIIgTZ_KJ64mTE",
  authDomain: "exam-81b90.firebaseapp.com",
  databaseURL: "https://exam-81b90-default-rtdb.firebaseio.com",
  projectId: "exam-81b90",
  storageBucket: "exam-81b90.appspot.com",
  messagingSenderId: "461178422237",
  appId: "1:461178422237:web:8433ab42b524b0a17bac34",
  measurementId: "G-KKDNZBZLPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.email);

    // Handle course purchase
    const buyButtons = document.querySelectorAll('.btn-buy');
    buyButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        const courseName = event.target.getAttribute('data-course'); // Get course name
        const userRef = ref(database, `users/${user.uid}/purchases/${courseName}`); // Path to store purchase data

        // Check if the user has already purchased the course
        try {
          const snapshot = await get(userRef); // Retrieve current purchase data for the course
          if (snapshot.exists() && snapshot.val().purchased) {
            // If the course is already purchased, show an alert
            alert(`Waad iibsatay koorsada: ${courseName} mar hore. Mahadsanid!`);
            console.log(`Course ${courseName} already purchased.`);
          } else {
            // If the course is not yet purchased, save the purchase data
            await set(userRef, {
              purchased: true,
              courseName: courseName, // Save the name of the course
              timestamp: new Date().toISOString() // Save the purchase timestamp
            });

            alert(`Waad iibsatay koorsada: ${courseName}. Mahadsanid!`);
            console.log(`Purchase saved for course: ${courseName}`);
          }
        } catch (error) {
          console.error("Error checking or saving purchase:", error.message);
        }
      });
    });

    // View Purchased Courses
    const viewPurchasedBtn = document.getElementById('view-purchased-btn');
    viewPurchasedBtn.addEventListener('click', () => {
      if (!user) {
        alert("Please log in first.");
        window.location.href = "login.html";
      } else {
        window.location.href = "purchased.html";
      }
    });

  } else {
    // Redirect to login page if user is not logged in
    window.location.href = "login.html";
  }
});

// About Modal
const aboutBtn = document.getElementById('about-btn');
aboutBtn.addEventListener('click', () => {
  document.getElementById('about-modal').style.display = 'block';
});

function closeAbout() {
  document.getElementById('about-modal').style.display = 'none';
}

// Close Purchased Courses Modal
function closePurchasedCourses() {
  document.getElementById('purchased-courses-modal').style.display = 'none';
            }
