import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

export default function WelcomeUser(props) {

  
    const addUsername = e => {

        e.preventDefault();

    };
  
    return (
      <Wrapper>

        <Title> Hello {props.username}!</Title>
        
        <Button onClick={props.onCreateRoom}>Create Room</Button>

        {
            props.rooms.length > 0 ? 
            <RoomListing>

                <span className="or">or</span>

                <h3>Join a Room</h3>

                <ul>
                    {props.rooms.map( room => (
                        <li key={room} onClick={props.onJoinRoom(room)}>{room}</li>
                    ))}
                </ul>
            </RoomListing> : null
        }

      </Wrapper>
    )
}

WelcomeUser.defaultProps = {
    username: '',
    rooms: [],
    onCreateRoom: () => {},
    onJoinRoom: () => {},
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

const RoomListing = styled.div`
    margin: 30px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 320px;

    .or {
        color: #fff;
        background: #0070f3;
        display: inline-block;
        width: 32px;
        height: 32px;
        line-height: 30px;
        vertical-align: middle;
        border-radius: 24px;
        text-align: center;
    }

    ul {
        width: 100%;
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    li {
        cursor: pointer;
        border: 1px solid #eee;
        color: #0070f3;
        padding: 5px 10px;
        border-radius: 4px;
        margin: 0 0 5px;

        &:hover {
            color: #fff;
            background: #0070f3;
        }
    }

`;