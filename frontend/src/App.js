import React, { useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const ENDPOINT = 'localhost:8080';

const App = () => {
	useEffect(() => {
		const socket = io(ENDPOINT);
	});

	return (
		<div className="App">
			<h1>talk-online</h1>
			<div className="sendbox">
				<input type="text" name="client" />
				<button>Send</button>
			</div>
		</div>
	);
};

export default App;
