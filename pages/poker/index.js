import { useState, useEffect } from 'react'
import io from 'socket.io-client'

import Head from 'next/head'
import styles from '../../styles/Poker.module.scss'
import Link from 'next/link'

import { parseCookies, setCookie, destroyCookie } from 'nookies'

import styled from 'styled-components'

import AddUser from './AddUser'
import WelcomeUser from './WelcomeUser'
import PokerRoom from './PokerRoom'

import { v4 as uuidv4 } from 'uuid';

const socket = io(process.env.IOPATH);

export default function Poker() {

    let userCookie = parseCookies()
    let defaultUsername = 'null'

    if(userCookie['pv-poker-user']){
        userCookie = JSON.parse(userCookie['pv-poker-user'])
        defaultUsername = userCookie.name
    } else {
        userCookie = null
    }

    const [username, setUsername] = useState(defaultUsername);
    const [user, setUser] = useState(userCookie);

    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {

        if(userCookie){
            joinRoom(userCookie.room)
        }

        socket.on("connect", () => {
            // Do somthing on connect
        });

        socket.on("connected", user => { 

            setCookie(null, 'pv-poker-user', JSON.stringify(user))

            setUser(user);

        });

        socket.on("users", users => {
            setUsers(users);
        });

        socket.on("show-rooms", rooms => {
            setRooms(rooms);
        });

        socket.on("message", message => {
            setMessages(messages => [...messages, message]);
        });
    
        socket.on("disconnected", id => {
            setUsers(users => {
                return users.filter(user => user.id !== id);
            });
        });


    }, []);

    const onMessage = (msg) => {
        socket.emit("send", msg);
    };
  
    const addUser = (user) => {
        setUsername(user);
    };


    const onCreateRoom = (e) => {

        let room = uuidv4()
        
        let data = {
            username: username,
            room: room,
        }

        socket.emit("create-room", data);

    }

    const joinRoom = (room) => {

        let data = {
            username: username,
            room: room,
        }

        socket.emit("join-room", data);

    }

    const onJoinRoom = (room) => (e) => {

        joinRoom(room)

    }

    const onLeaveThenJoinRoom = (room) => (e) => {

        let data = {
            username: username,
            room: room,
        }

        if(user){
            // destroyCookie(null, 'xxxx')
            socket.emit("leave", user.room);
        }
        
        socket.emit("join-room", data);

    }

    const leaveRoom = (room) => (e) => {

        if(user){

            socket.emit("leave", room);

            destroyCookie(null, 'pv-poker-user')
            setUser(null)
        }

    }

    return (
        <div className={styles.container}>
        <Head>
            <title>PV Poker</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        {
            (username == null) ? 
                <AddUser onAddUser={addUser} />
            : null
        }   

        {
            (username && user == null) ? 
                <WelcomeUser rooms={rooms} username={username}  onCreateRoom={onCreateRoom}  onJoinRoom={onJoinRoom} />
                : null
        }

        {
            (username && user) ? 
                <PokerRoom 
                    rooms={rooms} 
                    messages={messages}  
                    username={username}
                    user={user}  
                    users={users}  
                    onMessage={onMessage}  
                    leaveRoom={leaveRoom}  
                    onLeaveThenJoinRoom={onLeaveThenJoinRoom} /> : null
        }

        <footer className={styles.footer}>
            <strong>PV-APPS</strong>
        </footer>

        </div>
    )
}


const Button = styled.button`
    background: white;
    color: #0070f3;    
    padding: 10px 20px;
    border: 1px solid #0070f3;
    border-radius: 3px;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;

    &:hover {
        background: #0070f3;
        color: white;
    }
`;