import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmCnM4buBLharowrBIe5qVONH8_1_L2RQ",
  authDomain: "goodyesp32.firebaseapp.com",
  databaseURL: "https://goodyesp32-default-rtdb.firebaseio.com",
  projectId: "goodyesp32",
  storageBucket: "goodyesp32.appspot.com",
  messagingSenderId: "492431213703",
  appId: "1:492431213703:web:25ccc23b7fc9107b2be422",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence);
