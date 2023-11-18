import React, { useEffect } from 'react'
import './Messages.css'
import Grid from '@mui/material/Grid';
import Container from '../../conponents/Container';
import ChatList from '../../conponents/messages/ChatList';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MessagesBox from '../../conponents/messages/MessagesBox';

const Messages = () => {
    const dispatch = useDispatch() ;
    const logedinData = useSelector((state)=> state.logedin.value) ;
    const navigate = useNavigate() ;

    useEffect(()=>{
        if (!logedinData) {
            navigate("/")
        }
    },[])

      
    return (

        <Container>

            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <ChatList />
                </Grid>
                <Grid item xs={9}>
                    <MessagesBox />
                </Grid>
            </Grid>
        </Container>
    )
}

export default Messages