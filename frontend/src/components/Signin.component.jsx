import React from "react";

function Signin({
  name,
  setName,
  room,
  setRoom,
  email,
  setEmail,
  setLoginStatus,
}) {
  const signIn = (e) => {
    // event(e) is defaul augument if the function is invoked by an event
    e.preventDefault();
    if (name !== "" && room !== "" && email !== "") {
      console.log(name, room, email);
      setName(name);
      setRoom(room);
      setEmail(email);
      setLoginStatus(true);
    }
  };

  return (
    <div>
      <form
        onSubmit={signIn}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <label>Name</label>
        <input
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <label>Email</label>
        <input
          type="text"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label>Room</label>
        <input
          type="text"
          name="room"
          onChange={(e) => setRoom(e.target.value)}
          value={room}
        />
        <input type="submit" name="submit" onClick={signIn} value="Signin" />
      </form>
    </div>
  );
}

export default Signin;
