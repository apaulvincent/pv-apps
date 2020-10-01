import React, {useRef, useState, useCallback, useEffect, useLayoutEffect} from 'react';
import './roulette.scss';

import Wheel from './Wheel';

import { FiX, FiArrowLeft, FiPlus, FiArrowRight, FiRotateCcw, FiSave } from "react-icons/fi";

import {getCookie, setCookie, deleteCookie} from '../../utils/cookies'

import Layout from '../Layout'

let cookieOdds = getCookie('pvRouletteOdds');
let cookieDefaultOdds = getCookie('pvRouletteDefaults');

let initialItems = cookieDefaultOdds ? cookieDefaultOdds.split('|') : ['Vianca', 'Joy', 'Dave', 'Paul', 'Paolo', 'Ralph', 'Karl']

let computedOdds = cookieOdds ? cookieOdds.split('|') : initialItems // default

let cookieWedges = getCookie('pvRouletteWedges');
let defaultWedges = cookieWedges ? cookieWedges : 16

function Roulette() {

  const [dim, setDim] = useState(null);

  const [odds, setOdds] = useState(computedOdds);
  const [wedges, setWedges] = useState(parseInt(defaultWedges))

  const [menu, setMenu] = useState(false)
  const [text, setText] = useState('')
  const [winner, setWinner] = useState('')
  const [random, setRandom] = useState( Date.now() )

  const setRef = useCallback(node => {

    if (node) {

        setDim({
          width: node.clientWidth - 40,
          height: node.clientHeight - 40
        })

    }

  }, [])

  const handleDelete = (index) => (e) => {
    let newOdds = odds.filter((odd, i) => index != i)
    setCookie('pvRouletteOdds', newOdds.join('|') )
    setOdds(newOdds)
  }

  const handleAdd = () => {

    if( text.length < 1 ) return;
    if( odds.length > 20 ) return;

    let newOdds = [
      ...odds,
      text.trim()
    ];
    setCookie('pvRouletteOdds', newOdds.join('|') )
    setOdds(newOdds)
    setText('')
  }

  const handleKeyPress = (e) => {
    if(e.keyCode == 13){
          handleAdd()
      }
  }

  const handleOddChange = (e) => {
    setText(e.target.value)
  }

  const handleWedgeChange = (event) => {
    setCookie('pvRouletteWedges', event.target.value)
    setWedges(event.target.value)
  }

  const handleStop = (winner) => {
    setWinner(winner)
  }

  const handleRandom = (winner) => {
    setRandom( Date.now() )
  }

  const handleStart = () => {
    setWinner('')
  }

  
  const toggleMenu = () => {
    setMenu( !menu )
  }

  const handleSaveDefault = () => {
    setCookie('pvRouletteDefaults', odds.join('|') )
  }

  const handleReset = () => {
    
    setCookie('pvRouletteOdds', cookieDefaultOdds)
    setOdds(initialItems)

  }

  const renderList = () => {
    return odds.map( (odd, index) => {
      return(
        <li key={index}> 
              <span>{odd}</span>
              <button onClick={handleDelete(index)}><FiX /></button>
        </li>
      )
    })
  }

  const renderWinner = () => {
      return(
        <div className="winner">
          <h4>WINNER</h4>
          <h1>{winner}</h1>
        </div>
      )
  }


  return (
    <Layout type="basic">
    <div className="wrapper">

      <div className={menu ? 'controls active' : 'controls' }>

          <button className="menu-toggle on" onClick={toggleMenu}><FiArrowLeft/></button>
          <h2 className="item-controls">
            <span>Items</span>
            <button onClick={handleSaveDefault} title="Save items as default"><FiSave/></button> 
            <button onClick={handleReset} title="Reset items"><FiRotateCcw/></button> 
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

          <h2>Wedges {wedges}</h2>

          <input
            type="range"
            name="points"
            className="slider"
            min="10"
            max="20"
            defaultValue={typeof wedges === 'number' ? wedges : 0}
            onChange={handleWedgeChange}
          />

          <div className="randomizer">
            <button onClick={handleRandom}>Randomize</button>
          </div>

          { winner ?
            renderWinner() : null
          }

      </div>

      <div className="roulette" ref={setRef}>

        <button className="menu-toggle off" onClick={toggleMenu}><FiArrowRight/></button>

        {
          dim ? <Wheel wedges={wedges} width={dim.width} height={dim.height} odds={odds} onStart={handleStart} onStop={handleStop} random={random} /> : null
        }

          <div className="winner-mobile">
          { winner ?
            renderWinner() : null
          }
          </div>


      </div>

    </div>
    </Layout>
  );
}

export default Roulette;