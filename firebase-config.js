//Firebase Configuration, Uses Environment Variables for Security
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDtLxz41zxIHOntsyFpMnleBJ4uJhRbIkY",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "creditcardproject-af9bc.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "creditcardproject-af9bc",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "creditcardproject-af9bc.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "359329293910",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:359329293910:web:27a05532c233b70110bdf7",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-RQ9LE8XKRM"
};

firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();