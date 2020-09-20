import React, {useState, useContext} from 'react';
import styled from 'styled-components'
import { lighten, darken } from 'polished'
import { NavLink, useHistory, useRouteMatch } from 'react-router-dom'

const Home = (props) => {
    return (
        <Wrapper>
            <div>
                <h2>Home</h2>
                <p><NavLink to={`/poker/`}>Poker</NavLink></p>
                <p><NavLink to={`/im-good/`}>I'm Good</NavLink></p>
            </div>
        </Wrapper>     
    );
};

export default Home;



const Wrapper = styled.div `
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`;
