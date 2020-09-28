import React, {useState, useContext} from 'react';
import styled from 'styled-components'

import BasicLayout from './BasicLayout'
import RightSidebar from './RightSidebar'

const Layout = (props) => {

    switch (props.type) {
        case 'basic':
            return(<BasicLayout>{props.children}</BasicLayout>)
        case 'right-sidebar':
            return(<RightSidebar>{props.children}</RightSidebar>)
        default:
            return(<BasicLayout>{props.children}</BasicLayout>)
    }

};

export default Layout;