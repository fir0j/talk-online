// const queryString = require('query-string');
import React, { useState, useEffect,useRef } from 'react';
import './App.css';
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:8080';
let socket;
const App = () => {
	// const { name, room } = queryString.parse(location.search);
	// const [ sender ] = useState('firoj');
	let [ payload, setPayload ] = useState('');
	let [ message, setMessage ] = useState();
	const messageRef = useRef('');
	const [ messages, setMessages ] = useState([]);
	const [ name ] = useState('firoj');
	const [ room ] = useState('web development');

	// handling 'connection' and 'disconnect' events
	useEffect(() => {
		socket = io(ENDPOINT);
		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	}, []);

	// connecting to the chat server
	// handling 'join' event
	useEffect(
		() => {
			// socket.emit(event,payload,callback)
			socket.emit('join', { name, room }, (error) => {
				console.log(error);
			});

			socket.on('welcome', (welcomePayload) => {
				// console.log(welcomePayload);
			});

			socket.on('roomMembers', (roomMembersPayload) => {
				// console.log(roomMembersPayload);
			});
		},
		[ name, room ]
	);

	// receiving received message to the chat server
	// handling receiving 'chat' event
	useEffect(
		() => {
			socket.on('chat', (incommingmsg) => {
				messageRef.current = incommingmsg;
				console.log(messageRef.current)
				// setMessage(msg);
			});
		},
		[]
		// run this above code only when message changes
	);

	useEffect(
		() => {
			// console.log(message); // Object { user: "firoj", text: "hmm" }
			// console.log(messageRef.current)
			setMessages([...messages, messageRef.current])
			
		},
		[ message]
		// run this above code only when message changes
	);

	useEffect(
		() => {
			// console.log(messages); // Array [ "" ] . why???
		},
		[ message ]
		// run this above code only when message changes
	);


	// sending message(payload) to the chat server
	// handling sending 'chat' event
	const sendMessage = (e) => {
		// event(e) is defaul augument if the function is invoked by an event
		e.preventDefault();
		if (payload) {
			socket.emit('chat', payload, (error) => {
				console.log(error);
			});
		}
		if (payload !== '') {
			setPayload('');
		}
	};

	return (
		<div className="App">
			{/* {console.log(messages)} */}
			<h1>talk-online</h1>
			<div className="sendbox">
				<form onSubmit={sendMessage}>
					<input
						type="text"
						onChange={(e) => setPayload(e.target.value)}
						// onKeyPress={(e) => (e.key === 'Enter' ? sendMessage(e) : null)} is not needed for enter key to work when inside form element
						value={payload}
						placeholder="Type a message..."
					/>
					<input type="submit" value="Send" />
				</form>
			</div>
		</div>
	);
};

export default App;
