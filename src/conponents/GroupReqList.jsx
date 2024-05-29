import React, { useEffect, useState } from 'react'
import Heading from './Heading'
import Flex from './Flex'
import Image from './Image'
import Paragraph from './Paragraph'
import Button from '@mui/material/Button';
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database'
import { useSelector } from 'react-redux'

const GroupReqList = ({groupReqId}) => {
  const db = getDatabase();
  const logedinData = useSelector((state) => state.logedin.value)
  const [groupReqListArr, setGroupReqListArr] = useState([]);

  useEffect(() => {
    onValue(ref(db, "groupRequest"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        // console.log(item.val().senderId);
        if (item.val().groupId === groupReqId) {
          arr.push({ ...item.val(), key: item.key })
        }
      })
      setGroupReqListArr(arr);
    })
  }, [])

  const acceptGroupHandler = (item) => {
    set(ref(db, "groupMember/"+ item.key+logedinData.uid), {
      groupId : item.groupId,
      memberId : item.requestFromId,
      memberImage : item.requestFromImage,
      memberName : item.requestFromName,
    }).then(()=> {
        remove(ref(db, "groupRequest/" + item.key))
    })
  }
  const deleteGroupReqHandler = (item) => {
    // groupReqListArr.find((el)=> el.requestFromId === logedinData.uid && el.groupId === item.key)
    // groupReqListArr.map((itm)=> {
    //   if (itm.groupId == item.key && itm.requestFromId === logedinData.uid) {

        remove(ref(db, "groupRequest/" + item))
    //   }
    // })
  }
  return (
    <section id="userBox">
    <Heading tagName="h3" className="userBoxHeading" title="friend list" />
    <div className="usersBox">
        {
            groupReqListArr.map((item, index)=>{

                return(

                    <Flex key={index} className="user">
                        <Flex className="userImageFlex">
                            <div className="userImageDiv">
                                <Image className="userImage" imageUrl={item.requestFromImage} />
                            </div>
                            <div className="userNameContent">
                                <Heading tagName="h5" className="userName" title={item.requestFromName}>
                                    <Paragraph className="userTime" title="hahaha" />
                                </Heading>
                            </div>
                        </Flex>
                        <Flex className="friendsRequestBtnFlex">
                            <Button onClick={()=>acceptGroupHandler(item)} className="addFriendBtn" variant="contained">accept</Button>
                            <Button onClick={()=>deleteGroupReqHandler(item.key)} className="addFriendBtn" color="error" variant="contained">delete</Button>

                        </Flex>
                            
                    </Flex>
                )

            })
        }
    </div>
</section>
  )
}

export default GroupReqList