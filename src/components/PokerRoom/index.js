import React, { useState, useEffect, useContext } from 'react'
import {PokerContext} from '../../store'

import styled from 'styled-components'

import { useSpring, animated as anim } from 'react-spring'

import { FiLogOut, FiPlus, FiEye, FiCopy, FiLayers, FiMeh, FiBox } from 'react-icons/fi';

import Cards from './Cards';
import Messenger from './Messenger';

function Flippy({card, playing, slideIn, flipped}) {

    const slide = useSpring({
        opacity: card ? 0 : 1,
        transform: `translateX(${card ? 10 : 0}px)`,
        config: { mass: 5, tension: 500, friction: 80 }
    })

    const flip = useSpring({
        opacity: flipped ? 1 : 0,
        transform: `perspective(700px) rotateY(${flipped ? 180 : 0}deg)`,
        config: { mass: 5, tension: 500, friction: 80 }
    })

    return (
      <anim.div className="mini-card-wrap" style={{ opacity: slide.opacity.interpolate(o => 1 - o), transform: slide.transform }}>
        <anim.div className="back" style={{ opacity: flip.opacity.interpolate(o => 1 - o), transform: flip.transform }}></anim.div>
        <anim.div className="front" style={{ opacity: flip.opacity, transform: flip.transform.interpolate(t => `${t} rotateY(180deg)`) }}>{flipped ? card : ''}</anim.div>
      </anim.div>
    )
}

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


    useEffect(() => {

    }, []);

    const onChangeRole = (role) => (e) => {
        socket.emit("change-role", role);
    };
    
    const moderator = users.find(({role}) => role == 0)
    const players = users.filter(({role}) => role == 1)
    
    const renderPlayerSelectedCard = (card) => {
        return (<Flippy card={card} playing={isPlaying} slideIn={(isPlaying && card)} flipped={(!isPlaying && card)} />)
    };

    const renderPlayers = () => {
        return (
            <ul>
                {players.map(({ name, role, id, card }) => (
                    role == 1 ? <li key={id}><span className="name">{name}</span> {renderPlayerSelectedCard(card)}</li> : null
                ))}
                {
                    players.length == 0 ? <li><NoPlayer>Hey! we need someone here</NoPlayer></li> : null
                }
            </ul>
        )
    };

    let clipboard = null

    const copyToClipboard = () => {

        clipboard.select();
        document.execCommand('copy');
        // clipboard.focus();

    }

    return (
        <div>
            <Wrapper>

                <LeftSideBar>
                        <UserList>
                            <UserListHead>
                                <FiMeh size={28}/>
                                <span>Moderator</span>
                                { (user.role != 0 && !moderator) ? 
                                    <BtnIcon disabled={isPlaying} onClick={onChangeRole(0)}><FiPlus/></BtnIcon> 
                                    : null}
                            </UserListHead>
                            <ul>
                                {
                                    moderator ? <li>{moderator.name}</li> : 
                                                <li><NoPlayer>Hey! we need someone here</NoPlayer></li>
                                }
                            </ul>
                        </UserList>

                        <UserList>
                            <UserListHead>
                                <FiLayers size={28}/>
                                <span>Players</span> 
                                { user.role != 1 ? 
                                <BtnIcon disabled={isPlaying} onClick={onChangeRole(1)}><FiPlus/></BtnIcon> 
                                : null}
                            </UserListHead>
                            { renderPlayers() }
                        </UserList>

                        <UserList>
                            <UserListHead>
                                <FiEye size={28}/>
                                <span>Guests</span> 
                                { user.role != 2 ? 
                                <BtnIcon disabled={isPlaying} onClick={onChangeRole(2)}><FiPlus/></BtnIcon> 
                                : null}
                            </UserListHead>
                            <ul>
                            {users.map(({ name, role, id }) => (
                                role == 2 ? <li key={id}>{name}</li> : null
                            ))}
                            </ul>
                        </UserList>
                </LeftSideBar>

                <Deck>
                    <Cards />
                </Deck>

                <RightSideBar>

                        <RoomListing>
                 
                            {rooms.map( room => {
                                return (
                                    (room.id !== user.room) ? 
                                        null :
                                        <SectionHead key={room.id}> 
                                            <FiBox size={28}/><span>{room.name}</span>
                                        </SectionHead>
                                    )
                            })}
                        
                            <div className="clipboard">
                                <input value={window.location.href} ref={(ref) => clipboard = ref} readOnly/>
                            </div>
                            <div className="ctrl">
                                <ButtonSM onClick={copyToClipboard}>
                                    Share <FiCopy />
                                </ButtonSM>
                                <ButtonSM onClick={props.leaveRoom(user.room)}>
                                    Leave <FiLogOut />
                                </ButtonSM>
                            </div>
                            
                        </RoomListing>


                        <Messenger/>


                </RightSideBar>

            </Wrapper>
        </div>
    )
}

PokerRoom.defaultProps = {
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-content: center;
`;


const LeftSideBar = styled.div`
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    justify-content: flex-start;
    border-right: 1px solid #eee;
    padding: 20px;
`;

const UserListHead = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    span {
        flex-grow: 1;
        font-size: 18px;
        font-weight: bold;
        padding-left: 10px;
    }
`;

const UserList = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 100px;

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        height: 30px;
        margin: 0 0 5px;

        .name {
            margin: 0 0 0 38px;
        }
    }

`;



const RightSideBar = styled.div`
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    justify-content: flex-start;
    align-items: center;
    border-left: 1px solid #eee;
`;


const BtnIcon = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    color: #0070f3;
    padding: 0;
    margin: 0;
    border: 1px solid #0070f3;
    border-radius: 3px;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    width: 32px;
    height: 32px;
    border-radius: 32px;
    outline: none;

    &:hover {
        background: #0070f3;
        color: white;
    }
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
    background: white;
    color: #0070f3;
    padding: 8px 16px;
    border: 1px solid #0070f3;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;

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
    padding: 20px;
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
            cursor: default;
        }
    }

    .clipboard {
        padding: 0 0 10px;
        width: 100%;

        input {
            border: 1px solid #eee;
            width: 100%;
            outline: none;
            padding: 3px 10px;
            border-radius: 4px;
            color: #999;
        }
    }

    .ctrl {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

`;


const NoPlayer = styled.div`
    font-size: 14px;
    color: white;
    background: red;
    padding: 5px 10px;
    border-radius: 4px;
`;


const SectionHead = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 0 10px;

    span {
        flex-grow: 1;
        font-size: 18px;
        font-weight: bold;
        padding-left: 10px;
    }
`;