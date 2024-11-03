importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');


firebase.initializeApp({
  // apiKey: "AIzaSyDaYklgKmRF7uVekDvkvXela92BaLm5KiA",
  // authDomain: "dealpay-web.firebaseapp.com",
  // projectId: "dealpay-web",
  // storageBucket: "dealpay-web.appspot.com",
  // messagingSenderId: "475580940916",
  // appId: "1:475580940916:web:7eced12632869a21ab0721",
  // measurementId: "G-D22NNS7RG5"

  apiKey: "AIzaSyAGUMz8AKBfIZOMqvJ17wsqMqegYz41j4M",
  authDomain: "dealpay-asia.firebaseapp.com",
  projectId: "dealpay-asia",
  storageBucket: "dealpay-asia.appspot.com",
  messagingSenderId: "514391861585",
  appId: "1:514391861585:web:88690c64348b88fad7cb70",
});


const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});