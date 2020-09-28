import React, { useState, useEffect, useContext } from 'react'
import {PokerContext} from '../../store'

import styled from 'styled-components'

import { FiLogOut } from 'react-icons/fi';
import Cards from './Cards';

export default function PokerRoom(props) {

    const [{
        socket,
        isPlaying,
        user,
        rooms,
        username,
        messages,
        users,
    }, dispatch] = useContext(PokerContext)


    const [message, setMessage] = useState("");

    useEffect(() => {

    }, []);

    const onMessage = e => {
        e.preventDefault();
        props.onMessage(message);
        setMessage("");
    };


    const onChangeRole = (role) => (e) => {
        socket.emit("change-role", role);
    };
    
    const moderator = users.find(({role}) => role == 0)
    
    
    const renderPlayerSelectedCard = (card) => {
        return (
            (isPlaying && card) ? <span>-</span> : (!isPlaying && card) ? <span>{card}</span>  : null
        )
    };

    const renderPlayers = () => {

        return (
            <ul>
                {users.map(({ name, role, id, card }) => (
                    role == 1 ? <li key={id}>{name} {renderPlayerSelectedCard(card)}</li> : null
                ))}
            </ul>
        )
    };

    return (
        <div>
            <Wrapper>

                <LeftSideBar>

                        <div>
                            <h4>Moderator
                                { (user.role != 0 && !moderator) ? <button disabled={isPlaying} onClick={onChangeRole(0)}>join</button> : null}
                            </h4>
                            {
                                moderator ? <div key={moderator.id}>{moderator.name}</div> : null
                            }
                        </div>

                        <div>
                            <h4>Players 
                                { user.role != 1 ? <button disabled={isPlaying} onClick={onChangeRole(1)}>join</button> : null}
                            </h4>
                            { renderPlayers() }
                        </div>

                        <div>
                            <h4>Guests 
                                { user.role != 2 ? <button disabled={isPlaying} onClick={onChangeRole(2)}>join</button> : null}
                            </h4>
                            <ul>
                            {users.map(({ name, role, id }) => (
                                role == 2 ? <li key={id}>{name}</li> : null
                            ))}
                            </ul>
                        </div>


                </LeftSideBar>

                <Deck>
                    <Cards />
                </Deck>

                <RightSideBar>

                        <RoomListing>
                            
                            <h3>Other Rooms</h3>
                            <ul>
                                {rooms.map( room => {
                                    return (
                                        (room.id !== user.room) ? 
                                            <li key={room.id} onClick={props.onLeaveThenJoinRoom(room.id)}>{room.name}</li> :
                                            null
                                        )
                                })}
                            </ul>

                            <h3>Current Room</h3>
                            <ul>
                                {rooms.map( room => {
                                    return (
                                        (room.id !== user.room) ? 
                                            null :
                                            <li key={room.id} className="active">{room.name}</li>
                                        )
                                })}
                            </ul>

                            <ButtonSM onClick={props.leaveRoom(user.room)}>
                                Leave Room <FiLogOut />
                            </ButtonSM>
                            
                        </RoomListing>

                        <Messenger>

                                <h6>Messages</h6>
                                <div id="messages">

                                    {messages.map(({ user, date, text }, index) => (
                                    <div key={index}>
                                            <div>{user.name}</div>
                                            <div>{text}</div>
                                    </div>
                                    ))}

                                </div>

                                <input
                                    type="text"
                                    onChange={e => setMessage(e.currentTarget.value)}
                                    value={message}
                                />
                                <button onClick={onMessage} className="btn btn-primary">
                                    Send
                                </button>

                        </Messenger>


                </RightSideBar>

            </Wrapper>
        </div>
    )
}

PokerRoom.defaultProps = {
    onMessage: () => {},
    leaveRoom: () => {},
    onLeaveThenJoinRoom: () => {},
}

const Wrapper = styled.div`
    display: grid;
    grid-gap: 0;
    grid-template-columns: 260px auto 260px;
    grid-template-areas: 
        "c1 c2 c3"
    ;
    height: 100%;
`;

const Deck = styled.div`

`;


const LeftSideBar = styled.div`
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    justify-content: flex-start;
    border-right: 1px solid #eee;
`;

const RightSideBar = styled.div`
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    justify-content: flex-start;
    align-items: center;
    border-left: 1px solid #eee;
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

const ButtonSM = styled.button`
    display: flex;
    align-items: center;
    background: white;
    color: #0070f3;
    padding: 5px 10px;
    border: 1px solid #0070f3;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
        background: #0070f3;
        color: white;
    }

    svg {
        margin-left: 10px;
    }
`;

const RoomListing = styled.div`
    margin: 0;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 320px;

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

        &.active {
            color: #666;
            background: #eee;
            cursor: default;
        }
    }

`;


const Messenger = styled.div`
    border-top: 1px solid #eee;
    width: 100%;
    min-height: 300px;
`;


