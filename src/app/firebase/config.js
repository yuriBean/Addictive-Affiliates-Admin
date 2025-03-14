import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCZthvsliNwlc6KHjSxhtxhdH6k1QRQPls",
  authDomain: "addictive-affiliates.firebaseapp.com",
  projectId: "addictive-affiliates",
  storageBucket: "addictive-affiliates.firebasestorage.app",
  messagingSenderId: "1059306485902",
  appId: "1:1059306485902:web:601dc8d65ac68050e7f1df"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);