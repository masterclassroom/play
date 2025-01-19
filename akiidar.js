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
        const courseName = event.target.getAttribute('data-course');
        const userRef = ref(database, `users/${user.uid}/purchases/${courseName}`);

        try {
          const snapshot = await get(userRef);
          if (snapshot.exists() && snapshot.val().purchased) {
            Swal.fire({
              title: 'Koorsada Hore Ayaa La Iibsaday!',
              text: `Waad iibsatay koorsada: ${courseName} mar hore. Mahadsanid!`,
              icon: 'info',
              confirmButtonText: 'Ok'
            });
            console.log(`Course ${courseName} already purchased.`);
          } else {
            await set(userRef, {
              purchased: true,
              courseName: courseName,
              timestamp: new Date().toISOString()
            });

            Swal.fire({
              title: 'Iibsashada Waa Guul!',
              text: `Waad iibsatay koorsada: ${courseName}. Mahadsanid!`,
              icon: 'success',
              confirmButtonText: 'Ok'
            });
            console.log(`Purchase saved for course: ${courseName}`);
          }
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: `Waxaa dhacay khalad: ${error.message}`,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          console.error("Error checking or saving purchase:", error.message);
        }
      });
    });

    // View Purchased Courses
    const viewPurchasedBtn = document.getElementById('view-purchased-btn');
    viewPurchasedBtn.addEventListener('click', () => {
      if (!user) {
        Swal.fire({
          title: 'Log in First!',
          text: 'Fadlan marka hore geli akoonkaaga.',
          icon: 'warning',
          confirmButtonText: 'Ok'
        }).then(() => {
          window.location.href = "login.html";
        });
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
  Swal.fire({
    title: 'About Us',
    text: 'This is about our platform. Mahadsanid!',
    icon: 'info',
    confirmButtonText: 'Close'
  });
});

const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
      signOut(auth)
      alert("sign out successfully ");
    }
