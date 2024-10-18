// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiYtVEosyg1_G5atFFj9pdSvOhNNeGxlc",
  authDomain: "shrinkly-1c5b8.firebaseapp.com",
  projectId: "shrinkly-1c5b8",
  storageBucket: "shrinkly-1c5b8.appspot.com",
  messagingSenderId: "313826100432",
  appId: "1:313826100432:web:94f522a15249e9b8984ad5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);


// Initialize Firestore
const firestore = getFirestore(app);

if(process.env.NODE_ENV === "development"){
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
    connectFirestoreEmulator(firestore, "127.0.0.1", 8080);

}

// Export the initialized Firebase services
export { app, auth, firestore };
