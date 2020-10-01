import React, { useState, useEffect, useContext } from 'react'

import {PokerContextProvider, PokerContext} from '../store'

import {
    useHistory,
    Link,
    useParams
  } from "react-router-dom";

import styled from 'styled-components'
import { lighten, darken } from 'polished'

import {getCookie, setCookie, deleteCookie} from '../utils/cookies'

import Layout from './Layout'

import AddUser from '../components/AddUser'
import WelcomeUser from '../components/WelcomeUser'
import PokerRoom from '../components/PokerRoom'

import { v4 as uuidv4 } from 'uuid';

const Index = (props) => {

    const [{
        socket,
        username,
        user,
        users,
        rooms,
        messages,
    }, dispatch] = useContext(PokerContext)

    let history = useHistory();
    let { roomid } = useParams();

    useEffect(() => {

        if(roomid){
            socket.emit("check-roomid", roomid);
        }

        socket.on("roomid-exists", (found) => {

            if(found) {

                if(user && roomid == user.room){
                
                    joinRoom(user.room)
                
                }

            } else {
                
                // Reset if room is not registered.

                dispatch({type: 'SET_USERNAME', payload: null})
                dispatch({type: 'SET_USER', payload: null})

                deleteCookie('pv-poker-user')
                history.push(`/poker`)

            }

        });

        socket.on("connect", () => {
            // Do somthing on connect
        });

        socket.on("connected", user => { 

            console.log('connected')

            setCookie('pv-poker-user', JSON.stringify(user))
            
            dispatch({type: 'SET_USER', payload: user})
            
            history.push(`/poker/${user.room}`)

        });

        socket.on("users", users => {
            dispatch({type: 'SET_USERS', payload: users});
        });

        socket.on("users", users => {
            dispatch({type: 'SET_USERS', payload: users});
        });

        socket.on("update-user", (user) => {
            dispatch({type: 'UPDATE_USER', payload: user});
        });

        socket.on("show-rooms", rooms => {
            dispatch({type: 'SET_ROOMS', payload: rooms});
        });

        socket.on("message", message => {
            dispatch({type: 'SET_MESSAGES', payload: message});
        });
    
        socket.on("disconnected", id => {
            dispatch({type: 'DELETE_USER', payload: id});
        });


    }, []);

    const onCreateRoom = (name) => {

        let room = uuidv4()
        
        let data = {
            name: name,
            id: room,
            users: [username]
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
        joinRoom(room.id)
    }

    const onLeaveThenJoinRoom = (room) => (e) => {

        let data = {
            username: username,
            room: room,
        }

        if(user){
            // deleteCookie('xxxx')
            socket.emit("leave", user.room);
            // dispatch({type: 'SET_MESSAGES', payload: []});
        }
        
        socket.emit("join-room", data);

    }

    const leaveRoom = (room) => (e) => {

        deleteCookie('pv-poker-user')
        
        socket.emit("leave", room);

        dispatch({type: 'SET_USER', payload: null})
        // dispatch({type: 'SET_MESSAGES', payload: []});

        history.push(`/poker`)
    }

    return (
        <Layout type="basic">
        {
            (username == null) ? 
                <AddUser />
            : null
        }

        {
            (username && user == null) ? 
                <WelcomeUser 
                    rooms={rooms} 
                    username={username}  
                    onCreateRoom={onCreateRoom}  
                    onJoinRoom={onJoinRoom} />
                : null
        }

        {
            (username && user) ? 
                <PokerRoom 
                    leaveRoom={leaveRoom}  
                    onLeaveThenJoinRoom={onLeaveThenJoinRoom} /> 
                : null
        }
        </Layout>
    )
};

function Poker() {
    return (
        <PokerContextProvider>
            <Index/>
        </PokerContextProvider>
    );
}

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