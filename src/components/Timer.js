import React, { useState, useEffect, useContext } from 'react'
import {PokerContext} from '../store'

import styled from 'styled-components'

let timer = null

export default function Timer(props) {

    const [{
        socket,
        user,
        isPlaying,
    }, dispatch] = useContext(PokerContext)


    let defaultTime = props.time + 2

    const [time, setTime] = useState(defaultTime);

    useEffect(() => {

        if(isPlaying) {

            timer = setInterval( () => {

                if(time != 0) {
    
                    setTime(time - 1);
    
                } else {
    
                    clearInterval(timer)
                    stop()
                }
    
            }, 1000)

        }

        socket.on("playing", () => {
            dispatch({ type: 'TOGGLE_PLAY', payload: true});
        });

        socket.on("stop-playing", () => {
            dispatch({ type: 'TOGGLE_PLAY', payload: false});
        });

        socket.on("stop-playing", () => {
            dispatch({ type: 'TOGGLE_PLAY', payload: false});
        });

        socket.on("reseting", () => {
            setTime(defaultTime)
        });

        return () => clearInterval(timer);

    }, [isPlaying, time])


    const start = () => {
        socket.emit("start-play", user.room)
    }

    const reset = () => {
        socket.emit("reset-play", user.room)
    }

    const stop = () => {
        socket.emit("stop-play", user.room)
    }

    const controllers = () => (
        <div>
            {
                !isPlaying && time != 0  ? 
                <StartButton onClick={start}>Start</StartButton> : null
            }
            {
                time == 0 && !isPlaying ? 
                <ResetButton  onClick={reset}>Reset</ResetButton> : null
            }
        </div>
    )

    return (
      <Wrapper>
        <h1>
            {
                // !isPlaying ? props.time :
                time == defaultTime ? 'Ready?' : 
                time == (defaultTime - 1) ? 'Go!' : time
            }
        </h1>
        <BtnWrap>
            {
                (user.role == 0) ? 
                controllers()
                : null
            }
        </BtnWrap>
      </Wrapper>
    )
}

Timer.defaultProps = {

}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    h1 {
        font-size: 40px;
    }
`;

const BtnWrap = styled.div`
    height: 100px;
`;


const StartButton = styled.button`
    background: white;
    color: #0070f3;
    padding: 0;
    border: 1px solid #0070f3;
    border-radius: 3px;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    width: 100px;
    height: 100px;
    border-radius: 100px;
    outline: none;

    &:hover {
        background: #0070f3;
        color: white;
    }
`;

const ResetButton = styled.button`
    background: white;
    color: #0070f3;
    padding: 0;
    border: 1px solid #0070f3;
    border-radius: 3px;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    width: 100px;
    height: 100px;
    border-radius: 100px;
    outline: none;

    &:hover {
        background: #0070f3;
        color: white;
    }
`;