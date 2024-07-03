import { FormEvent, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [responseMessages, setResponseMessages] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [socketID, setSocketID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [room, setRoom] = useState('');
  const [joinRoom, setJoinRoom] = useState('');

  const socket = useMemo(
    () => io('http://localhost:5000', { withCredentials: true }),
    []
  );

  useEffect(() => {
    socket.on('welcome', () => {
      setSocketID(socket.id!);
    });
    socket.on('response', (val) => {
      setResponseMessages((prev) => [...prev, val]);
    });
  }, [socket]);

  const formSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.length === 0) {
      setErrorMessage('Enter Text');
    } else {
      socket.emit('message', { room, message });
      setMessage('');
      setErrorMessage('');
    }
  };

  const formSubmitRoom = (e: FormEvent) => {
    e.preventDefault();
    socket.emit('join-room', joinRoom);
  };

  return (
    <div className="container mx-auto ">
      <h1 className="text-center font-bold text-5xl my-6">
        Socket.io Tutorial
      </h1>
      <h4 className="text-center font-semibold mb-2">{socketID}</h4>
      <form onSubmit={formSubmitRoom}>
        <input
          type="text"
          value={joinRoom}
          onChange={(e) => {
            setJoinRoom(e.target.value);
          }}
          placeholder="Enter text"
          className="p-1 rounded-md w-full placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="bg-indigo-600 px-3 py-1 text-center font-semibold text-sm inline-block text-white cursor-pointer uppercase transition duration-200 ease-in-out rounded-md hover:bg-indigo-700  active:scale-95"
        >
          Join
        </button>
      </form>
      <form
        onSubmit={formSubmit}
        className="border border-slate-300 max-w-md mx-auto rounded-xl p-5 bg-slate-100 flex items-center gap-2"
      >
        <div>
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setErrorMessage('');
            }}
            placeholder="Enter text"
            className="p-1 rounded-md w-full placeholder:text-slate-400"
          />
          {errorMessage.length > 0 && (
            <p className="text-red text-sm text-red-500">{errorMessage}</p>
          )}
        </div>
        <input
          type="text"
          value={room}
          onChange={(e) => {
            setRoom(e.target.value);
          }}
          placeholder="Enter Room"
          className="p-1 rounded-md w-full placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="bg-indigo-600 px-3 py-1 text-center font-semibold text-sm inline-block text-white cursor-pointer uppercase transition duration-200 ease-in-out rounded-md hover:bg-indigo-700  active:scale-95"
        >
          Send
        </button>
      </form>
      <div>
        <h2 className="font-semibold tracking-widest text-xl underline text-slate-900 py-2">
          Messages:
        </h2>
        {responseMessages.map((val, ind) => (
          <p key={ind} className="text-slate-700 ">
            {val}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
