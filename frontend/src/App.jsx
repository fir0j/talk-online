import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Chatscreen from "./components/Chatscreen.component.jsx";
import Signin from "./components/Signin.component.jsx";

const App = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("web");
  const [email, setEmail] = useState("user@gmail.com");
  const [loginStatus, setLoginStatus] = useState(false);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/signin" />
          </Route>
          <Route exact path="/signin">
            {loginStatus ? (
              <Chatscreen
                name={name}
                room={room}
                email={email}
                setName={setName}
                setRoom={setRoom}
                setEmail={setEmail}
                setLoginStatus={setLoginStatus}
              />
            ) : (
              <Signin
                name={name}
                room={room}
                email={email}
                setName={setName}
                setRoom={setRoom}
                setEmail={setEmail}
                setLoginStatus={setLoginStatus}
              />
            )}
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
