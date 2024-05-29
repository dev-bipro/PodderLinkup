import React from 'react'
import './Nav.css'
import Container from '../Container'
import Flex from '../Flex'
import Image from '../Image'
import myLogo from '../../assets/myLogoLikeLinkdin.svg'
import { RiLogoutBoxFill } from "react-icons/ri";
import List from '../List'
import ListItem from '../ListItem'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Paragraph from '../Paragraph'
import { setLogedIn } from '../../features/logdin/whoLogedin'

const Nav = () => {
    const logedinData = useSelector(state=> state.logedin.value);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation()
    console.log(location.pathname);
    const logOutHandler = () => {
        localStorage.removeItem("user") ;
        dispatch(setLogedIn(null)) ;
        navigate("/")

    }
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
                    <ListItem className={location.pathname == "/messages"? "active":"navItem"}>
                        <Link to="/messages">messages</Link>
                    </ListItem>
                    <ListItem className={location.pathname == "/notification"? "active":"navItem"}>
                        <Link to="/notification">notification</Link>
                    </ListItem>
                </List>
                <Flex className="navProfile">
                    <div className="navProfileImageDiv">
                        <Image className="navProfileImage" imageUrl={logedinData.photoURL} />
                    </div>
                    <Link to="/me">{logedinData.displayName}</Link>
                    <div onClick={logOutHandler} className="logoutBtn">
                        <RiLogoutBoxFill />
                        <Paragraph title="log out" />
                    </div>
                </Flex>
            </Flex>
        </Container>
    </nav>
  )
}

export default Nav