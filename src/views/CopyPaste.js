import React, { useState, useEffect, useContext } from 'react'

import './Roulette/roulette.scss';


import { FiX, FiArrowLeft, FiPlus, FiArrowRight, FiRotateCcw, FiSave } from "react-icons/fi";

import {
    useHistory,
    Link,
    useParams
  } from "react-router-dom";

import styled from 'styled-components'
import { lighten, darken } from 'polished'

import {getCookie, setCookie, deleteCookie} from '../utils/cookies'

import Layout from './Layout'


let pvCopyPaste = getCookie('pvCopyPaste');
let pvCopyPasteItems = pvCopyPaste ? pvCopyPaste.split('|') : []


const CopyPaste = (props) => {

    const [items, setItems] = useState(pvCopyPasteItems);
    const [text, setText] = useState('')
    const [copyText, setCopyText] = useState('')

    useEffect(() => {

    }, []);

    const handleAdd = () => {

        if( text.length < 1 ) return;
        if( items.length > 20 ) return;
    
        let newItems = [
          ...items,
          text.trim()
        ];
        setCookie('pvCopyPaste', newItems.join('|') )
        setItems(newItems)
        setText('')
    }

    const handleDelete = (index) => (e) => {
        let newItems = items.filter((item, i) => index != i)
        setCookie('pvCopyPaste', newItems.join('|') )
        setItems(newItems)
    }
    
    const handleOddChange = (e) => {
        setText(e.target.value)
    }
    
    const handleKeyPress = (e) => {
        if(e.keyCode == 13){
              handleAdd()
          }
    }

    const renderList = () => {
        return items.map( (item, index) => {
          return(
            <li key={index} onClick={() => {
                navigator.clipboard.writeText(item)
                setCopyText(item)
            }} > 
                <span>{item}</span>
                <button onClick={handleDelete(index)}><FiX /></button>
            </li>
          )
        })
      }

  
    return (

        <Layout type="basic">

            <div className="wrapper">

<div className="controls">

    <h2 className="item-controls">
      <span>Copy / Paste</span>
    </h2>

    <ul className="odds">

        {
        renderList()
        }
        <li> 
            <input onChange={handleOddChange} onKeyDown={handleKeyPress} value={text} placeholder="New Item" maxLength="12" />
            <button onClick={handleAdd}><FiPlus/></button> 
        </li>
    </ul>


</div>

<div className="roulette">

{copyText}
</div>

</div>






        </Layout>
    )
};

export default CopyPaste;


const Wrapper = styled.div `
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    width: 100%;
    height: 100%;
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