import React from 'react'
import './Nav.css'
import Container from '../Container'
import Flex from '../Flex'
import Image from '../Image'
import myLogo from '../../assets/myLogoLikeLinkdin.svg'
import List from '../List'
import ListItem from '../ListItem'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Nav = () => {
    const logedinData = useSelector(state=> state.logedin.value);
    const location = useLocation()
    console.log(location.pathname);
  return (
    <nav id="nav">
        <Container>
            <Flex className="navContent">
                <div className="navLogoDiv">
                    <Image className="navLogo" imageUrl={myLogo} />
                </div>
                <List className="navItems">
                    <ListItem className={location.pathname == "/home"? "active":"navItem"}>
                        <Link to="/home">home</Link>
                    </ListItem>
                    <ListItem className={location.pathname == "/me"? "active":"navItem"}>
                        <Link to="/me">profile</Link>
                    </ListItem>
                </List>
                <Flex className="navProfile">
                    <div className="navProfileImageDiv">
                        <Image className="navProfileImage" imageUrl={logedinData.photoURL} />
                    </div>
                    <Link to="/me">{logedinData.displayName}</Link>
                </Flex>
            </Flex>
        </Container>
    </nav>
  )
}

export default Nav