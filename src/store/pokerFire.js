import React, {createContext, useReducer, useEffect} from 'react'

export const PokerFireContext = createContext();

const initialState = {
    username: null,
    user: null,
    users: [],
    rooms: [],
    messages: [],
    isPlaying: false
}

const reducer = (state, action) => {

    switch(action.type){


            
		default:
		return state;
    }
}


const PokerFireContextProvider = ({children}) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <PokerFireContext.Provider value={[state, dispatch]}>
            {children}
        </PokerFireContext.Provider>
    )
}

export default PokerFireContextProvider