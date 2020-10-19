import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Sendbox from "./Sendbox.component";
import { Redirect } from "react-router-dom";
import "./chatscreen.component.css";

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
  const [status, setStatus] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  // handling 'connection' and 'disconnect' events
  useEffect(() => {
    socket = io(ENDPOINT);
    if (socket) {
      setStatus("online");
    }
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
      setOnlineUsers(roomMembersPayload.users);
      console.log(roomMembersPayload.users);
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on("typing...", (typingPayload) => {
      setStatus(typingPayload.notification);
    });

    socket.on("not typing...", () => {
      if (status !== "online") setStatus(room);
    });
  }, [status]);

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
    <div className="chat-screen">
      <div className="chat-screen-wrapper">
        <div className="group-members">
          <div>Group Members</div>
          <div>Online ({onlineUsers.length})</div>
          <ul>
            {onlineUsers.map((user) => {
              return <li>{user.name}</li>;
            })}
          </ul>
        </div>

        <div className="messages-wrapper">
          <div className="app-title">
            <div>TalkOnline</div>
            <button onClick={logout}>logout</button>
          </div>
          <div className="infobar">
            <p>{status}</p>
          </div>
          <div className="messages">
            {incomings.map((msg, index) => {
              if (msg.user === name) {
                return (
                  <div key={uuidv4()} className="same-user">
                    <div>
                      {msg.user + " : "}
                      {msg.text}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={uuidv4()} className="other-users">
                    <div>
                      {msg.user + " : "}
                      {msg.text}
                    </div>
                  </div>
                );
              }
            })}
            <div ref={messagesEndRef} />
          </div>
          <div className="sendbox">{socket && <Sendbox socket={socket} />}</div>
        </div>
      </div>
    </div>
  );
}

export default Chatscreen;
