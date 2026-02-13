import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔥 Senin Firebase yapılandırman
const firebaseConfig = {
  apiKey: "AIzaSyDIE0eDvsjPE1EfFZ34oJGd08kmvVqDfmI",
  authDomain: "waylero-85347.firebaseapp.com",
  projectId: "waylero-85347",
  storageBucket: "waylero-85347.firebasestorage.app",
  messagingSenderId: "410244758789",
  appId: "1:410244758789:web:bb643925a6e8dba48e0b6c",
  measurementId: "G-TK1QY2F8BY", // opsiyonel
};

// Eğer daha önce başlatılmış bir app yoksa başlat
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore export
export const db = getFirestore(app);
