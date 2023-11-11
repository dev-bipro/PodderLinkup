import React from 'react'
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Container from '../Container';
import User from '../User';
import FriendRequest from '../FriendRequest';
import Friends from '../Friends';
import BlockFriends from '../BlockFriends';

const ProfileFriendsDettels = () => {
    // const Item = styled(Paper)(({ theme }) => ({
    //     backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    //     ...theme.typography.body2,
    //     padding: theme.spacing(1),
    //     textAlign: 'center',
    //     color: theme.palette.text.secondary,
    // }));

  return (
    <section>
        <Container>

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <User />
                </Grid>
                <Grid item xs={6}>
                    <FriendRequest />
                </Grid>
                <Grid item xs={6}>
                    <Friends />
                </Grid>
                <Grid item xs={6}>
                    <BlockFriends />
                </Grid>
            </Grid>
        </Container>
    </section>
  )
}

export default ProfileFriendsDettels