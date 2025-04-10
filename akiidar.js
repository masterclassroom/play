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
    
  const userRef = ref(database, `users/${user.uid}/country`);
    const claimRef = ref(database, `users/${user.uid}/claim`);
    const veriRef = ref(database, `users/${user.uid}`);

    try {
      const snapshot = await get(claimRef);
      if (!snapshot.exists()) {
        const countrySnapshot = await get(userRef);
        const countryData = countrySnapshot.val();
        if (countryData === "Somaliland") {
          Swal.fire('Welcome', 'You claimed a 100 coins from Somaliland, 'success');
          await update(veriRef, { coins: 100, claim: "claimed" });
        } else {
          Swal.fire('Welcome', 'You claimed 10 coins for free other country', 'success');
          await update(veriRef, { coins: 10, claim: "claimed" });
        }
      }
    } catch (error) {
      console.error("Error fetching country or setting claim:", error.message);
    }

    const paySuccRef = ref(database, `users/${user.uid}/payments/pur`);
    const paydeRef = ref(database, `users/${user.uid}/payments`);
    const payCoinsRef = ref(database, `users/${user.uid}/payments/coins`);
    const verief = ref(database, `users/${user.uid}`);
    try {
      const paySuccSnapshot = await get(paySuccRef);
      if (paySuccSnapshot.exists() && paySuccSnapshot.val() === "t") {
        const coinsSnapshot = await get(payCoinsRef);
        if (coinsSnapshot.exists()) {
          const sho = coinsSnapshot.val();
          const userCoinsSnapshot = await get(ref(database, `users/${user.uid}/coins`));
          const userCoins = userCoinsSnapshot.exists() ? userCoinsSnapshot.val() : 0;

          Swal.fire('Payment successfully!', `Your purchased ${sho} coins completed`, 'success');
          await update(verief, { coins: Number(userCoins) + Number(sho) });
          await set(paydeRef, { 
            de: null
          });
        }
      }
    } catch (error) {
      console.error("Error fetching payment details:", error.message);
    }

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

    const userCoinsRef = ref(database, `users/${user.uid}/coins`);
    try {
      const coinsSnapshot = await get(userCoinsRef);
      const userCoins = coinsSnapshot.exists() ? coinsSnapshot.val() : 0;
      document.getElementById("user-coins").innerText = userCoins;
    } catch (error) {
      console.error("Error fetching coins:", error.message);
    }
    document.querySelectorAll('.btn-unlock100, .btn-unlock900').forEach(async (button) => {
      const courseName = button.getAttribute('data-course');
      const purchaseRef = ref(database, `users/${user.uid}/purchases/${courseName}`);

      try {
        const purchaseSnapshot = await get(purchaseRef);
        if (purchaseSnapshot.exists() && purchaseSnapshot.val().purchased) {
          button.disabled = true;
          button.innerText = 'Already unlocked';
        }
      } catch (error) {
        console.error(`Error checking purchase for ${courseName}:`, error.message);
      }
    });
    

    // Iibso koorso
    // Function for unlocking with 100 coins
document.querySelectorAll('.btn-unlock100').forEach((button) => {
  button.addEventListener('click', async (event) => {
    const courseName = event.target.getAttribute('data-course');
    const qiime = parseInt(event.target.getAttribute('qiime'));
    const userCoinsRef = ref(database, `users/${user.uid}/coins`);
    const usrCoinsRef = ref(database, `users/${user.uid}`);
    const purchaseRef = ref(database, `users/${user.uid}/purchases/${courseName}`);

    try {
      // Hel coins-ka user-ka
      const coinsSnapshot = await get(userCoinsRef);
      let userCoins = coinsSnapshot.exists() ? coinsSnapshot.val() : 0;

      if (userCoins >= qiime) {
        const { isConfirmed } = await Swal.fire({
          title: 'Confirmation',
          text: `Ma hubtaa inaad tuurato ${qiime} coins?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Haa',
          cancelButtonText: 'Maya'
        });

        if (!isConfirmed) return;
        document.getElementById("user-coins").innerText = userCoins - qiime;

        Swal.fire({
          title: 'Finding your reward...',
          html: '<b>Processing...</b>',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        setTimeout(async () => {
          let success = false;
          let rewardCoins = 0;
          let randomChance = Math.random(); // Number between 0 and 1

          // 5% fursad guul marka 100 coins la isticmaalo
          success = randomChance < 0.05;
          rewardCoins = success ? 0 : Math.floor(Math.random() * 100) + 1;

          if (success) {
            await update(usrCoinsRef, { coins: userCoins - qiime });
            await set(purchaseRef, { purchased: true, courseName, timestamp: new Date().toISOString() });
            button.disabled = true;
            button.innerText = "Already Unlocked";

            Swal.fire({
              title: 'You win!',
              text: `Koorsada ${courseName} waa la furay!`,
              icon: 'success',
              confirmButtonText: 'Ok'
            });
          } else {
            await update(usrCoinsRef, { coins: userCoins - qiime + rewardCoins });
            document.getElementById("user-coins").innerText = userCoins - qiime + rewardCoins;
            
            Swal.fire({
              title: 'Try Again!',
              text: `Waxaad lumisay ${qiime} coins, laakiin waxaad heshay ${rewardCoins} coins.`,
              icon: 'info',
              confirmButtonText: 'Ok'
            });
          }
        }, 3000); // 3-second delay for animation
      } else {
        Swal.fire({
          title: 'Insufficient Coins',
          text: `Waxaad u baahan tahay ${qiime} coins, adiguna waxaad haysataa ${userCoins} coins.`,
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

// Function for unlocking with 900 coins
document.querySelectorAll('.btn-unlock900').forEach((button) => {
  button.addEventListener('click', async (event) => {
    const courseName = event.target.getAttribute('data-course');
    const qiime = parseInt(event.target.getAttribute('qiime'));
    const userCoinsRef = ref(database, `users/${user.uid}/coins`);
    const usrCoinsRef = ref(database, `users/${user.uid}`);
    const purchaseRef = ref(database, `users/${user.uid}/purchases/${courseName}`);
    try {
      // Hel coins-ka user-ka
      const coinsSnapshot = await get(userCoinsRef);
      let userCoins = coinsSnapshot.exists() ? coinsSnapshot.val() : 0;

      if (userCoins >= qiime) {
        const { isConfirmed } = await Swal.fire({
          title: 'Confirmation',
          text: `Ma hubtaa inaad tuurato ${qiime} coins?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Haa',
          cancelButtonText: 'Maya'
        });

        if (!isConfirmed) return;
        document.getElementById("user-coins").innerText = userCoins - qiime;

        Swal.fire({
          title: 'Finding your reward...',
          html: '<b>Processing...</b>',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        setTimeout(async () => {
          let success = false;
          let rewardCoins = 0;
          let randomChance = Math.random(); // Number between 0 and 1

          // 50% fursad guul marka 900 coins la isticmaalo
          success = randomChance < 0.5;
          rewardCoins = success ? 0 : Math.floor(Math.random() * 900) + 1;

          if (success) {
            await update(usrCoinsRef, { coins: userCoins - qiime });
            await set(purchaseRef, { purchased: true, courseName, timestamp: new Date().toISOString() });
            
            button.disabled = true;
            button.innerText = "Already Unlocked";

            Swal.fire({
              title: 'You win!',
              text: `Koorsada ${courseName} waa la furay!`,
              icon: 'success',
              confirmButtonText: 'Ok'
            });
          } else {
            await update(usrCoinsRef, { coins: userCoins - qiime + rewardCoins });

            document.getElementById("user-coins").innerText = userCoins - qiime + rewardCoins;

            Swal.fire({
              title: 'Try Again!',
              text: `Waxaad lumisay ${qiime} coins, laakiin waxaad heshay ${rewardCoins} coins.`,
              icon: 'info',
              confirmButtonText: 'Ok'
            });
          }
        }, 3000); // 3-second delay for animation
      } else {
        Swal.fire({
          title: 'Insufficient Coins',
          text: `Waxaad u baahan tahay ${qiime} coins, adiguna waxaad haysataa ${userCoins} coins.`,
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
    
    // Unlock course with coins
    
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
