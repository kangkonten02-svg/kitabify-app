import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDUrmQ0F3OARRb3wmLbuNGn4y-4P2JqGyo",
  authDomain: "kitabify-84091.firebaseapp.com",
  projectId: "kitabify-84091",
  storageBucket: "kitabify-84091.firebasestorage.app",
  messagingSenderId: "783351430530",
  appId: "1:783351430530:web:2b9dccb30843bea6d7a39b"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
