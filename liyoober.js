// translations object
const translations = {
    en: {
        loginTitle: 'Login account',
        loginBtn: 'Login',
        emailLabel: 'Email',
        registerLink: 'Register',
        passwordLabel: 'Password',
        newUserText: 'New user?',
        forgotPasswordText: 'Forgot password?',
        welcomeTitle: 'WELCOME BACK!',
        contactMessage: 'If you experience any problems, please contact us.',
        contactLinkText: 'contact',
        injuryText: 'I injury',
        injuryLinkText: 'Injury',
        invalidEmail: 'Please enter a valid email address.',
        missingPassword: 'Please enter your password.',
        shortPassword: 'Password must be at least 6 characters long.',
        emailNotVerified: 'Please verify your email.',
        disabledAccount: 'This account has been disabled. Please contact support.',
        noAccountFound: 'No account found with this email.',
        incorrectPassword: 'Incorrect password. Please try again.',
        blockedAccount: 'This account has been blocked.',
        loginLimitReached: 'You have reached your login limit for this month. Please wait for the next month.',
        successfulLogin: 'Login Successful! You have {attempts} logins left this month.'
    },
    so: {
        loginTitle: 'Galitaanka akaawnta',
        loginBtn: 'Gal',
        emailLabel: 'Email',
        registerLink: 'Diwaangali',
        passwordLabel: 'Erayga Sirta',
        newUserText: 'Ma cusubtahay',
        forgotPasswordText: 'Ma ilowday erayga sirta?',
        welcomeTitle: 'SOO DHOWOW!',
        contactMessage: 'Haddii aad la kulanto wax dhibaato ah, fadlan nala soo xiriir.',
        contactLinkText: 'la xiriir',
        injuryText: 'Anigu dhaawac ayaan ahay',
        injuryLinkText: 'Dhaawac',
        invalidEmail: 'Fadlan geli cinwaanka email saxda ah.',
        missingPassword: 'Fadlan geli erayga sirta ah.',
        shortPassword: 'Erayga sirta ah wuxuu u baahan yahay ugu yaraan 6 xaraf.',
        emailNotVerified: 'Fadlan xaqiiji emailkaaga.',
        disabledAccount: 'Akaawntigan waa la hakiyey. Fadlan la xiriir taageerada.',
        noAccountFound: 'Akaawntan lama helin emailkan.',
        incorrectPassword: 'Erayga sirta ah waa qalad. Fadlan isku day mar kale.',
        blockedAccount: 'Akaawntigan waa la xayiray.',
        loginLimitReached: 'Waxaad gaartay xadka gelitaanka ee bishan. Fadlan sug bilaha soo socda.',
        successfulLogin: 'Gelitaanka guuleystay! Waxaad leedahay {attempts} gelitaan oo ka hadhay bishan.'
    }
};

let currentLanguage = 'en'; // default to English

document.getElementById('languageSelector').addEventListener('change', (event) => {
    currentLanguage = event.target.value;
    translatePage();
});

function translatePage() {
    // Apply translations to page elements
    document.getElementById('login-title').innerText = translations[currentLanguage].loginTitle;
    document.getElementById('email-label').innerText = translations[currentLanguage].emailLabel;
    document.getElementById('password-label').innerText = translations[currentLanguage].passwordLabel;
    document.getElementById('new-user-text').innerHTML = translations[currentLanguage].newUserText;
    document.getElementById('forgot-password-link').innerText = translations[currentLanguage].forgotPasswordText;
    document.getElementById('welcome-title').innerText = translations[currentLanguage].welcomeTitle;
    document.getElementById('contact-message').innerText = translations[currentLanguage].contactMessage;
    document.getElementById('contact-link').innerText = translations[currentLanguage].contactLinkText;
    document.getElementById('injury-text').innerText = translations[currentLanguage].injuryText;
    document.getElementById('injury-link').innerText = translations[currentLanguage].injuryLinkText;
    document.getElementById('loginBtn').innerText = translations[currentLanguage].loginBtn;}
// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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

// Function to get current date as YYYY-MM
function getCurrentMonth() {
    return new Date().toISOString().substring(0, 7); // Example: "2025-03"
}

// Handle Login
document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const succesMessage = document.getElementById('succes-message');

    // Clear previous messages
    errorMessage.style.display = 'none';
    errorMessage.innerText = '';
    succesMessage.style.display = 'none';
    succesMessage.innerText = '';

    // Email format validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        errorMessage.style.display = 'block';
        errorMessage.innerText = translations[currentLanguage].invalidEmail;
        return;
    }

    if (!password) {
        errorMessage.style.display = 'block';
        errorMessage.innerText = translations[currentLanguage].missingPassword;
        return;
    }

    if (password.length < 6) {
        errorMessage.style.display = 'block';
        errorMessage.innerText = translations[currentLanguage].shortPassword;
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            errorMessage.style.display = 'block';
            errorMessage.innerText = translations[currentLanguage].emailNotVerified;
            return;
        }

        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);

        const currentMonth = getCurrentMonth();
        let loginAttempts = 10;

        if (snapshot.exists()) {
            const userData = snapshot.val();

            if (userData.isDisabled) {
                errorMessage.style.display = 'block';
                errorMessage.innerText = translations[currentLanguage].disabledAccount;
                return;
            }

            if (userData.lastLoginMonth && userData.lastLoginMonth === currentMonth) {
                loginAttempts = userData.loginAttempts ?? 10;
            } else {
                loginAttempts = 10; // Reset login attempts for the new month
            }

            if (loginAttempts <= 0) {
                errorMessage.style.display = 'block';
                errorMessage.innerText = translations[currentLanguage].loginLimitReached;
                return;
            }

            loginAttempts--; // Decrease attempts
            await update(userRef, {
                loginAttempts: loginAttempts,
                lastLoginMonth: currentMonth,
                isLoggedIn: true
            });

            alert(translations[currentLanguage].successfulLogin.replace('{attempts}', loginAttempts));
            setTimeout(() => {
                window.location.href = "Academy.html";
            }, 1000);
        } else {
            errorMessage.style.display = 'block';
            errorMessage.innerText = translations[currentLanguage].noAccountFound;
        }
    } catch (error) {
        if (error.code === 'auth/wrong-password') {
            errorMessage.style.display = 'block';
            errorMessage.innerText = translations[currentLanguage].incorrectPassword;
        } else if (error.code === 'auth/user-disabled') {
            errorMessage.style.display = 'block';
            errorMessage.innerText = translations[currentLanguage].blockedAccount;
        } else {
            errorMessage.style.display = 'block';
            errorMessage.innerText = translations[currentLanguage].noAccountFound;
        }
    }
});
