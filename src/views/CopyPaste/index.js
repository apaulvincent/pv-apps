import React, { useState, useEffect, useContext } from 'react'

import './copy.scss';


import { FiX, FiArrowLeft, FiPlus, FiArrowRight, FiRotateCcw, FiSave } from "react-icons/fi";

import {
    useHistory,
    Link,
    useParams
  } from "react-router-dom";

import styled from 'styled-components'
import { lighten, darken } from 'polished'

import {getCookie, setCookie, deleteCookie} from '../../utils/cookies'

import Layout from '../Layout'

// deleteCookie('pvCopyPaste')

let pvCopyPaste = getCookie('pvCopyPaste');
let pvCopyPasteItems = pvCopyPaste ? JSON.parse(pvCopyPaste) : []

let maxAge = (24 * 60 * 60 * 1000) * 324 // 24 hours

const CopyPaste = (props) => {

    const [items, setItems] = useState(pvCopyPasteItems);
    const [type, setType] = useState('')
    const [text, setText] = useState('')
    const [copyText, setCopyText] = useState('')

    useEffect(() => {

    }, []);

    const handleAdd = () => {

        if( text.length < 1 ) return;
        if( type.length < 1 ) return;
        if( items.length > 20 ) return;

        let newItem = {
            type: type.trim(),    
            text: text.trim()
        }
    
        let newItems = [
          ...items,
          newItem
        ];

        setCookie('pvCopyPaste', JSON.stringify(newItems), {secure: true, 'max-age': maxAge})

        setItems(newItems)
        setText('')
        setType('')

    }

    const handleDelete = (index) => (e) => {
        let newItems = items.filter((item, i) => index != i)
        setCookie('pvCopyPaste', JSON.stringify(newItems), {secure: true, 'max-age': maxAge})
        setItems(newItems)
    }
    
    const handleChangeText = (e) => {
        setText(e.target.value)
    }
    
    const handleChangeType = (e) => {
        setType(e.target.value)
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
                navigator.clipboard.writeText(item.text)
                setCopyText(item.text)
            }} > 
                <span>{item.type}</span>
                <span>{item.text}</span>
                <button onClick={handleDelete(index)}><FiX /></button>
            </li>
          )
        })
      }

  
    return (

        <Layout type="basic">

            <div className="wrapper">

                <div className="copy-controls">

                    <h2 className="item-controls">
                    <span>Copy / Paste</span>
                    </h2>

                    <ul className="odds">

                        {
                        renderList()
                        }
                        <li className='item-input'> 
                            <input onChange={handleChangeType} onKeyDown={handleKeyPress} value={type} placeholder=":Type" maxLength="40" />
                            <div className='separator'></div>
                            <input onChange={handleChangeText} onKeyDown={handleKeyPress} value={text} placeholder=":Text" maxLength="40" />
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