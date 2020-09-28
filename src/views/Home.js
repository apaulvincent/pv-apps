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

                <ul>
                    <li><NavLink to={`/poker/`}>Poker</NavLink></li>
                    <li><NavLink to={`/im-good/`}>I'm Good</NavLink></li>
                </ul>

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
