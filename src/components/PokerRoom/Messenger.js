import React, { useState, useEffect, useContext } from 'react'
import {PokerContext} from '../../store'

import styled from 'styled-components'
import { FiLogOut, FiPlus, FiEye, FiCopy, FiMessageSquare, FiMeh } from 'react-icons/fi';
import { Transition, animated } from 'react-spring/renderprops'

export default function Messenger(props) {

    const [{
        user,
        socket,
        messages,
    }, dispatch] = useContext(PokerContext)

    const [message, setMessage] = useState("");


    useEffect(() => {


    }, [])

    const onMessage = (e) => {
        e.preventDefault();
        socket.emit("send", message);
        setMessage("");
    };

    const userId = user.id;

    const renderChats = () => {
        return messages.map(({ user, date, text }, index) => {

            let pointless = false
            
            if(index < (messages.length - 1)) {
                let next = messages[index+1] 
                if(next.user.id == user.id) {
                    pointless = true
                }
            }

            return (
                user.id == userId ? 
                <div className="chat-item" key={index}>
                    <div className="msg">
                        <div className={`bubble right ${pointless ? 'pointless' : ''}`}>
                            {text}
                        </div>
                    </div>
                </div> : 
                <div className="chat-item" key={index}>
                    <div className="name">
                    {
                        pointless ? null :
                        <div className="avatar" title={user.name}>{user.name[0].toUpperCase()}</div>
                    }
                    </div>
                    <div className="msg">
                        <div className={`bubble left ${pointless ? 'pointless' : ''}`}>
                            {text}
                        </div>
                    </div>
                </div> 
            )
        })
    }

    return (
    <Wrapper>

            <SectionHead> 
                <FiMessageSquare size={28}/> <span>Messages</span>
            </SectionHead>

            <Chats>
                <div className="inner">
                    {renderChats()}
                </div>   
            </Chats>

            <ChatForm>       
                <textarea
                    type="text"
                    onChange={e => setMessage(e.currentTarget.value)}
                    value={message}
                />
                <Button onClick={onMessage} className="btn btn-primary">
                    Send
                </Button>
            </ChatForm> 

    </Wrapper>
    )
}

Messenger.defaultProps = {

}

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    border-top: 1px solid #eee;
    width: 100%;
    height: 100%;
`;

const SectionHead = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 20px 20px 0;

    span {
        flex-grow: 1;
        font-size: 18px;
        font-weight: bold;
        padding-left: 10px;
    }
`;

const Chats = styled.div`
    flex-grow: 1;
    padding: 20px;
    width: 100%;

    .inner {
        height: 100%;
        overflow: auto;
    }

    .chat-item {

        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .name {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        width: 32px;
    }

    .avatar {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
        border-radius: 32px;
        border: 1px solid #ccc;
        font-size: 14px;
    }

    .msg {
        flex-grow: 1;
        padding: 0 15px;
    }

    .bubble {
        position: relative;
        margin-top: 4px;
        padding: 10px;
        font-size: 14px;
        background: #eee;
        border-radius: 4px;
        
        &.right {
            background: #0070f3;
            color: #fff;
        }

        &.left:after {
                content: "";
                position: absolute;
                border: 6px solid transparent;
                border-bottom-color: #eee;
                bottom: 0;
                left: -6px;
        }

        &.right:after {
            content: "";
            position: absolute;
            border: 6px solid transparent;
            border-bottom-color: #0070f3;
            bottom: 0;
            right: -6px;
        }

        &.pointless {
            &.left:after,
            &.right:after {
                display: none;
            }
        }
    }

`;

const ChatForm = styled.div`    
    display: flex;
    justify-content: center;
    align-items: space-between;
    border-top: 1px solid #eee;
    width: 100%;
    padding: 5px;

    textarea {
        border: none;
        resize: none;
        height: 100%;
        flex-grow: 1;
        outline: none;
    }

`;

const Button = styled.button`
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
`;