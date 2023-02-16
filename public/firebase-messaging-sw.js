// importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-messaging.js');

importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.13.0/firebase-messaging-compat.js');

const config =  { 
  apiKey: "AIzaSyAyMXuKo55mlQMT2L4ByIJAxpiJEsDoZso",
  authDomain: "web-push-9801a.firebaseapp.com",
  projectId: "web-push-9801a",
  storageBucket: "web-push-9801a.appspot.com",
  messagingSenderId: "88902704708",
  appId: "1:88902704708:web:7006276a509629c4b36611",
  measurementId: "G-C3EN50JNBW"
}; 

firebase.initializeApp(config);
const messaging = firebase.messaging();

// self.addEventListener('fetch', event => {
//   console.log("service-worker");
//   event.waitUntil(async function() {
//     // 클라이언트에 액세스 할 수없는 경우 일찍 종료합니다.
//     // 예, 교차 출처 인 경우.
//     if (!event.clientId) return;

//     // 클라이언트를 가져옵니다.
//     const client = await clients.get(event.clientId);
//     // 클라이언트를 얻지 못하면 일찍 종료합니다.
//     // 예, 닫힌 경우.
//     if (!client) return;

//     // 클라이언트에 메시지를 보냅니다.
//     client.postMessage({
//       msg: "ddddd",
//       url: event.request.url
//     });

//   }());
// });

addEventListener('fetch', (event) => {
  event.waitUntil((async () => {
    // Exit early if we don't have access to the client.
    // Eg, if it's cross-origin.
    if (!event.clientId) return;

    // Get the client.
    const client = await clients.get(event.clientId);
    // Exit early if we don't get the client.
    // Eg, if it closed.
    if (!client) return;

    // Send a message to the client.
    client.postMessage({
      msg: "Hey I just got a fetch from you!",
      url: event.request.url
    });

  })());
});


// 백그라운드 서비스워커 설정
// 백그라운드 메시지 자체가 notification임
// 안에 notification을 사용하면 두번뜸
messaging.onBackgroundMessage((payload) => {

  console.log(
    "off",
    payload
  );

  const notification = JSON.stringify(payload);

  // Customize notification here
  // const notificationTitle = "Background Message Title";
  // const notificationOptions = {
  //    body: payload,
  //    icon: "/firebase-logo.png",
  // };
  // self.registration.showNotification(notificationTitle, notificationOptions);
  
});