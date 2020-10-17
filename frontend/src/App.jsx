import React, { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";
import Sendbox from "./components/Sendbox.component";
import { v4 as uuidv4 } from "uuid";

let socket;
const App = () => {
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
      // console.log(welcomePayload);
    });

    socket.on("roomMembers", (roomMembersPayload) => {
      // console.log(roomMembersPayload);
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
        setIncomings([...incomings, incoming]);
      }
    },
    // eslint-disable-next-line
    [incoming]
    // run this above code only when message changes
  );

  const Chatscreen = () => {
    if (incomings.length > 0) {
      return (
        <div
          style={{
            position: "relative",
            border: "2px solid gray",
            width: "265px",
            height: "300px",
          }}
        >
          {incomings.map((msg, index) => {
            if (msg.user === name) {
              return (
                <div
                  key={uuidv4()}
                  style={{ backgroundColor: "lightslategray", color: "white" }}
                >
                  {msg.user + ":"}
                  {msg.text}
                </div>
              );
            } else {
              return (
                <div
                  key={uuidv4()}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    backgroundColor: "lightsteelblue",
                    color: "white",
                  }}
                >
                  <div>
                    {msg.user + ":"}
                    {msg.text}
                  </div>
                </div>
              );
            }
          })}
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="App">
      <h1>talk-online</h1>
      <Chatscreen />
      <Sendbox socket={socket} />
    </div>
  );
};

export default App;
