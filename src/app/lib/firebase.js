import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyC1mjh_29ELgYziFPCsAgxUWFk56PApixU",
  authDomain: "financial-women-app-auth.firebaseapp.com",
  projectId: "financial-women-app-auth",
  storageBucket: "financial-women-app-auth.firebasestorage.app",
  messagingSenderId: "282143166748",
  appId: "1:282143166748:web:70a22292e9938059076ad9",
  measurementId: "G-8RVXNW3WPM"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth (needed for login/sign-up)
const auth = getAuth(app);

// Optional: Initialize Analytics
const analytics = getAnalytics(app);

// Export auth for use in other files
export { auth };
