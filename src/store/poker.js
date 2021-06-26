import React, {createContext, useReducer, useEffect} from 'react'
import io from 'socket.io-client'
import {getCookie, setCookie, deleteCookie} from '../utils/cookies'

import { useParams } from "react-router-dom";

export const PokerContext = createContext();

const initialState = {
    username: null,
    user: null,
    users: [],
    rooms: [],
    messages: [],
    socket: null,
    isPlaying: false
}

const reducer = (state, action) => {

    switch(action.type){

        case 'SET_USERNAME':
        return {
            ...state,
            username: action.payload
        }
        case 'SET_USER':
        return {
            ...state,
            user: action.payload
        }
        case 'SET_USERS':
        return {
            ...state,
            users: action.payload
        }
        case 'DELETE_USER':
        let userObj = state.users.filter(user => user.id != action.payload);
        return {
            ...state,
            users: userObj
        }
        case 'ADD_USER':
        return {
            ...state,
            users: [
                ...state.users,
                action.payload
            ]
        }
        case 'UPDATE_USER':
        return {
            ...state,
            user: action.payload,
        }
        case 'SET_ROOMS':
        return {
            ...state,
            rooms: action.payload
        }
        case 'SET_MESSAGES':
        return {
            ...state,
            messages: [
                ...state.messages,
                action.payload
            ]
        }
        case 'TOGGLE_PLAY':
        return {
            ...state,
            isPlaying: action.payload
        }
            
		default:
		return state;
    }
}


let userCookie = null
let defaultUsername = null
let init = false;

const PokerContextProvider = ({children}) => {

    const path = process.env.NODE_ENV !== 'production' ? `http://localhost:${process.env.REACT_APP_PORT}` : "https://pv-poker.herokuapp.com"
    const socket = io(path);

    let { roomid } = useParams();

    initialState.socket = socket

    // Trigger only once...
    if(!init && getCookie('pv-poker-user') && roomid){

        userCookie = JSON.parse(getCookie('pv-poker-user'))
        defaultUsername = userCookie.name
        initialState.user = userCookie
        initialState.username = defaultUsername

        init = true
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <PokerContext.Provider value={[state, dispatch]}>
            {children}
        </PokerContext.Provider>
    )
}

export default PokerContextProvider