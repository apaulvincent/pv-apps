import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { FiLogOut } from 'react-icons/fi';

export default function PokerRoom(props) {

    const [message, setMessage] = useState("");

    const onMessage = e => {
        e.preventDefault();
        props.onMessage(message);
        setMessage("");
    };

    return (
        <div>
            <Wrapper>

                <Deck>
                    
                </Deck>

                <SideBar>


                        <RoomListing>
                            <h3>Active Rooms</h3>
                            <ul>
                                {props.rooms.map( room => {
                                    return (
                                        room !== props.user.room ? 
                                            <li key={room} onClick={props.onLeaveThenJoinRoom(room)}>{room}</li> :
                                            <li key={room} className="active">{room}</li>
                                        )
                                })}
                            </ul>

                            <ButtonSM onClick={props.leaveRoom(props.user.room)}>
                                Leave Room <FiLogOut />
                            </ButtonSM>
                            
                        </RoomListing>



                        <div>
                            <h6>Moderator</h6>
                            <div>game master</div>
                        </div>

                        <div>
                            <h6>Players</h6>
                            <ul>
                            {props.users.map(({ name, id }) => (
                                <li key={id}>{name}</li>
                            ))}
                            </ul>
                        </div>

                        <div>
                            <h6>Guest</h6>
                            <ul>
                                <li>Guests Here</li>
                            </ul>
                        </div>

                        <Messenger>

                                <h6>Messages</h6>
                                <div id="messages">

                                    {props.messages.map(({ user, date, text }, index) => (
                                    <div key={index} className="row mb-2">
                                            <div className="col-md-2">{user.name}</div>
                                            <div className="col-md-2">{text}</div>
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


                </SideBar>

            </Wrapper>
        </div>
    )
}

PokerRoom.defaultProps = {
    username: '',
    user: {},
    rooms: [],
    onMessage: () => {},
    leaveRoom: () => {},
    onLeaveThenJoinRoom: () => {},
}

const Wrapper = styled.div`
    display: grid;
    grid-gap: 0;
    grid-template-columns: auto 260px;
    grid-template-areas: 
        "c1 c2"
    ;
    height: 100%;
`;

const Deck = styled.div`

`;


const SideBar = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
    border: 1px solid red;
    width: 100%;
    min-height: 300px;
`;


