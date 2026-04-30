import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0Q9HUV2XW6kth0ofn4Wgvq1npgPf3V_Y",
  authDomain: "notestaker-ai.firebaseapp.com",
  projectId: "notestaker-ai",
  storageBucket: "notestaker-ai.firebasestorage.app",
  messagingSenderId: "154151322986",
  appId: "1:154151322986:web:19f701c5812eeaf9679113",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();