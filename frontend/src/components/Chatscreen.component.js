import React,{useEffect,useRef} from 'react'
import { v4 as uuidv4 } from "uuid";
import Sendbox from './Sendbox.component'


function Chatscreen({incomings, room, name, socket}){
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView();
    };
    useEffect(scrollToBottom,[incomings])
    
    return (
      <div
        style={{
          position: "relative",
          border: "2px solid gray",
          width: "400px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            borderBottom: "1px solid gray",
            backgroundColor: "lightskyblue",
          }}
        >
          <p>{room}</p>
        </div>
        <div className="messagesWrapper">
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
          <div ref={messagesEndRef} />
          <Sendbox socket={socket}/>
        </div>
      </div>
    );
  };

  export default Chatscreen