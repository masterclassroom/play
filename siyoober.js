// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAj0xbIZhcmWiSf3nYVgIIgTZ_KJ64mTE",
  authDomain: "exam-81b90.firebaseapp.com",
  databaseURL: "https://exam-81b90-default-rtdb.firebaseio.com",
  projectId: "exam-81b90",
  storageBucket: "exam-81b90.appspot.com",
  messagingSenderId: "461178422237",
  appId: "1:461178422237:web:8433ab42b524b0a17bac34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Wadamada iyo country code-kooda
const countrySelect = document.getElementById("country");
const numberInput = document.getElementById("number");

countrySelect.addEventListener("change", function () {
    const selectedCountry = countrySelect.value;

    if (selectedCountry === "Somalia") {
        numberInput.value = "252";
    } else if (selectedCountry === "Somaliland") {
        numberInput.value = "252";
    } else if (selectedCountry === "Kenya") {
        numberInput.value = "254";
    } else if (selectedCountry === "Ethiopia") {
        numberInput.value = "251";
    } else if (selectedCountry === "Uganda") {
        numberInput.value = "256";
    } else if (selectedCountry === "Djibouti") {
        numberInput.value = "253";
    } else {
        numberInput.value = "";
    }
});

// Handle Sign Up
document.getElementById('signUpBtn').addEventListener('click', async () => {
    const username = document.getElementById("username").value;
    const email = document.getElementById('email').value;
    const country = document.getElementById("country").value
    const number = numberInput.value;
    const password = document.getElementById('password').value;
    const pin = document.getElementById('pincode').value;
    const errorMessage = document.getElementById('error-message');
    const succesMessage = document.getElementById('succes-message');

    // Clear previous error messages
    errorMessage.style.display = 'none';
    errorMessage.innerText = '';
    succesMessage.style.display = 'none';
    succesMessage.innerText = '';

    try {
         if (!country || country=== "") {
             errorMessage.style.display = 'block';
             errorMessage.innerText = 'Please choose country';
             return;
         }
        // Validate inputs
        if (!username || username.length > 25) {
            errorMessage.style.display = 'block';
            errorMessage.innerText = 'Invalid username';
            return;
        }
        if (!isValidEmail(email)) {
            errorMessage.style.display = 'block';
            errorMessage.innerText = 'Invalid email address';
            return;
        }
        if (!number || number.length < 10) {
            errorMessage.style.display = 'block';
            errorMessage.innerText = 'Phone number is required';
            return;
        }
        if (!pin || pin.length !== 4) {
            errorMessage.style.display = 'block';
            errorMessage.innerText = 'Pin must be 4 digits';
            return;
        }
        if (password.length < 8) {
            errorMessage.style.display = 'block';
            errorMessage.innerText = 'Password must be at least 8 characters long';
            return;
        }

        // Check if email or phone number is already registered
        const emailRef = ref(database, `users/`);
        const snapshot = await get(emailRef);

        let emailExists = false;
        let numberExists = false;
        let usernameExists = false;

        snapshot.forEach((childSnapshot) => {
            if (childSnapshot.val().email === email) emailExists = true;
            if (childSnapshot.val().number === number) numberExists = true;
            if (childSnapshot.val().username === username) usernameExists = true;
        });

        if (emailExists) {
            errorMessage.style.display = 'block';
            errorMessage.innerText = 'Email already registered';
            return;
        }
        if (numberExists) {
            errorMessage.style.display = 'block';
            errorMessage.innerText = 'Phone number already registered';
            return;
        }
        if (usernameExists) {
            errorMessage.style.display = 'block';
            errorMessage.innerText = 'Username is taken';
            return;
        }

        // Create User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get current date and time
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        // Save user data to Realtime Database
        const userRef = ref(database, `users/${user.uid}`);
        await set(userRef, {
            username: username,
            email: email,
            country: country,
            number: number,
            password: password,
            pin: pin,
            signUpDate: formattedDate,
        });

        // Send Email Verification
        await sendEmailVerification(user);

        // Success message and redirect
        succesMessage.style.display = 'block';
        succesMessage.innerText = 'Account created successfully';
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2500);

    } catch (error) {
        errorMessage.style.display = 'block';
        errorMessage.innerText = error.message;
    }
});

// Validate email format function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
      }
