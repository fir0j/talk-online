import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Sendbox from "./Sendbox.component";
import { Redirect } from "react-router-dom";

let socket;
function Chatscreen({
  room,
  name,
  email,
  setName,
  setRoom,
  setEmail,
  setLoginStatus,
}) {
  const [ENDPOINT] = useState("http://localhost:8080");
  const messagesEndRef = useRef(null);
  const [incoming, setIncoming] = useState("");
  const [incomings, setIncomings] = useState([]);

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
    // eslint-disable-next-line
  }, []);

  // receiving received message to the chat server
  // handling receiving 'chat' event
  useEffect(
    () => {
      socket.on("chat", (incomingChat) => {
        setIncoming(incomingChat);
      });
    },
    []
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
  );

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView();
  };

  useEffect(scrollToBottom, [incomings]);

  const logout = () => {
    setName("");
    setRoom("");
    setEmail("");
    setLoginStatus(false);
    setIncomings([]);
    return <Redirect to="/signin" />;
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          position: "relative",
          border: "2px solid gray",
          width: "100%",
          maxWidth: "960px",
        }}
      >
        <center style={{ backgroundColor: "lightskyblue" }}>talk-online</center>
        <div
          style={{
            display: "flex",
            justifyContent: "center",

            borderBottom: "1px solid gray",
            backgroundColor: "lightblue",
            position: "sticky",
            top: "0",
          }}
        >
          <p>{room}</p>
          <button style={{ marginLeft: "auto" }} onClick={logout}>
            logout
          </button>
        </div>
        <div
          style={{
            overflow: "scroll",
            height: "200px",
          }}
        >
          {incomings.map((msg, index) => {
            if (msg.user === name) {
              return (
                <div
                  key={uuidv4()}
                  style={{
                    backgroundColor: "lightslategray",
                    color: "white",
                  }}
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
          <div ref={messagesEndRef} />
        </div>
        {socket && <Sendbox socket={socket} />}
      </div>
    </div>
  );
}

export default Chatscreen;
