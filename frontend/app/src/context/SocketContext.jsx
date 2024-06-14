// import { createContext, useContext, useEffect, useState } from "react";
// import { useAuth } from "./AuthContext";
// import { io } from "socket.io-client";

// const SocketContext = createContext();

// export const useSocketContext = () => {
//   return useContext(SocketContext);
// };

// export const SocketContextProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const { currentUser } = useAuth();

//   useEffect(() => {
//     if (currentUser) {
//       const socket = io(
//         import.meta.env.VITE_NODE_ENV !== "production"
//           ? import.meta.env.VITE_DEV_SERVER_BASE_URL
//           : import.meta.env.VITE_PROD_SERVER_BASE_URL,
//         {
//           withCredentials: true,
//           query: {
//             userId: currentUser.id,
//           },
//         }
//       );

//       setSocket(socket);

//       socket.on("getOnlineUsers", (users) => {
//         setOnlineUsers(users);
//       });

//       return () => socket.close();
//     } else {
//       if (socket) {
//         socket.close();
//         setSocket(null);
//       }
//     }
//   }, [currentUser]);

//   return (
//     <SocketContext.Provider value={{ socket, onlineUsers }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
