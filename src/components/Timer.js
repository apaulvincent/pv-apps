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
                <button onClick={start}>Start</button> : null
            }
            {
                time == 0 && !isPlaying ? 
                <button  onClick={reset}>Reset</button> : null
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

            {
                (user.role == 0) ? 
                controllers()
                : null
            }

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
`;
