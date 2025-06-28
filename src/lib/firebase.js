import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1mjh_29ELgYziFPCsAgxUWFk56PApixU",
  authDomain: "financial-women-app-auth.firebaseapp.com",
  projectId: "financial-women-app-auth",
  storageBucket: "financial-women-app-auth.appspot.com",
  messagingSenderId: "282143166748",
  appId: "1:282143166748:web:70a22292e9938059076ad9",
  measurementId: "G-8RVXNW3WPM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
