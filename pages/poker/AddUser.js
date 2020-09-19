import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

export default function AddUser(props) {

    const [username, setUsername] = useState('');

  
    const addUsername = e => {

        e.preventDefault();

        if(username == '') return;
        
        props.onAddUser(username);

    };
  
    return (
      <Wrapper>

        <Title>POKER</Title>

        <FormWrap>
            <input
                type="text"
                onChange={e => {setUsername(e.currentTarget.value)}}
                placeholder="Your name please?"
                value={username}
            />
            <Button onClick={addUsername}>
                Go
            </Button>
        </FormWrap>


      </Wrapper>
    )
}

AddUser.defaultProps = {
  onAddUser: () => {},
}

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

const FormWrap = styled.div`
    padding: 5px;
    border: 1px solid #eee;
    border-radius: 3px;
    cursor: pointer;

    input {
        border: none;
        padding: 10px;
        outline: none;
        font-size: 18px;
    }
`;