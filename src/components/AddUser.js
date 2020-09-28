import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'

import {
    useHistory,
    Link,
    useParams
  } from "react-router-dom";

import {PokerContext} from '../store'

export default function AddUser(props) {
    
    let { roomid } = useParams();

    const [{
        socket,
        username,
    }, dispatch] = useContext(PokerContext)

    const [user, setUsername] = useState('');

  
    const addUsername = e => {

        e.preventDefault();

        if(user == '') return;

        if(roomid) {

            let data = {
                username: user,
                room: roomid,
            }
    
            socket.emit("join-room", data);

        } else {

            socket.emit("set-username")
        }

        dispatch({type: 'SET_USERNAME', payload: user});

    };

    const handleKeyDown = (e) => {

        if (e.key === 'Enter') {
            addUsername(e)
        }
    }

    return (
      <Wrapper>

        <Title>POKER</Title>

        <FormWrap>
            <input
                type="text"
                onChange={e => {setUsername(e.currentTarget.value)}}
                onKeyDown={handleKeyDown}
                placeholder="Your name please?"
                value={user}
            />
            <Button onClick={addUsername}>
                Go
            </Button>
        </FormWrap>


      </Wrapper>
    )
}

AddUser.defaultProps = {
  onAddUser: () => {},
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Title = styled.h1`
    margin: 0 0 0.4em;
    line-height: 1.15;
    font-size: 4rem;
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

const FormWrap = styled.div`
    padding: 5px;
    border: 1px solid #eee;
    border-radius: 3px;
    cursor: pointer;

    input {
        border: none;
        padding: 10px;
        outline: none;
        font-size: 18px;
    }
`;