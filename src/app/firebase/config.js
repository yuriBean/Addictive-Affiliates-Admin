import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let app, db, auth;

const firebaseConfig = {
  apiKey: "AIzaSyDVYUj4AIOMr3XvQdAFwUkNyEJzOJd9Dpw",
  authDomain: "addictive-affiliates-33c65.firebaseapp.com",
  projectId: "addictive-affiliates-33c65",
  storageBucket: "addictive-affiliates-33c65.firebasestorage.app",
  messagingSenderId: "839807598255",
  appId: "1:839807598255:web:1434c21cec210e0a605e5a"
};

 app = initializeApp(firebaseConfig);
 auth = getAuth(app);
 db = getFirestore(app);

 export { app, db, auth }