import React, { useState, useEffect, useRef } from "react";

const Sendbox = ({ socket }) => {
  const [outgoing, setOutgoing] = useState("");
  // using refs declaration for the below variables
  // because these  variables doesn't contribute for ui rendering
  // and it is not necessary for react to know about these variable state change.
  const isTypingRef = useRef(false);
  const timeoutRef = useRef();

  // user is typing feature
  useEffect(() => {
    function userIsNotTyping() {
      socket.emit("not typing...");
      isTypingRef.current = false;
    }

    if (outgoing !== "") {
      if (isTypingRef.current === false) {
        isTypingRef.current = true;
        console.log("typing");
        socket.emit("typing...", (error) => {
          console.log(error);
        });
        timeoutRef.current = setTimeout(userIsNotTyping, 1000);
      } else {
        // if user is still typing, keep resetting the time interval on every key press
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(userIsNotTyping, 1000);
      }
    }
    // eslint-disable-next-line
  }, [outgoing, socket]);

  const sendMessage = (e) => {
    // event(e) is defaul augument if the function is invoked by an event
    e.preventDefault();
    if (outgoing) {
      socket.emit("chat", outgoing, (error) => {
        console.log(error);
      });
    }

    if (outgoing !== "") {
      setOutgoing("");
    }
  };

  return (
    <form onSubmit={sendMessage}>
      <input
        style={{ width: "100%" }}
        type="text"
        onChange={(e) => setOutgoing(e.target.value)}
        // onKeyPress={(e) => (e.key === 'Enter' ? sendMessage(e) : null)} is not needed for enter key to work when inside form element
        value={outgoing}
        placeholder="Type a message..."
      />
      <input type="submit" value="Send" />
    </form>
  );
};

export default Sendbox;
