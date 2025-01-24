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
    const buyButtons = document.querySelectorAll('.btn-buy');
    buyButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        const courseName = event.target.getAttribute('data-course');
        const userRef = ref(database, `users/${user.uid}/purchases/${courseName}`);

        try {
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const purchaseStatus = snapshot.val();
            if (purchaseStatus.purchased === false) {
              Swal.fire({
                title: '',
                text: `Koorsadan mar hore ayaad codsatay. Fadlan nala soo xiriir si aad u iibsato koorsada: ${courseName}.`,
                icon: 'info',
                confirmButtonText: 'Ok'
              });
              console.log(`Request for course ${courseName} is already recorded.`);
            } else if (purchaseStatus.purchased === true) {
              Swal.fire({
                title: 'Koorsada Waa La Iibiyay!',
                text: `Waad iibsatay koorsada: ${courseName}. Fadlan gal qaybta "View Purchased".`,
                icon: 'success',
                confirmButtonText: 'Ok'
              });
              console.log(`Course ${courseName} already purchased.`);
            }
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
              Swal.fire({
                title: '',
                text: 'Fadlan nala soo xiriir adigoo isticmaalaya xogta xiriirka ee sare ku qoran.',
                icon: 'info',
              }).then(async () => {
                await set(userRef, {
                  purchased: false,
                  courseName: courseName,
                  timestamp: new Date().toISOString()
                });

                Swal.fire({
                  title: 'Sug!',
                  text: 'Fadlan sug 24 saac inta maamulka uu xaqiijinayo iibka.',
                  icon: 'info',
                  confirmButtonText: 'Ok'
                });
              });
            }
          }
        } catch (error) {
          Swal.fire({
            title: 'Khalad!',
            text: `Waxaa dhacay khalad: ${error.message}`,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          console.error("Error checking or saving purchase:", error.message);
        }
      });
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
    text: 'Thanks for using this website!',
    icon: 'info',
    confirmButtonText: 'Close'
  });
});

// Logout function
const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', async () => {
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

