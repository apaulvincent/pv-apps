import React, { useState, useEffect, useContext } from 'react'
import {PokerContext} from '../../store'

import styled from 'styled-components'

import Timer from '../Timer'

export default function Cards(props) {

    const [{
        socket,
        user,
        isPlaying,
    }, dispatch] = useContext(PokerContext)

    const [selected, setSelected] = useState(null);

    const [cards, setCards] = useState([ '1', '3', '5', '8', '13', '20', '40', '100', '?', ]);


    useEffect(() => {

        socket.on("reseting", () => {
            setSelected(null)
        });

    }, []);

    const handleSelect = (card) => (e) => {
        socket.emit("on-select-card", card)
        setSelected(card)
    }

    const isDisabled = !(user && user.role == 1)

    return (
      <Wrapper>
        <Deck>
            {
                cards.map(card => (
                    <Card 
                        key={card} 
                        selected={(selected == card)} 
                        disabled={ !isPlaying || selected != null || isDisabled } 
                        onClick={handleSelect(card)}>
                    {card}
                    </Card>
                ))
            }
        </Deck>

        <Controls>
            <Timer 
                time={5}
            />
        </Controls>

      </Wrapper>
    )
}

Cards.defaultProps = {
    user: {},
    onSelect: () => {},
}

const Wrapper = styled.div`
    padding: 15px;
`;

const Deck = styled.div`
    display: block;
    width: 100%;
    max-width: 780px;
    margin: auto;
    text-align: center;
`;

const Card = styled.button`
    display: inline-flex;
    justify-content: center;
    align-items: center;

    width: 100px;
    height: 140px;
    border: 1px solid #0070f3;
    cursor: pointer;
    font-size: 2.6rem;
    border-radius: 6px;
    background: #fff;
    margin: 10px;
    // outline: none;

    &:disabled {
        cursor: not-allowed;
        color: ${(props) => props.selected ? 'inherit' : '#ccc'};
        border: ${(props) => props.selected ? '1px solid #0070f3' : '1px solid #eee'};
    }
`;

const Controls = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;