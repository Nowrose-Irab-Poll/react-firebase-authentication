import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";

const initiazeAuthentication = () => {
    initializeApp(firebaseConfig);
}

export default initiazeAuthentication;