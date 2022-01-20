import { useEffect, useRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { formatRelative } from "date-fns";
import Image from "next/image";

export default function ChatRoom(props) {
  const db = props.db;
  const dummySpace = useRef();
  const { uid, displayName, photoURL } = props.user;
  const [Chat12, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  useEffect(() => {
    db.collection("Chat12")
      .orderBy("createdAt")
      .limit(100)
      .onSnapshot((querySnapShot) => {
        const data = querySnapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMessages(data);
      });
  }, [db]);

  const handleSubmit = (e) => {
    e.preventDefault();

    db.collection("Chat12").add({
      text: newMessage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
      photoURL,
    });

    setNewMessage("");

    dummySpace.current.scrollIntoView({ behavor: "smooth" });
  };

  return (
    <main id="chat_room">
      <ul>
        {Chat12.map((message) => (
          <li key={message.id} className={message.uid === uid ? "sent" : "received"}>
            <section>
              {message.photoURL ? (
                <Image
                  src={message.photoURL}
                  alt="Avatar"
                  width={45}
                  height={45}
                />
              ) : null}
            </section>

            <section>
              <p>{message.text}</p>
              {message.displayName ? <span>{message.displayName}</span> : null}
              <br />
              {message.createdAt?.seconds ? (
                <span>
                  {formatRelative(
                    new Date(message.createdAt.seconds * 1000),
                    new Date()
                  )}
                </span>
              ) : null}
            </section>
          </li>
        ))}
      </ul>
      <section ref={dummySpace}></section>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
        />

        <button type="submit" disabled={!newMessage}>
          Send
        </button>
      </form>
    </main>
  );
}
