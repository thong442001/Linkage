import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const user = useSelector(state => state.app.user);

    useEffect(() => {
        const newSocket = io('https://linkage.id.vn', {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            timeout: 5000,
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket || !user) return;

        console.log("📡 Gửi sự kiện user_online:", user._id);
        socket.emit("user_online", user._id);

        const handleOnlineUsers = (userList) => {
            console.log("🟢 Danh sách user online:", userList);
            setOnlineUsers(userList);
        };

        socket.on("online_users", handleOnlineUsers);

        return () => {
            console.log("📴 Gửi sự kiện user_offline:", user._id);
            socket.emit("user_offline", user._id);
            socket.off("online_users", handleOnlineUsers);
        };
    }, [socket, user]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

