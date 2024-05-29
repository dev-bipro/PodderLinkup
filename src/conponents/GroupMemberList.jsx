import React, { useEffect, useState } from 'react'
import Heading from './Heading'
import Flex from './Flex'
import Image from './Image'
import Paragraph from './Paragraph'
import Button from '@mui/material/Button';
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database'
import { useSelector } from 'react-redux'

const GroupMemberList = ({groupReqId}) => {
  const db = getDatabase();
  const logedinData = useSelector((state) => state.logedin.value)
  const [groupMemberListArr, setGroupMemberListArr] = useState([]);

  useEffect(() => {
    onValue(ref(db, "groupMember"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        // console.log(item.val().senderId);
        if (item.val().groupId === groupReqId) {
          arr.push({ ...item.val(), key: item.key })
        }
      })
      setGroupMemberListArr(arr);
    })
  }, [])


  const deleteGroupMemberHandler = (item) => {
    // groupReqListArr.find((el)=> el.requestFromId === logedinData.uid && el.groupId === item.key)
    // groupReqListArr.map((itm)=> {
    //   if (itm.groupId == item.key && itm.requestFromId === logedinData.uid) {

        remove(ref(db, "groupMember/" + item))
    //   }
    // })
  }
  return (
    <section id="userBox">
    <Heading tagName="h3" className="userBoxHeading" title="friend list" />
    <div className="usersBox">
        {
            groupMemberListArr.map((item, index)=>{

                return(

                    <Flex key={index} className="user">
                        <Flex className="userImageFlex">
                            <div className="userImageDiv">
                                <Image className="userImage" imageUrl={item.memberImage} />
                            </div>
                            <div className="userNameContent">
                                <Heading tagName="h5" className="userName" title={item.memberName}>
                                    <Paragraph className="userTime" title="hahaha" />
                                </Heading>
                            </div>
                        </Flex>
                        <Flex className="friendsRequestBtnFlex">
                            <Button onClick={()=>deleteGroupMemberHandler(item.key)} className="addFriendBtn" color="error" variant="contained">delete</Button>

                        </Flex>
                            
                    </Flex>
                )

            })
        }
    </div>
</section>
  )
}

export default GroupMemberList