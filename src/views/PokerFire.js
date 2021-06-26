import React, { useState, useEffect, useContext } from 'react'

import firbase, {firestore, auth} from '../service/firebase'

import {useAuthState} from "react-firebase-hooks/auth"
import {useCollectionData} from "react-firebase-hooks/firestore"



import {PokerFireContextProvider, PokerFireContext} from '../store'

import {
    useHistory,
    Link,
    useParams
  } from "react-router-dom";

import styled from 'styled-components'
import { lighten, darken } from 'polished'

import {getCookie, setCookie, deleteCookie} from '../utils/cookies'

import Layout from './Layout'


import { v4 as uuidv4 } from 'uuid';

const Index = (props) => {

    let history = useHistory();

    const [user] = useAuthState(auth)


    useEffect(() => {


    }, []);

    return (
        <Layout type="basic">
            <div>
                { user ? <ChatRoom/> : <SignIn/>} 
            </div>
        </Layout>
    )
};

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firbase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
    }

    return (
        <button onClick={signInWithGoogle}>Sign In</button>
    )
}

function SignOut(){
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>Sign Out</button>
    )
}

function ChatRoom() {

    const roomsRef = firestore.collection('rooms')
    const query = roomsRef.orderBy('name').limit(20)

    const [rooms] = useCollectionData(query, {idField: 'id'})

    return (
        <div>
            
            {rooms && rooms.map(room => (<ChatMessage key={room.id} room={room}>{room.name}</ChatMessage>))}

        </div>
    )
}


function ChatMessage(props){

    // cosnt {text, uid} = props.room

    console.log(props)

    return (
        <div>
            {props.room.name}
        </div>
    )


}




function PokerFire() {
    return (
        <PokerFireContextProvider>
            <Index/>
        </PokerFireContextProvider>
    );
}

export default PokerFire;