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
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  console.log("User logged in:", user.email);
  const userRef = ref(database, `users/${user.uid}/pinned`);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      window.location.href = 'Pincode.html';
    }
  } catch (error) {
    console.error("Error fetching pin:", error.message);
  }
});

// DOMContentLoaded to ensure elements exist before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Handle course purchase
  document.querySelectorAll('.btn-buy').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const courseName = event.target.getAttribute('data-course');
      const price = event.target.getAttribute('price');
      const userRef = ref(database, `users/${auth.currentUser.uid}/payments/${courseName}`);

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
            window.location.href = `payment.html?course:details=${encodeURIComponent(courseName)}&price:details=${encodeURIComponent(price)}`;
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
      const userRef = ref(database, `users/${auth.currentUser.uid}/purchases/${courseName}`);

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

  // About Modal
  const aboutBtn = document.getElementById('about-btn');
  if (aboutBtn) {
    aboutBtn.addEventListener('click', () => {
      Swal.fire({
        title: 'About Us',
        text: 'Thanks for using this website!',
        icon: 'info',
        confirmButtonText: 'Close'
      });
    });
  }

  // Logout function
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      localStorage.removeItem("pinned");
      const user = auth.currentUser;
      if (user) {
        await set(ref(database, `users/${user.uid}/isLoggedIn`), false);
        const outRef = ref(database, `users/${user.uid}/active`);
        const dataRef = ref(database, `users/${user.uid}/pinned`);
        const snapshot = await get(outRef);
        
        if (snapshot.exists()) {
          await set(dataRef, {
            pinned: true
          });

          signOut(auth)
            .then(() => {
              alert("Signed out successfully");
              window.location.href = "login.html";
            })
            .catch((error) => {
              console.error("Error signing out: ", error.message);
            });
        } else {
          signOut(auth)
            .then(() => {
              alert("Signed out successfully.");
              window.location.href = "login.html"; // Optional: Redirect to login page
            })
            .catch((error) => {
              console.error("Error signing out: ", error.message);
            });
        }
      }
    });
  }
});
