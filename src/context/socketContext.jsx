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
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 3000,
            reconnectionDelayMax: 10000,
            timeout: 10000,
            autoConnect: true,
            forceNew: false,
            withCredentials: true,
            upgrade: true,
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleOnlineUsers = (userList) => {
            console.log("🟢 Danh sách user online:", userList);
            setOnlineUsers(userList);
        };

        socket.on("online_users", handleOnlineUsers);

        return () => {
            socket.off("online_users", handleOnlineUsers);
        };
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        if (user && user._id) {
            console.log("📡 Gửi sự kiện user_online:", user._id);
            socket.emit("user_online", user._id);
        } else {
            console.log("📴 User logout, ngắt kết nối socket...");
            socket.emit("user_offline");
            socket.disconnect();
            setSocket(null);
        }
    }, [user, socket]);


    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
