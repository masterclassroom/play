import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get, set, update, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const waitingCourse = urlParams.get("waiting");
const prices = new URLSearchParams(window.location.search);
  const price = prices.get("price");
  if (waitingCourse) {
    // Hel coins user-ka
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "login.html";
        return;
      }

      const uid = user.uid;
      const userCoinsRef = ref(database, `users/${uid}/coins`);
      const purchaseRef = ref(database, `users/${uid}/purchases/${waitingCourse}`);

      const coinsSnapshot = await get(userCoinsRef);
      const userCoins = coinsSnapshot.exists() ? coinsSnapshot.val() : 0;

      // Qiimaha koorsada: tusaale ahaan 100 coins
      const coursePrice = price;

      if (userCoins < coursePrice) {
  Swal.fire('Warning', 'Not enough coins to buy this course.', 'warning').then(() => {
    window.location.replace("dashboard.html");
  });
  return;
}

      const { isConfirmed } = await Swal.fire({
        title: 'Buy Course',
        text: `Do you want to buy the course "${waitingCourse}" for ${coursePrice} coins?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, buy it!',
        cancelButtonText: 'No, cancel'
      });

      if (isConfirmed) {
        // Update coins and mark purchase
        await update(ref(database, `users/${uid}`), {
          coins: userCoins - coursePrice
        });
        await set(purchaseRef, {
          purchased: true,
          courseName: waitingCourse,
          timestamp: new Date().toISOString()
        });

     Swal.fire('Successfully', `You bought the course "${waitingCourse}"!`, 'success').then(() => {
  window.location.replace("dashboard.html");
});
      } else {
        Swal.fire('Cancelled', 'You did not buy the course.', 'info');
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const uid = user.uid;
    const pinRef = ref(database, `users/${uid}/pinned`);
    onValue(pinRef, (snapshot) => {
      if (snapshot.exists()) {
        window.location.href = 'Pincode.html';
      }
    });

    const claimRef = ref(database, `users/${uid}/claim`);
    const veriRef = ref(database, `users/${uid}`);
    const countryRef = ref(database, `users/${uid}/country`);
    
    onValue(claimRef, (snapshot) => {
      if (!snapshot.exists()) {
        onValue(countryRef, (countrySnap) => {
          const countryData = countrySnap.val();
          suc.currentTime = 0;
          suc.play();
          if (countryData === "Somaliland") {
            Swal.fire('Welcome', 'You claimed a 50 coins for free', 'success');
            update(veriRef, { coins: 50, claim: "claimed" });
          } else {
            Swal.fire('Welcome', 'You claimed 10 coins for free', 'success');
            update(veriRef, { coins: 10, claim: "claimed" });
          }
        }, { onlyOnce: false });
      }
    }, { onlyOnce: false });

    const paySuccRef = ref(database, `users/${uid}/payments/pur`);
    const paydeRef = ref(database, `users/${uid}/payments`);
    const payCoinsRef = ref(database, `users/${uid}/payments/coins`);
    const verief = ref(database, `users/${uid}`);

    onValue(paySuccRef, (paySuccSnapshot) => {
      if (paySuccSnapshot.exists() && paySuccSnapshot.val() === "t") {
        onValue(payCoinsRef, (coinsSnapshot) => {
          if (coinsSnapshot.exists()) {
            const sho = coinsSnapshot.val();
            const userCoinsRef = ref(database, `users/${uid}/coins`);
            onValue(userCoinsRef, (userCoinsSnapshot) => {
              const userCoins = userCoinsSnapshot.exists() ? userCoinsSnapshot.val() : 0
              suc.play();
              Swal.fire('Payment successfully!', `Your purchased ${sho} coins completed`, 'success');
              update(verief, { coins: Number(userCoins) + Number(sho) });
              set(paydeRef, { de: null });
            }, { onlyOnce: true });
          }
        }, { onlyOnce: true });
      }
    }, { onlyOnce: true });

    const userCoinsRef = ref(database, `users/${uid}/coins`);
    onValue(userCoinsRef, (coinsSnapshot) => {
      const userCoins = coinsSnapshot.exists() ? coinsSnapshot.val() : 0;
      document.getElementById("user-coins").innerText = userCoins;
    });

    document.querySelectorAll('.btn-unlock100, .btn-unlock900').forEach((button) => {
      const courseName = button.getAttribute('data-course');
      const purchaseRef = ref(database, `users/${uid}/purchases/${courseName}`);
      onValue(purchaseRef, (purchaseSnapshot) => {
        if (purchaseSnapshot.exists() && purchaseSnapshot.val().purchased) {
          button.disabled = true;
          button.innerText = 'Already unlocked';
        }
      }, { onlyOnce: false });
    });

    document.querySelectorAll('.btn-unlock100').forEach((button) => {
      button.addEventListener('click', async (event) => {
        click.currentTime = 0;
        click.play();
        const courseName = event.target.getAttribute('data-course');
        const qiime = parseInt(event.target.getAttribute('qiime'));
        const usrCoinsRef = ref(database, `users/${uid}`);
        const purchaseRef = ref(database, `users/${uid}/purchases/${courseName}`);

        const coinsSnapshot = await get(userCoinsRef);
        let userCoins = coinsSnapshot.exists() ? coinsSnapshot.val() : 0;

        if (userCoins >= qiime) {
          setTimeout(() => {
          ero.currentTime = 0.3;
          ero.play();
          },300);
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
            let randomChance = Math.random();
            let successRate = 5;

            success = randomChance < successRate / 100;
            rewardCoins = success ? 0 : Math.floor(Math.random() * 10) + 1;

            if (success) {
              await update(usrCoinsRef, { coins: userCoins - qiime });
              await set(purchaseRef, {
                purchased: true,
                courseName,
                timestamp: new Date().toISOString()
              });

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
          }, 1000);
        } else {
          Swal.fire({
            title: 'Unable to thraw',
            text: `Not enough coins. you need ${qiime} coins to thraw.`,
            icon: 'warning',
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
        const usrCoinsRef = ref(database, `users/${uid}`);
        const purchaseRef = ref(database, `users/${uid}/purchases/${courseName}`);

        const coinsSnapshot = await get(userCoinsRef);
        let userCoins = coinsSnapshot.exists() ? coinsSnapshot.val() : 0;

        if (userCoins >= qiime) {
          setTimeout(() => {
          ero.currentTime = 0.3;
          ero.play();
          },300);
          const { isConfirmed } = await Swal.fire({
            title: 'Payment confirmation',
            text: `Ma hubtaa inaad furato koorsada ${courseName} adigoo bixinaya ${qiime} coins?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Haa',
            cancelButtonText: 'Maya'
          });

          if (!isConfirmed) return;

          await update(usrCoinsRef, { coins: userCoins - qiime });
          document.getElementById("user-coins").innerText = userCoins - qiime;
          click.currentTime = 0;
          click.play();

          await set(purchaseRef, {
            purchased: true,
            courseName,
            timestamp: new Date().toISOString()
          });

          button.disabled = true;
          button.innerText = "Already Unlocked";

          setTimeout(() => {
            Swal.fire({
              title: 'Successfully!',
              text: `Koorsada ${courseName} waa la furay si guul ah!`,
              icon: 'success',
              confirmButtonText: 'Ok'
            });
            suc.currentTime = 0;
            suc.play();
          }, 900);
        } else {
          Swal.fire({
            title: 'Unable to buy',
            text: `Not enough coins. You need ${qiime} coins to buy.`,
            icon: 'warning',
            confirmButtonText: 'Ok'
          });
        }
      });
    });

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
