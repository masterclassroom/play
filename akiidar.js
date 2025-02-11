import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
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
    document.querySelectorAll('.btn-buy').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const courseName = event.target.getAttribute('data-course');
        const userRef = ref(database, `users/${user.uid}/payments/${courseName}`);

        try {
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            Swal.fire({
              title: '',
              text: `Mar hore ayaad codsatay koorsada: ${courseName}.`,
              icon: 'info',
              confirmButtonText: 'Ok'
            });
          } else {
            const { isConfirmed } = await Swal.fire({
              title: 'Ma doonaysaa?',
              text: `Ma rabtaa koorsada ${courseName}?`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Haa',
              cancelButtonText: 'Maya'
            });

            if (isConfirmed) {
              window.location.href = `payment.html?course=${encodeURIComponent(courseName)}`;
            }
          }
        } catch (error) {
          Swal.fire({
            title: 'Khalad!',
            text: `Waxaa dhacay khalad: ${error.message}`,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      });
    });
    

    // Handle free courses
    document.querySelectorAll('.btn-free').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const courseName = event.target.getAttribute('data-course');
        const userRef = ref(database, `users/${user.uid}/purchases/${courseName}`);

        try {
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            Swal.fire({
              title: '',
              text: `Mar hore ayaad furatay koorsada: ${courseName}.`,
              icon: 'info',
              confirmButtonText: 'Ok'
            });
          } else {
            Swal.fire({
              title: 'Successfully!',
              text: `Waad furatay koorsada ${courseName}`,
              icon: 'success',
              confirmButtonText: 'Ok'
            });

            await set(userRef, {
              purchased: true,
              courseName: courseName,
              timestamp: new Date().toISOString()
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Khalad!',
            text: `Waxaa dhacay khalad: ${error.message}`,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      });
    });

  } else {
    // Redirect to login page if user is not logged in
    window.location.href = "login.html";
  }
});

// About Modal
document.getElementById('about-btn').addEventListener('click', () => {
  Swal.fire({
    title: 'About Us',
    text: 'Thanks for using this website!',
    icon: 'info',
    confirmButtonText: 'Close'
  });
});

// Logout function
document.getElementById('logout-btn').addEventListener('click', async () => {
  const user = auth.currentUser;
  if (user) {
    await set(ref(database, `users/${user.uid}/isLoggedIn`), false);
    signOut(auth)
      .then(() => {
        alert("Signed out successfully");
        window.location.href = "login.html"; // Redirect to login page after signing out
      })
      .catch((error) => {
        console.error("Error signing out: ", error.message);
      });
  } else {
    console.error("No user found for logout.");
  }
});
