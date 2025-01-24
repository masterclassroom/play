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
                text: ` koor sadan mar hore ayaad cod satay Fadlan nala soo xirir sii u iibsato koorsada: ${courseName}.`,
                icon: 'info',
                confirmButtonText: 'Ok'
              });
              console.log(`Request for course ${courseName} is already recorded.`);
            } else if (purchaseStatus.purchased === true) {
              Swal.fire({
                title: 'Koorsada Waa La Iibiyay!',
                text: `Waad iibsatay koorsada: ${courseName}. mar hore fadlan gal qaybta view purchasedka`,
                icon: 'success',
                confirmButtonText: 'Ok'
              });
              console.log(`Course ${courseName} already purchased.`);
            }
          } else {
            const { isConfirmed } = await Swal.fire({
              title: 'Ma doonaysa?',
              text: `Ma rabtaa koorsada ${courseName}?`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Haa',
              cancelButtonText: 'Maya'
            });

            if (isConfirmed) {
              // Simulate payment process
              Swal.fire({
                title: '',
                text: 'Fadlan naga la soo xirir contacts xaga sare saaran',
                icon: '',
              }).then(async (result) => {
                if (result.isConfirmed) {
                  const phoneNumber = result.value;
                  console.log(`Simulating payment to *220*${phoneNumber}*1000#`);

                  await set(userRef, {
                    purchased: false,
                    courseName: courseName,
                    timestamp: new Date().toISOString()
                  });
                    return;

                  Swal.fire({
                    title: '!',
                    text: `Fadlan sug 24 saac gudahood inta maamulka uu xaqiijinayo.`,
                    icon: 'info',
                    confirmButtonText: 'Ok'
                  });
                } else {
                  Swal.fire({
                    title: 'Lacag Bixinta Waa La Joojiyay!',
                    text: 'Ma aadan dhammeystirin iibka.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
                }
              });
            }
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
    text: 'This is about Thanks for using this website',
    icon: 'info',
    confirmButtonText: 'Close'
  });
});

// Logout function
const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', async () => {
  await set(ref(database, `users/${user.uid}/isLoggedIn`), false);
  signOut(auth).then(() => {
    alert("Signed out successfully");
    window.location.href = "login.html"; // Redirect to login page after signing out
  }).catch((error) => {
    console.error("Error signing out: ", error.message);
  });
});
