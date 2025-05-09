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
var suc = document.getElementById("suc");
var click = document.getElementById("click");
var back = document.getElementById("back");
var shit = document.getElementById("shit");

// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    console.log("User logged in:", user.email);
    


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
    const userRef = ref(database, `users/${user.uid}/country`);
    const claimRef = ref(database, `users/${user.uid}/claim`);
    const veriRef = ref(database, `users/${user.uid}`);

    try {
      const snapshot = await get(claimRef);
      if (!snapshot.exists()) {
        const countrySnapshot = await get(userRef);
        const countryData = countrySnapshot.val();
        if (countryData === "Somaliland") {
          suc.currentTime = 0;
          suc.play();
          Swal.fire('Welcome', 'You claimed a 50 coins for free', 'success');
          await update(veriRef, { coins: 50, claim: "claimed" });
        } else {
          suc.currentTime = 0;
          suc.play();
          Swal.fire('Welcome', 'You claimed 10 coins for free', 'success');
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
        suc.currentTime = 0;
          suc.play();
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
    click.currentTime = 0;
          click.play();
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
        ero.currentTime = 0.7;
          ero.play();
        const { isConfirmed } = await Swal.fire({
          title: 'Payment confirmation',
          text: `Ma hubtaa inaad tuurato ${qiime} coins?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Haa',
          cancelButtonText: 'Maya'
        });

        if (!isConfirmed) return;
        document.getElementById("user-coins").innerText = userCoins - qiime;
        click.currentTime = 0;
          click.play();
          shit.currentTime = 0;
          shit.play();

        Swal.fire({
          title: 'Matching random reward...',
          html: '<b>Processing...</b>',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        setTimeout(async () => {
  let success = false;
  let rewardCoins = 0;
  let randomChance = Math.random(); // 0 ilaa 1
  let successRate = 5; // Halkan ku beddel boqolkiiba guusha aad rabto

  success = randomChance < successRate / 100;
  rewardCoins = success ? 0 : Math.floor(Math.random() * 10) + 1;

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
    suc.currentTime = 0;
          suc.play();
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
}, 1000); // 1-second delay
      } else {
        Swal.fire({
          title: 'Unable to thraw',
          text: `Not enough coins. you need ${qiime}.coins to thraw `,
          icon: 'warning',
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

document.querySelectorAll('.btn-unlock900').forEach((button) => {
  button.addEventListener('click', async (event) => {
    click.currentTime = 0;
          click.play();
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
        ero.currentTime = 0.7;
          ero.play();
        const { isConfirmed } = await Swal.fire({
          title: ' Payment confirmation',
          text: `Ma hubtaa inaad furato koorsada ${courseName} adigoo bixinaya ${qiime} coins?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Haa',
          cancelButtonText: 'Maya'
        });

        if (!isConfirmed) return;

        // Update coins
        await update(usrCoinsRef, { coins: userCoins - qiime });
        document.getElementById("user-coins").innerText = userCoins - qiime;
        click.currentTime = 0;
          click.play();

        // Set purchase
        await set(purchaseRef, {
          purchased: true,
          courseName: courseName,
          timestamp: new Date().toISOString()
        });

        // Update button
        button.disabled = true;
        button.innerText = "Already Unlocked";
        setTimeout(() => {

        // Show success message
        Swal.fire({
          title: 'Successfully!',
          text: `Koorsada ${courseName} waa la furay si guul ah!`,
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        suc.currentTime = 0;
          suc.play();
        },900);

      } else {
        Swal.fire({
          title: 'Unable to buy',
          text: `Not enough coins you need ${qiime}. coins  to buy  .`,
          icon: 'warning',
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
      click.currentTime = 0;
          click.play();
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
        click.currentTime = 0;
          click.play();
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
