import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMvvyeiAUECARPrKG9zpPbfvUmKHbnPrE",
  authDomain: "ai-kos.firebaseapp.com",
  projectId: "ai-kos",
  storageBucket: "ai-kos.firebasestorage.app",
  messagingSenderId: "746020749538",
  appId: "1:746020749538:web:abdacd81b878862b549ebb",
  measurementId: "G-5JYFR7VQ66"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };