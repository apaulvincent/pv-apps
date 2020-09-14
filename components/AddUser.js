import React, { useState, useEffect } from 'react'

export default function AddUser(props) {

    const [username, setUsername] = useState('Manok');

  
    const addUsername = e => {

        e.preventDefault();

        if(username == '') return;
        
        props.onAddUser(username);

    };
  
    return (
      <div>
          <input
              type="text"
              onChange={e => {setUsername(e.currentTarget.value)}}
              value={username}
          />
          <button onClick={addUsername} className="btn btn-primary">
              Send
          </button>
      </div>
    )
}

AddUser.defaultProps = {
  onAddUser: () => {},
}
