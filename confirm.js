import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, deleteUser, EmailAuthProvider, reauthenticateWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const firebaseConfig = {
      apiKey: "AIzaSyBAj0xbIZhcmWiSf3nYVgIIgTZ_KJ64mTE",
      authDomain: "exam-81b90.firebaseapp.com",
      databaseURL: "https://exam-81b90-default-rtdb.firebaseio.com",
      projectId: "exam-81b90",
      storageBucket: "exam-81b90.appspot.com",
      messagingSenderId: "461178422237",
      appId: "1:461178422237:web:8433ab42b524b0a17bac34"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists() && snapshot.val().lastdelete) {
      const deleteTime = snapshot.val().lastdelete;

      if (Date.now() >= deleteTime) {
        try {
          // Reauthenticate user si deleteUser uu shaqeeyo
          const password = prompt("Password geli si account-ka loo tirtiro:");
          if (!password) {
            alert("Password lama helin. Lama tirtiri karo  account-ka.");
            return;
          }
          const credential = EmailAuthProvider.credential(user.email, password);
          await reauthenticateWithCredential(user, credential);

          // Markaas delete
          await remove(userRef);
          await deleteUser(user); // delete auth account// delete data database
          alert("Account-kaaga waa la tirtiyay.");
        } catch (error) {
          console.error("Error during deletion:", error.message);
          alert("Incorrect password ");
        }
      }
    }
  }
});
