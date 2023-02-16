import { Btn_click } from "components/headers/Header";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import { useRecoilState } from "recoil";
import { MessageType, MessageState } from "recoils/MessageRecoil";

const firebaseConfig = {
  apiKey: "AIzaSyAyMXuKo55mlQMT2L4ByIJAxpiJEsDoZso",
  authDomain: "web-push-9801a.firebaseapp.com",
  projectId: "web-push-9801a",
  storageBucket: "web-push-9801a.appspot.com",
  messagingSenderId: "88902704708",
  appId: "1:88902704708:web:7006276a509629c4b36611",
  measurementId: "G-C3EN50JNBW"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 토큰을 받고, 토큰을 사용해서 메시지 전송
getToken(messaging, {
    vapidKey:
      "BDCqddNZeX4CA16bQrHJ6RrskPkej0RyZfEGfZIQWlX8KmDBysBbtwd_MQNomjV050BCDw-JaXzBLMxPKCGYx_A",
  }).then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      // ...
      console.log(currentToken);
      sessionStorage.setItem("FCMToken", currentToken);
    } else {
      // Show permission request UI
      console.log(
        "No registration token available. Request permission to generate one."
      );
      // ...
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
    // ...
  });




//포그라운드 메시지 수신
onMessage(messaging, (payload) => {
    console.log("on", payload);
    //alert("success");

    const notification = JSON.stringify(payload);

    // 1. data 받고
    // 2. data 왔다구 알려주고
    // 3. modal 띄우려면, view === true

    // const [message, setMessage] = useRecoilState<MessageType>(MessageState);
    
    // setMessage({body: payload.notification?.body, title: payload.notification?.title});

    //sessionStorage.setItem("notification", notification);

    Btn_click({data: notification});
    //window.location.reload();

// ...
});


