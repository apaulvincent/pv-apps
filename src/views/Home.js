import React, {useState, useContext} from 'react';
import styled from 'styled-components'
import { lighten, darken } from 'polished'
import { NavLink, useHistory, useRouteMatch } from 'react-router-dom'

import Layout from './Layout'

const Home = (props) => {
    return (
        <Layout type="basic">

            <Wrapper>

            <Title>Mini Apps</Title>

                <Pills>
                    <li className="pill"><NavLink to={`/poker/`}>Poker</NavLink></li>
                    <li className="pill"><NavLink to={`/roulette`}>Roulette</NavLink></li>
                    {/* <li><NavLink to={`/im-good/`}>I'm Good</NavLink></li> */}
                </Pills>

            </Wrapper>

        </Layout>     
    );
};

export default Home;

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

const Pills = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: rows;
    align-items: center;
    list-style-type: none;
    margin: 0;
    padding: 0;

    .pill a {
        display: flex;
        justify-content: center;
        flex-direction: rows;
        align-items: center;
        background: white;
        color: #0070f3;
        padding: 10px 20px;
        border: 1px solid #0070f3;
        border-radius: 3px;
        cursor: pointer;
        font-size: 16px;
        margin: 0 3px;
    
        &:hover {
            background: #0070f3;
            color: white;
        }
    }

`;
