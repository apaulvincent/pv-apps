import React, {useState, useContext} from 'react';
import styled from 'styled-components'
import { lighten, darken } from 'polished'

const Error404 = (props) => {
    return (
        <Wrapper>
            <div>
                <h2>Error404</h2>
            </div>
        </Wrapper>     
    );
};

export default Error404;



const Wrapper = styled.div `
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    width: 100%;
    color: ${props => lighten(0.6, props.theme.black) };
    background:  ${props => props.theme.main};
    height: 100%;
`;
