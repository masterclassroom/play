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
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userRef = ref(database, `users/${user.uid}/purchases`);
    const purchasedCoursesList = document.getElementById('purchased-courses-list');
    const videoPlayer = document.getElementById('video-player'); // Main video player
    
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const courses = snapshot.val();
        let hasPurchasedCourses = false; // Track if there are any true purchased courses
        purchasedCoursesList.innerHTML = ''; // Clear any previous data

        for (const course in courses) {
          const courseData = courses[course];
          if (courseData.purchased === true) {
            hasPurchasedCourses = true;

            // Create a list item for the course
            const li = document.createElement('li');
            li.textContent = `Course: ${course}`;
            li.style.marginBottom = '10px';

            // Play course video on click
            li.addEventListener('click', () => {
              const hiddenVideo = document.querySelector(
                `#hidden-videos video[data-course="${course}"]`
              );

              if (hiddenVideo) {
                videoPlayer.src = hiddenVideo.querySelector('source').src; // Set video source
                videoPlayer.style.display = 'block'; // Show video player
                videoPlayer.play(); // Auto-play the video
              } else {
                alert("Video not found for this course.");
              }
            });

            purchasedCoursesList.appendChild(li);
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
