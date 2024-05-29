import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, update } from "firebase/database";
import { getAuth, updateProfile } from "firebase/auth";
import './MyProfile.css'
import Container from '../../conponents/Container'
import Image from '../../conponents/Image'
import {FaRegEdit, FaLocationArrow, FaInstagramSquare, FaWhatsappSquare} from 'react-icons/fa'
import {AiOutlineEdit, AiOutlineFacebook, AiFillLinkedin} from 'react-icons/ai'
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
import { Link } from 'react-router-dom';
import List from '../../conponents/List'
import ListItem from '../../conponents/ListItem'
import ProfileDettals from '../../conponents/profile/ProfileDettals';
import ProfileFriendsDettels from '../../conponents/profile/ProfileFriendsDettels';
import MyPost from '../../conponents/profile/MyPost';
import { GrView } from "react-icons/gr";
import UpdateProfilePic from '../../conponents/profile/UpdateProfilePic';
import UpdateCoverPic from '../../conponents/profile/UpdateCoverPic';


const MyProfile = () => {
  const db = getDatabase() ;
  const auth = getAuth();
  const user = auth.currentUser;
  const logedinData = useSelector(state => state.logedin.value) ;
  const dispatch = useDispatch() ;
  const [myData, setMyData] = useState({}) ;
  const [profilePicEditModal, setProfilePicEditModal] = useState(false) ;
  
  // updateName start
  const [nameForUpdate, setNameForUpdate] = useState("")
  const [nameForUpdateError, setNameForUpdateError] = useState("")
  const [a, setA] = useState("Experienced MERN stack developer proficient in React, Node.js, MongoDB, and Express.js. Skilled in creating responsive, high-performance web applications. Committed to delivering user-friendly, scalable solutions. Strong in frontend and backend development, with a focus on efficiency and quality.")
  
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
          setEditNameOpen(false)
        })
      })
    }
  }
  
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
  const [coverPicModal, setCoverPicModal] = useState(false);
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [contactInfoModalOpen, setContactInfoModalOpen] = useState(false);
  const editNameModalOpenHandler = () => setEditNameOpen(true);
  const contactInfoModalOpenHandler = () => setContactInfoModalOpen(true);
  const handleClose = () => {
    setCoverPicModal(false);
    setEditNameOpen(false);
    setContactInfoModalOpen(false);
    setProfilePicEditModal(false);
  }
  // modal part end
  
  useEffect(()=>{
    const myDataRef = ref(db, 'user/' + logedinData.uid );
    onValue(myDataRef, (snapshot) => {
      setMyData(snapshot.val())
    })
    onValue(ref(db,"friendsRequest"),(snapshot)=>{
        const arr = [] ;
        snapshot.forEach((item)=>{
            // console.log(item.val().senderId);
            if (item.val().receiverId == logedinData.uid) {
                arr.push({...item.val(),key:item.key})
            }
        })
        setFriendsReqestArr(arr) ;
    })
  },[])
  
  // profile details part start
  const [profileShow, setProfileShow] = useState("profile")
  const [friendsRequestArr, setFriendsReqestArr] = useState([]) ;

  // profile details part end


  return (
    <>
      <section id="profileTop">
        <div>
          <Modal
            open={editNameOpen || contactInfoModalOpen || coverPicModal || profilePicEditModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {
                editNameOpen ?
                  <Heading tagName="h2" className="updateNameHeading" title="update your name">
                    <>
                      {
                        nameForUpdateError && <Alert severity="error">{nameForUpdateError}</Alert>
                      }
                      <TextField name='updateName' onChange={changeHandler} type="text" className="regInput" id="outlined-basic" label="Type Your New Name" value={nameForUpdate} variant="outlined" />
                      <Button onClick={updateNameHandler} className="regBtn" variant="contained">update</Button>
                    </>
                  </Heading>
                : contactInfoModalOpen ?
                  <Heading tagName="h3" className="socialMediaHeading" title="contact me">
                    <List className="socialMediaList">
                      <ListItem className="">
                        <Link to="https://www.facebook.com/bug6urster?mibextid=ZbWKwL" target="_blank">
                          <AiOutlineFacebook className="facebookIconItem" />
                        </Link>
                      </ListItem>

                      <ListItem className="">
                        <Link to="https://l.facebook.com/l.php?u=https%3A%2F%2Finstagram.com%2Fbug6urster%3Figshid%3DMzMyNGUyNmU2YQ%253D%253D%26fbclid%3DIwAR3uGCCnggEDx1AtW-f_lKngKGU9x56fSg1NbXuRza7UJnDCW5yMPQhGH0I&h=AT0kRaYSHCnbjylCexYR3gBN7_6d6KhtjiuV9DLe0y_bbpdmT5ftU7-VRoa4Os5CI46T83l4k_ljlyMkeypnKeLiaQtVnZ_UenRTsHN7CaSdj4YYn6AWUFsyValhIOmAeU2e6OMQ_g4" target="_blank">
                          <FaInstagramSquare className="instagramIconItem" />
                        </Link>
                      </ListItem>

                      <ListItem className="">
                        <Link>
                          <AiFillLinkedin className="linkedinIconItem" />
                        </Link>
                      </ListItem>

                      <ListItem className="">
                        <Link>
                          <FaWhatsappSquare className="whatsappIconItem" />
                        </Link>
                      </ListItem>
                    </List>
                  </Heading>
                : coverPicModal ?
                  <UpdateCoverPic />
                :
                  <UpdateProfilePic />
              }
            </Box>
          </Modal>
        </div>
        <Container>
          <div className="coverPicDiv">
            <Image className="coverPic" imageUrl={myData?.coverPhotoURL} />
            <Flex onClick={()=> setCoverPicModal(true)} className="editCoverImage">
              <FaRegEdit />
              <Paragraph className="" title="edit cover photo" />
            </Flex>
          </div>
          <div className="profileDittals">
            <Flex className="profiledittalsFlex">
              <div className="profilePhotoDiv">
                <div className="profileEditAndView">
                  <Flex className="profilePicControler">
                    <GrView />
                    <Paragraph title="view picture" />
                  </Flex>
                  <Flex onClick={() => setProfilePicEditModal(true)} className="profilePicControler">
                    <FaRegEdit />
                    <Paragraph title="change picture" />
                  </Flex>
                </div>
                <Image className="profilePhoto" imageUrl={logedinData.photoURL} />
              </div>
              <div className="nameAndBio">
                <Flex className="profileNameFlexParrent">
                  <Flex className="profileNameFlex">
                    <Heading tagName="h2" className="profileName" title={logedinData.displayName}>
                      <AiOutlineEdit className="editProfileName" onClick={editNameModalOpenHandler} title="Edit Your Name" />
                    </Heading>

                  </Flex>
                  <Flex className="profileLocationFlex">
                    <FaLocationArrow />
                    <Paragraph className="" title="Saint Petersburg, Russian Federation" />
                  </Flex>
                </Flex>
                <div className="Bio">
                  <Paragraph className="bioText" title={a} />
                </div>
                <Button onClick={contactInfoModalOpenHandler} className="contactInfoBtn" variant="contained">contact info</Button>
              </div>
            </Flex>
          </div>
        </Container>
      </section>
      <section id="profileBtnSec">
        <Container>
          <List className="profileNavBtnFlex">
            <ListItem onClick={()=>setProfileShow("profile")} className={`proNavBtn ${profileShow == "profile" && "active"}`}>
              <Paragraph className={""} title="profile" />
            </ListItem>
            <ListItem onClick={()=>setProfileShow("friends")} className={`proNavBtn counterRelative ${profileShow == "friends" && "active"}`} >
              <>
                <Paragraph className={""} title="friends" />
                {
                  friendsRequestArr.length ?
                    <Paragraph className="frRequestCount" title={friendsRequestArr.length} />
                  :""
                }
              </>
            </ListItem>
            <ListItem onClick={()=>setProfileShow("post")} className={`proNavBtn ${profileShow == "post" && "active"}`}>
              <Paragraph className={""} title="post" />
            </ListItem>
          </List>
        </Container>
      </section>
      {
        profileShow == "profile" ?
          <ProfileDettals />
        : profileShow == "friends"?
          <ProfileFriendsDettels />
        :
          <Container>
            <MyPost />
          </Container>
      }
    </>
  )
}

export default MyProfile