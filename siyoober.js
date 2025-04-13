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

// Country codes
const countrySelect = document.getElementById("country");
const numberInput = document.getElementById("number");
countrySelect.addEventListener("change", function () {
    const countryCodes = {
        "Somalia": "252",
        "Somaliland": "252",
        "Kenya": "254",
        "Ethiopia": "251",
        "Uganda": "256",
        "Djibouti": "253"
    };
    numberInput.value = countryCodes[this.value] || "";
});

// Handle Sign Up
document.getElementById('signUpBtn').addEventListener('click', async () => {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById('email').value.trim();
    const country = document.getElementById("country").value;
    const number = numberInput.value.trim();
    const password = document.getElementById('password').value;
    const pin = document.getElementById('pincode').value;
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('succes-message');

    // Clear messages
    errorMessage.style.display = 'none';
    errorMessage.innerText = '';
    successMessage.style.display = 'none';
    successMessage.innerText = '';

    try {
        if (!country) return showError("choose_country");
        if (!username || username.length > 25) return showError("error_invalid_username");
        if (!isValidEmail(email)) return showError("error_invalid_email");
        if (!number || number.length < 10) return showError("error_phone_required");
        if (!pin || pin.length !== 4) return showError("error_pin");
        if (password.length < 8) return showError("error_password_length");

        const snapshot = await get(ref(database, `users/`));
        let emailExists = false, numberExists = false, usernameExists = false;
        snapshot.forEach(childSnapshot => {
            const userData = childSnapshot.val();
            if (userData.email === email) emailExists = true;
            if (userData.number === number) numberExists = true;
            if (userData.username === username) usernameExists = true;
        });

        if (emailExists) return showError("error_email_exists");
        if (numberExists) return showError("error_phone_exists");
        if (usernameExists) return showError("error_username_exists");

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await set(ref(database, `users/${user.uid}`), {
            username, email, country, number, Pin: pin, pinned: true,
            signUpDate: new Date().toISOString()
        });

        await sendEmailVerification(user);

        showSuccess("success_account_created");

        if (localStorage.getItem("1")) {
            localStorage.setItem("2", "true");
        } else {
            localStorage.setItem("1", "true");
        }

        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);

    } catch (error) {
        showErrorMessage(error);
    }
});

// Email format validator
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show error message
function showError(key) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'block';
    errorMessage.innerText = translations[currentLanguage][key] || key;
}

// Show success message
function showSuccess(key) {
    const successMessage = document.getElementById('succes-message');
    successMessage.style.display = 'block';
    successMessage.innerText = translations[currentLanguage][key] || key;
}

// Firebase error handler
function showErrorMessage(error) {
    const key = firebaseErrorToTranslationKey(error.code);
    showError(key || error.message);
}

function firebaseErrorToTranslationKey(code) {
    const map = {
        "auth/email-already-in-use": "error_email_exists",
        "auth/invalid-email": "error_invalid_email",
        "auth/weak-password": "error_password_length"
    };
    return map[code];
}

// Translations
const translations = {
    en: {
        registration: "Registration",
        limited_reached: "You reached the limit of account creation",
        sign_up: "Sign Up",
        already_account: "Already have an account?",
        login: "Login",
        choose_country: "Please choose your country",
        username: "Username",
        choose_language: "Choose language",
        email: "Email",
        phone: "Phone Number",
        password: "Password",
        pin_code: "Pin Code",
        welcome: "WELCOME!",
        contact: "If you experience any problems, please contact us",
        error_invalid_username: "Invalid username",
        error_invalid_email: "Invalid email address",
        error_phone_required: "Phone number is required",
        error_pin: "Pin must be 4 digits",
        error_password_length: "Password must be at least 8 characters long",
        error_email_exists: "Email already registered",
        error_phone_exists: "Phone number already registered",
        error_username_exists: "Username is taken",
        success_account_created: "Account created successfully"
    },
    so: {
        registration: "Diiwaangelin",
        limited_reached: "Waxaad gaadhay xadka samaynta akoonyada",
        sign_up: "Diiwaangeli",
        already_account: "Horey ma u leedahay xisaab?",
        login: "Soo gal",
        choose_country: "Fadlan dooro waddankaaga",
        username: "Magaca Isticmaalaha",
        choose_language: "Doooro luuqada",
        email: "Email",
        phone: "Lambarka Telefoonka",
        password: "Furaha Sirta",
        pin_code: "Koodhka Sirta",
        welcome: "SOO DHAWOOW!",
        contact: "Haddi aad cilad dareento nala soo xiriir",
        error_invalid_username: "Magaca isticmaalaha sax ma aha",
        error_invalid_email: "Cinwaanka email-ka sax ma aha",
        error_phone_required: "Lambarka telefoonka waa lagama maarmaan",
        error_pin: "Koodhka waa inuu noqdaa 4 lambar",
        error_password_length: "Furaha sirta waa inuu ka badanyahay 8 xaraf",
        error_email_exists: "Email horey loo diiwaangeliyey",
        error_phone_exists: "Lambarka telefoonka horey loo diiwaangeliyey",
        error_username_exists: "Magaca isticmaalaha waa la isticmaalay",
        success_account_created: "Akaawnka waa lagu guuleystay"
    }
};

// Language switcher
const languageSelect = document.getElementById("language");
let currentLanguage = "so";

languageSelect.addEventListener("change", function () {
    currentLanguage = this.value;
    switchLanguage(currentLanguage);
});

function switchLanguage(lang) {
    document.querySelectorAll("[data-lang]").forEach(element => {
        const key = element.getAttribute("data-lang");
        if (translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });
}

// Default language and account limit checker
switchLanguage(currentLanguage);
checkLimit();

function checkLimit() {
    const signUpBtn = document.getElementById("signUpBtn");
    if (localStorage.getItem("2")) {
        showError("limited_reached");
        signUpBtn.disabled = true;
    }
                                                      }
