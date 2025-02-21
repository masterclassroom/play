import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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

// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    console.log("User logged in:", user.email);
// Firebase ref to fetch country
// Firebase ref to fetch country
const userRef = ref(database, `users/${user.uid}/country`);
const claimRef = ref(database, `users/${user.uid}/claim`);
const veriRef = ref(database, `users/${user.uid}`);

try {
  const snapshot = await get(claimRef);
  if (!snapshot.exists()) {
    const countrySnapshot = await get(userRef);
    const countryData = countrySnapshot.val();
    if (countryData === "Somaliland") {
      // Set coins and claim data for Somaliland users
      await update(veriRef, {
        coins: 50,  // Add 1000 coins for Somaliland users
        claim: "claimed",  // Set claim status
      });
    }
  }
} catch (error) {
  console.error("Error fetching country or setting claim:", error.message);
}
    // Hubinta PIN
    const pinRef = ref(database, `users/${user.uid}/pinned`);
    try {
      const snapshot = await get(pinRef);
      if (snapshot.exists()) {
        window.location.href = 'Pincode.html';
        return;
      }
    } catch (error) {
      console.error("Error checking PIN:", error.message);
    }

    // Hubi coins-ka user-ka
    const userCoinsRef = ref(database, `users/${user.uid}/coins`);
    try {
      const coinsSnapshot = await get(userCoinsRef);
      let userCoins = coinsSnapshot.exists() ? coinsSnapshot.val() : 0;

      document.getElementById("user-coins").innerText = userCoins;
    } catch (error) {
      console.error("Error fetching coins:", error.message);
    }

    // Hubi koorsooyinka la iibsaday
    document.querySelectorAll('.btn-buy, .btn-unlock').forEach(async (button) => {
      const courseName = button.getAttribute('data-course');
      const purchaseRef = ref(database, `users/${user.uid}/purchases/${courseName}`);

      try {
        const purchaseSnapshot = await get(purchaseRef);
        if (purchaseSnapshot.exists() && purchaseSnapshot.val().purchased) {
          button.disabled = true;
          button.innerText = 'Already Purchased';
        }
      } catch (error) {
        console.error(`Error checking purchase for ${courseName}:`, error.message);
      }
    });

    // Iibso koorso
    document.querySelectorAll('.btn-buy').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const courseName = event.target.getAttribute('data-course');
        const price = parseInt(event.target.getAttribute('price'));
        const userRef = ref(database, `users/${user.uid}/payments/${courseName}`);

        try {
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            Swal.fire({
              text: `Mar hore ayaad codsatay koorsada: ${courseName}, fadlan sug inta la Xaqiijinayo`,
              icon: 'info',
              confirmButtonText: 'Ok'
            });
          } else {
            const { isConfirmed } = await Swal.fire({
              title: 'Confirmation',
              text: `Ma rabtaa inaad iibsatid koorsada ${courseName} oo ah $${price}?`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Haa',
              cancelButtonText: 'Maya'
            });

            if (isConfirmed) {
              window.location.href = `payment.html?course:detailshtmlhex1290pllknmagdhssg=${encodeURIComponent(courseName)}&price:detailshtmlhex1290pllknmagdhssg=${encodeURIComponent(price)}`;
            }
          }
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: `Waxaa dhacay khalad: ${error.message}`,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      });
    });

    // Unlock course with coins
    document.querySelectorAll('.btn-unlock').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const courseName = event.target.getAttribute('data-course');
        const coursePrice = parseInt(document.querySelector(`#${event.target.closest('.course-card').id} .price`).innerText);
        const userCoinsRef = ref(database, `users/${user.uid}`);
        const usrCoinsRef = ref(database, `users/${user.uid}/coins`);
        const purchaseRef = ref(database, `users/${user.uid}/purchases/${courseName}`);

        try {
          const coinsSnapshot = await get(usrCoinsRef);
          let userCoins = coinsSnapshot.exists() ? coinsSnapshot.val() : 0;

          if (userCoins >= coursePrice) {
            const { isConfirmed } = await Swal.fire({
              title: 'Confirmation',
              text: `Ma hubtaa inaad iibsatid ${courseName} adigoo isticmaalaya ${coursePrice} coins?`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Haa',
              cancelButtonText: 'Maya'
            });

            if (isConfirmed) {
              await update(userCoinsRef, { coins: userCoins - coursePrice });
              await set(purchaseRef, { purchased: true, courseName, timestamp: new Date().toISOString() });

              document.getElementById("user-coins").innerText = userCoins - coursePrice;
              button.disabled = true;
              button.innerText = "Already Unlocked";

              Swal.fire({
                title: 'Success!',
                text: `${courseName} waa la furay!`,
                icon: 'success',
                confirmButtonText: 'Ok'
              });
            }
          } else {
            Swal.fire({
              title: 'Insufficient Coins',
              text: `Waxaad u baahan tahay ${coursePrice} coins, adiguna waxaad haysataa ${userCoins} coins.`,
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: `Waxaa dhacay khalad: ${error.message}`,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      });
    });

    // About Modal
    document.getElementById('about-btn')?.addEventListener('click', () => {
      Swal.fire({
        title: 'About Us',
        text: 'Thanks for using this website!',
        icon: 'info',
        confirmButtonText: 'Close'
      });
    });

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
});
