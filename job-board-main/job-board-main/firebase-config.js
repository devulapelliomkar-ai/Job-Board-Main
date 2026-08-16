// Firebase SDK (Modular CDN v10+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Your Firebase Configuration (from your project)
const firebaseConfig = {
  apiKey: "AIzaSyBkJqL8pBOPwbjiPOhA0G_0ZQJ-aUHMsk8",
  authDomain: "gcc-careershub.firebaseapp.com",
  projectId: "gcc-careershub",
  storageBucket: "gcc-careershub.firebasestorage.app",
  messagingSenderId: "976155476313",
  appId: "1:976155476313:web:37e850efeb5839bdd00c48",
  measurementId: "G-KGNLLC9NWH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
//const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export for use in other files
//export { auth, db, storage, analytics };
export { auth, db };