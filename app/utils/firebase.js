// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyAGUMz8AKBfIZOMqvJ17wsqMqegYz41j4M",
  authDomain: "dealpay-asia.firebaseapp.com",
  projectId: "dealpay-asia",
  storageBucket: "dealpay-asia.appspot.com",
  messagingSenderId: "514391861585",
  appId: "1:514391861585:web:88690c64348b88fad7cb70",
};

// Initialize Firebase
const app = typeof window !== 'undefined' && initializeApp(firebaseConfig);
export const messaging = typeof window !== 'undefined' && getMessaging(app);

export const generateToken = async () => {
  const permission = typeof window !== 'undefined' && await Notification.requestPermission();
  if (permission === 'granted') {
    const token = await getToken(messaging, {
      vapidKey: "BCDTLAY1yjughhgWLBYviuZKvnHWkX_W38oIAHOIFe4ouY6UkWr3PTK3Qrq_trvG5zYlJwSSx6VCO4xnSqqUOso"
    })
    return token
  }
}