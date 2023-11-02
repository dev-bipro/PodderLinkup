import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue } from "firebase/database";
import './MyProfile.css'
import Container from '../../conponents/Container'
import Image from '../../conponents/Image'
import {FaRegEdit, FaLocationArrow} from 'react-icons/fa'
import {AiOutlineEdit} from 'react-icons/ai'
import Paragraph from '../../conponents/Paragraph'
import Flex from '../../conponents/Flex'
import Heading from '../../conponents/Heading'
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';

const MyProfile = () => {
  const db = getDatabase() ;
  const logedinData = useSelector(state => state.logedin.value) ;
  const [myData, setMyData] = useState({}) ;

  useEffect(()=>{
    const myDataRef = ref(db, 'user/' + logedinData.uid );
    onValue(myDataRef, (snapshot) => {
      setMyData(snapshot.val())
    })
  },[])

  return (
    <section id="profileTop">
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
                    <AiOutlineEdit className="editProfileName" title="Edit Your Name" />
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