import React, { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";
import Chatscreen from "./components/Chatscreen.component";

let socket;
const App = () => {
  // http://localhost:3000/?name=firoj&room=web
  const queryString = require("query-string");
  const url = queryString.parse(window.location.search);
  const [name] = useState(url.name);
  const [room] = useState(url.room);

  const [incoming, setIncoming] = useState("");
  const [incomings, setIncomings] = useState([]);
  const [ENDPOINT] = useState("http://localhost:8080");

  // handling 'connection' and 'disconnect' events
  useEffect(() => {
    socket = io(ENDPOINT);
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT]);

  // connecting to the chat server
  // handling 'join' event
  useEffect(() => {
    // socket.emit(event,payload,callback)
    socket.emit("join", { name, room }, (error) => {
      console.log(error);
    });

    socket.on("welcome", (welcomePayload) => {
      setIncoming(welcomePayload);
    });
    socket.on("byebye", (byebyePayload) => {
      setIncoming(byebyePayload);
    });
    socket.on("roomMembers", (roomMembersPayload) => {
      console.log(roomMembersPayload);
    });
  }, [name, room]);

  // receiving received message to the chat server
  // handling receiving 'chat' event
  useEffect(
    () => {
      socket.on("chat", (incomingChat) => {
        // currentMessageRef.current = incommingChat;
        if (incomingChat !== "") {
          // console.log({ ...incomingChat, id: uuidv4() });
          setIncoming(incomingChat);
        }
        // console.log(incommingChat)
      });
    },
    [incoming]
    // run this above code only when message changes
  );

  useEffect(
    () => {
      if (incoming === "") {
        setIncomings([]);
      } else {
        setIncomings(incomings.concat(incoming));
      }
    },
    // eslint-disable-next-line
    [incoming]
    // run this above code only when message changes
  );

  return (
    <div className="App">
      <h1>talk-online</h1>
      <Chatscreen
        incomings={incomings}
        name={name}
        room={room}
        socket={socket}
      />
    </div>
  );
};

export default App;
