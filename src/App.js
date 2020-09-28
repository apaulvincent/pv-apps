import React from 'react';

import {BrowserRouter} from 'react-router-dom'
import Routes from './routes'

import {UserContextProvider} from './store'

import './assets/styles/app.scss';

function App() {
  return (
      <UserContextProvider>
        <BrowserRouter>
          <Routes/>
        </BrowserRouter>
      </UserContextProvider>
  );
}

export default App;
