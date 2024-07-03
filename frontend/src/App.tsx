import { io } from 'socket.io-client';

function App() {
  const socket = io('http://localhost:5000');

  return <div>Hello Vite!</div>;
}

export default App;
