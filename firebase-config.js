// Firebase Configuration
// Your Firebase credentials (safe to include in public app)

const firebaseConfig = {
  apiKey: "AIzaSyDtLxz41zxIHOntsyFpMnleBJ4uJhRbIkY",
  authDomain: "creditcardproject-af9bc.firebaseapp.com",
  projectId: "creditcardproject-af9bc",
  storageBucket: "creditcardproject-af9bc.firebasestorage.app",
  messagingSenderId: "359329293910",
  appId: "1:359329293910:web:27a05532c233b70110bdf7",
  measurementId: "G-RQ9LE8XKRM"
};
try {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

let auth = null;

setTimeout(() => {
  auth = firebase.auth();
  console.log("Firebase Auth ready");
}, 100);
