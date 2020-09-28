import React, {useEffect, useContext} from 'react'

import {Route, Switch, Redirect, withRouter} from 'react-router-dom'

import Home from '../views/Home'
import Poker from '../views/Poker'
import Error404 from '../views/Error404'

const Routes = () => {
    return (
        <Switch>

            <Route exact path='/' component={Home} />
            <Route exact path='/poker' component={Poker} />
            <Route exact path='/poker/:roomid' component={Poker} />
            <Route exact path='/im-good' component={Poker} />
            <Route path="*" component={Error404} />

        </Switch>
    );
};

export default withRouter(Routes);