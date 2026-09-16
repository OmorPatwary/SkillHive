import { io } from 'socket.io-client';

const socket = io('https://skillhive-74fi.onrender.com', {
  autoConnect: true,
  transports: ['websocket', 'polling'],
});

export default socket;