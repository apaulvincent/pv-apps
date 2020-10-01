import React, { useState, useEffect } from 'react'

import styled from 'styled-components'

export default function Pills(props) {

    useEffect(() => {

        return () => {} ;

    }, [])

    const handleClick = (item) => (e) => {
        props.onSelect(item)
    }

    return (
      <Wrapper>
            {
                props.items.map(item =>(
                <div className="pill" key={item} onClick={handleClick(item)}>{item}</div>
                ))

            }
      </Wrapper>
    )
}

Pills.defaultProps = {

}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: rows;
    align-items: center;    

    .pill {
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
