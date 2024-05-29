import { useEffect, useState } from 'react'
import Heading from './Heading'
import Flex from './Flex'
import Image from './Image'
import Paragraph from './Paragraph'
import Button from '@mui/material/Button';
import { getDatabase, onValue, ref, remove, set } from 'firebase/database'
import { useSelector } from 'react-redux'

const GroupList = () => {
  const db = getDatabase();
  const logedinData = useSelector((state) => state.logedin.value)
  const [groupListArr, setGroupListArr] = useState([]);
  const [groupReqListArr, setGroupReqListArr] = useState([]);
  const [groupMemberListArr, setGroupMemberListArr] = useState([]);


  // IntersectionObserver()
  

  useEffect(() => {
    onValue(ref(db, "groupList"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        // console.log(item.val().senderId);
        if (item.val().ownerId != logedinData.uid) {
          arr.push({ ...item.val(), key: item.key })
        }
      })
      setGroupListArr(arr);
    })
    onValue(ref(db, "groupRequest"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        // console.log(item.val().senderId);
        // if (item.val().ownerId != logedinData.uid) {
          arr.push({ ...item.val(), key: item.key })
        // }
      })
      setGroupReqListArr(arr);
    })
    onValue(ref(db, "groupMember"), (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        // console.log(item.val().senderId);
        // if (item.val().groupId === groupReqId) {
          arr.push({ ...item.val(), key: item.key })
        // }
      })
      setGroupMemberListArr(arr);
    })
  }, [])

  const joinGroupHandler = (item) => {
    set(ref(db, "groupRequest/"+ item.key+logedinData.uid), {
      groupId : item.key,
      requestFromId : logedinData.uid,
      requestFromImage : logedinData.photoURL,
      requestFromName : logedinData.displayName,
    })
  }
  const cancelGroupReqHandler = (item) => {
    // groupReqListArr.find((el)=> el.requestFromId === logedinData.uid && el.groupId === item.key)
    groupReqListArr.map((itm)=> {
      if (itm.groupId == item.key && itm.requestFromId === logedinData.uid) {

        remove(ref(db, "groupRequest/" + itm.key))
      }
    })
  }
  const exitGroupReqHandler = (item) => {
    // groupReqListArr.find((el)=> el.requestFromId === logedinData.uid && el.groupId === item.key)
    groupMemberListArr.map((itm)=> {
      if (itm.groupId == item.key && itm.memberId === logedinData.uid) {

        remove(ref(db, "groupMember/" + itm.key))
      }
    })
  }
  return (
    <section id="userBox">
      <Heading tagName="h3" className="userBoxHeading" title="group list" />
      <div className="usersBox">
        {
          groupListArr.map((item, index) => {

            return (

              <Flex key={index} className="user">
                <Flex className="userImageFlex">
                  <div className="userImageDiv">
                    <Image className="userImage" imageUrl={item.groupImage} />
                  </div>
                  <div className="userNameContent">
                    <Heading tagName="h5" className="userName" title={item.groupName}>
                      <Paragraph className="userTime" title="hahaha" />
                    </Heading>
                  </div>
                </Flex>
                <Flex className="friendsRequestBtnFlex">
                  {
                    groupReqListArr.find((el)=> el.requestFromId === logedinData.uid && el.groupId === item.key) ?
                      <Button onClick={() => cancelGroupReqHandler(item)} className="addFriendBtn" color="error" variant="contained">cancel</Button>
                    :groupMemberListArr.find((el)=> el.memberId === logedinData.uid && el.groupId === item.key) ?
                      <Button onClick={() => exitGroupReqHandler(item)} className="addFriendBtn" color="error" variant="contained">exit ❌</Button>
                    :
                      <Button onClick={() => joinGroupHandler(item)} className="addFriendBtn" variant="contained">join</Button>
                  }

                </Flex>

              </Flex>
            )

          })
        }
      </div>
    </section>
  )
}

export default GroupList