import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, update } from "firebase/database";
import { getAuth, updateProfile } from "firebase/auth";
import './MyProfile.css'
import Container from '../../conponents/Container'
import Image from '../../conponents/Image'
import {FaRegEdit, FaLocationArrow} from 'react-icons/fa'
import {AiOutlineEdit} from 'react-icons/ai'
import Paragraph from '../../conponents/Paragraph'
import Flex from '../../conponents/Flex'
import Heading from '../../conponents/Heading'
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { setLogedIn } from '../../features/logdin/whoLogedin';
import Alert from '@mui/material/Alert';


const MyProfile = () => {
  const db = getDatabase() ;
  const auth = getAuth();
  const user = auth.currentUser;
  const logedinData = useSelector(state => state.logedin.value) ;
  const dispatch = useDispatch() ;
  const [myData, setMyData] = useState({}) ;

  // updateName start
  const [nameForUpdate, setNameForUpdate] = useState("")
  const [nameForUpdateError, setNameForUpdateError] = useState("")
  // updateName end
  
  // modal part start
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "600px",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // modal part end

  useEffect(()=>{
    const myDataRef = ref(db, 'user/' + logedinData.uid );
    onValue(myDataRef, (snapshot) => {
      setMyData(snapshot.val())
    })
  },[])

  const changeHandler = (e)=>{
    setNameForUpdate(e.target.value) ;
    setNameForUpdateError("")
  }

  const updateNameHandler = ()=> {
    if (!nameForUpdate) {
      setNameForUpdateError("Please type your new name")
    }
    else{
      updateProfile(user, {
        displayName: nameForUpdate,
      }).then(() => {
        update(ref(db,"user/" + user.uid),{
          ...myData,
          fullName: nameForUpdate,
        }).then(()=>{
          localStorage.setItem('user',JSON.stringify(user)) ;
          dispatch(setLogedIn(user))
          setNameForUpdate("")
          setOpen(false)
        })
      }).catch((error) => {
        // An error occurred
        // ...
      });
    }
  }

  return (
    <section id="profileTop">
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
          <Heading tagName="h2" className="updateNameHeading" title="update your name">
            <>
              {
                nameForUpdateError && <Alert severity="error">{nameForUpdateError}</Alert>
              }
              <TextField name='updateName' onChange={changeHandler} type="text" className="regInput" id="outlined-basic" label="Type Your New Name" value={nameForUpdate} variant="outlined" />
              <Button onClick={updateNameHandler} className="regBtn" variant="contained">update</Button>
            </>
          </Heading>
          </Box>
        </Modal>
      </div>
      <Container>
        <div className="coverPicDiv">
          <Image className="coverPic" imageUrl={myData?.coverPhotoURL} />
          <div className="editCoverImage">
            <FaRegEdit />
            <Paragraph className="" title="edit cover photo" />
          </div>
        </div>
        <div className="profileDittals">
          <Flex className="profiledittalsFlex">
            <div className="profilePhotoDiv">
              <Image className="profilePhoto" imageUrl={logedinData.photoURL} />
            </div>
            <div className="nameAndBio">
              <Flex className="profileNameFlexParrent">
                <Flex className="profileNameFlex">
                  <Heading tagName="h2" className="profileName" title={logedinData.displayName}>
                    <AiOutlineEdit className="editProfileName" onClick={handleOpen} title="Edit Your Name" />
                  </Heading>

                </Flex>
                <Flex className="profileLocationFlex">
                  <FaLocationArrow />
                  <Paragraph className="" title="Saint Petersburg, Russian Federation" />
                </Flex>
              </Flex>
              <div className="Bio">
                <Paragraph className="" title={""} />
              </div>
              <Button className="regBtn" variant="contained">sign up</Button>
            </div>
          </Flex>
        </div>
      </Container>
    </section>
  )
}

export default MyProfile