import { io, Socket } from "socket.io-client";

// TODO: Move to environment variable
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // We connect manually when authenticated or needed
  withCredentials: true,
});

export const connectSocket = () => {
  if (!socket.connected) {
    const token = localStorage.getItem("token");
    if (token) {
      socket.auth = { token };
    }
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
