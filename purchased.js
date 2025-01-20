import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
// Check if the user is logged in and fetch the course data
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userRef = ref(database, `users/${user.uid}/purchases`);
    const purchasedCoursesList = document.getElementById('purchased-courses-list');
    
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const courses = snapshot.val();
        let hasPurchasedCourses = false; // Track if there are any true purchased courses
        purchasedCoursesList.innerHTML = ''; // Clear any previous data

        for (const course in courses) {
          if (courses[course].purchased === true) {
            hasPurchasedCourses = true;

            // Add course to the list
            const li = document.createElement('li');
            li.textContent = course; // Display the course name
            purchasedCoursesList.appendChild(li);

            // Create a button and link for the purchased course with different links
            const courseLinkButton = document.createElement('button');
            courseLinkButton.textContent = 'Go to Course';

            // Check which link to use based on the course name or index
            let courseLink = '';
            if (course === 'Sirta Epic Ta Pes') {
              courseLink = 'video.sss.html';
            } else if (course === 'Ku Baro Premiere Pro') {
              courseLink = 'video.kbpp.html';
            } else {
              courseLink = 'sms.html';
            }

            // Button click event to navigate to the course
            courseLinkButton.onclick = () => {
              window.location.href = courseLink;
              sessionStorage.setItem("koorso", "true")
            };

            purchasedCoursesList.appendChild(courseLinkButton);
          }
        }

        if (!hasPurchasedCourses) {
          purchasedCoursesList.innerHTML = '<li>No purchased courses available yet.</li>';
        }
      } else {
        purchasedCoursesList.innerHTML = '<li>No courses purchased yet.</li>';
      }
    }).catch(error => {
      console.error("Error fetching purchased courses:", error);
      purchasedCoursesList.innerHTML = '<li>Error loading courses. Please try again later.</li>';
    });
  } else {
    alert("Please log in first.");
    window.location.href = "login.html";
  }
});
