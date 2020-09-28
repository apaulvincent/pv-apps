import React, {useState, useContext} from 'react';
import styled from 'styled-components'

const BasicLayout = ({children}) => {

    return (
        <Wrapper>
            {children}
            <Footer>
                <span>
                    PV-APPS
                </span>
            </Footer>
        </Wrapper>
    );
};


export default BasicLayout;

const Wrapper = styled.div `
    min-height: 100vh;
    display: grid;
    grid-gap: 0;
    grid-template-rows: 
    auto 40px;
    grid-template-areas: 
        "c1"
        "c2"
    ;
`;

const Footer = styled.div `
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #eee;
    font-size: 14px;
    font-weight: bold;

    & a {
        display: flex;
        justify-content: center;
        align-items: center;
    }

`;