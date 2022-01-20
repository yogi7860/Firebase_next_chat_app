import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import ChatRoom from "../Components/ChatRoom";

if (!firebase.apps.length) {
  firebase.initializeApp({
  apiKey: "AIzaSyCSq1Osue2vbeuMWIA8ErDAQwzZTHvbUE0",
  authDomain: "chat-app-786-4f52f.firebaseapp.com",
  projectId: "chat-app-786-4f52f",
  storageBucket: "chat-app-786-4f52f.appspot.com",
  messagingSenderId: "683514301429",
  appId: "1:683514301429:web:b8308e83589aacf76aeebc",
  measurementId: "G-4WWPLPN48E"
});
} else {
  firebase.app(); 
}

const auth = firebase.auth();
const db = firebase.firestore();

export default function Home() {
  const [user, setUser] = useState(() => auth.currentUser);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);
  
  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.useDeviceLanguage();
    try {
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="container">
      <main>
        {user ? (
          <>
            <nav id="sign_out">
              <h2>Chat With Friends</h2>
              <button onClick={signOut}>Sign Out</button>
            </nav>
            <ChatRoom user={user} db={db} />
          </>
        ) : (
          <section id="sign_in">
            <h1>Welcome to Chat Room</h1>
            <button onClick={signInWithGoogle}>Sign In With Google</button>
          </section>
        )}
      </main>
    </div>
  );
}
