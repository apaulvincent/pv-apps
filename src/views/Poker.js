import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'

import styled from 'styled-components'
import { lighten, darken } from 'polished'

import {getCookie, setCookie, deleteCookie} from '../utils/cookies'

import AddUser from '../components/AddUser'
import WelcomeUser from '../components/WelcomeUser'
import PokerRoom from '../components/PokerRoom'

import { v4 as uuidv4 } from 'uuid';

const path = process.env.NODE_ENV !== 'production' ? `http://localhost:${process.env.REACT_APP_PORT}` : "https://pv-poker.herokuapp.com"

const socket = io(path);

const Poker = (props) => {

    let userCookie = null
    let defaultUsername = null

    if(getCookie('pv-poker-user')){
        userCookie = JSON.parse(getCookie('pv-poker-user'))
        defaultUsername = userCookie.name
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

            setCookie('pv-poker-user', JSON.stringify(user))

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
            // deleteCookie('xxxx')
            socket.emit("leave", user.room);
        }
        
        socket.emit("join-room", data);

    }

    const leaveRoom = (room) => (e) => {

        if(user){

            socket.emit("leave", room);

            deleteCookie('pv-poker-user')
            setUser(null)
        }

    }


    return (
        <div>
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

        <footer>
            <strong>PV-APPS</strong>
        </footer>

        </div>
    )
};

export default Poker;



const Wrapper = styled.div `
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`;


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