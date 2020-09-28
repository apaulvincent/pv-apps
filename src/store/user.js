import React, {createContext, useReducer} from 'react'

export const UserContext = createContext();

const initialState = {
    name: '',
}

const reducer = (state, action) => {

    switch(action.type){

        case 'ADD_NAME':
            return {
                name: action.payload,
            }
            
		default:
		return state;
    }
}


const UserContextProvider = ({children}) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <UserContext.Provider value={[state, dispatch]}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider