import React,{useState} from 'react'

const Sendbox = ({socket}) => {
  
  const [outgoing, setOutgoing] = useState('');


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
      <div className="sendbox">
        <form onSubmit={sendMessage}>
          <input
            type="text"
            onChange={(e) => setOutgoing(e.target.value)}
            // onKeyPress={(e) => (e.key === 'Enter' ? sendMessage(e) : null)} is not needed for enter key to work when inside form element
            value={outgoing}
            placeholder="Type a message..."
          />
          <input type="submit" value="Send" />
        </form>
      </div>
    );
  };

export default Sendbox 