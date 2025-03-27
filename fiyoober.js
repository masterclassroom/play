import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAj0xbIZhcmWiSf3nYVgIIgTZ_KJ64mTE",
  authDomain: "exam-81b90.firebaseapp.com",
  databaseURL: "https://exam-81b90-default-rtdb.firebaseio.com",
  projectId: "exam-81b90",
  storageBucket: "exam-81b90.firebasestorage.app",
  messagingSenderId: "461178422237",
  appId: "1:461178422237:web:8433ab42b524b0a17bac34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Translations
const translations = {
    en: {
        "reissue_password": "Reissue Password",
        "email": "Email",
        "captcha": "Captcha",
        "send_reset": "Send Reset",
        "back": "Back",
        "choose_language": "Choose Language",
        "error_email": "Please enter your email to reset your password.",
        "error_captcha": "Captcha code is incorrect.",
        "success_reset": "Successfully sent! Check your email.",
    },
    so: {
        "reissue_password": "Soo Celinta Furaha",
        "email": "Email",
        "captcha": "Cabbirto",
        "send_reset": "Dir Dib-u-habeyn",
        "back": "Dib u Noqo",
        "choose_language": "Dooro Luuqad",
        "error_email": "Fadlan geli email-kaaga si aad u badashid furaha sirta.",
        "error_captcha": "Lambarka Captcha sax ma aha.",
        "success_reset": "Si guul leh ayaa loo diray! Fadlan hubi email-kaaga.",
    }
};

// Function to change language
const languageSelect = document.getElementById("language");
languageSelect.addEventListener("change", changeLanguage);
function changeLanguage() {
    const lang = languageSelect.value;
    document.querySelectorAll("[data-lang]").forEach(el => {
        const key = el.getAttribute("data-lang");
        el.textContent = translations[lang][key];
    });
}

// Generate Captcha
function generateCaptcha() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captchaCode = '';
    for (let i = 0; i < 9; i++) {
        captchaCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    document.getElementById('captchaCode').textContent = captchaCode;
    return captchaCode;
}

// Show alert message
function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.style.display = 'block';
    alertBox.className = type; // 'error' or 'success'
    alertBox.textContent = message;

    setTimeout(() => {
        alertBox.style.display = 'none';
        alertBox.className = ''; // Clear classes
    }, 3000);
}

// Generate captcha when page loads
let captchaCode = generateCaptcha();

// Handle Forgot Password
document.getElementById('forgotPasswordBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('reset').value;
    const captchaInput = document.getElementById('captchaInput').value;
    const lang = languageSelect.value;

    // Check if email is empty
    if (!email) {
        showAlert(translations[lang]["error_email"], 'error');
        return;
    }

    // Check if captcha is correct
    if (captchaInput !== captchaCode) {
        showAlert(translations[lang]["error_captcha"], 'error');
        captchaCode = generateCaptcha(); // Regenerate captcha if it's wrong
        return;
    }

    try {
        // Send password reset email
        await sendPasswordResetEmail(auth, email);
        showAlert(translations[lang]["success_reset"], 'success');
        captchaCode = generateCaptcha();
    } catch (error) {
        showAlert(error.message, 'error');
    }
});
