import React, { useEffect, useState } from 'react'
import Heading from './Heading'
import Flex from './Flex'
import Image from './Image'
import Paragraph from './Paragraph'
import Button from '@mui/material/Button';
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database'
import { useSelector } from 'react-redux'

const Friends = () => {
    const db = getDatabase() ;
    const logedinData = useSelector((state) => state.logedin.value)
    const [friendsArr, setFriendsArr] = useState([]) ;

    useEffect(()=>{
        onValue(ref(db,"friends"),(snapshot)=>{
            const arr = [] ;
            snapshot.forEach((item)=>{
                // console.log(item.val().senderId);
                if (item.val().receiverId == logedinData.uid || item.val().senderId == logedinData.uid) {
                    arr.push({...item.val(),key:item.key})
                }
            })
            setFriendsArr(arr) ;
        })
    },[])

    const cancelFriend = (item)=>{
        remove(ref(db, "friends/" + item.key))
    }
    const blockFriend = (item)=>{
        set(push(ref(db, "blockFriends")),{
            blockByID:item.receiverId == logedinData.uid  ? item.receiverId :item.senderId,
            blockByImage:item.receiverId == logedinData.uid  ? item.receiverImage :item.senderImage,
            blockByName:item.receiverId == logedinData.uid  ? item.receiverName :item.senderName,
            blockToID:item.receiverId == logedinData.uid  ? item.senderId :item.receiverId,
            blockToImage:item.receiverId == logedinData.uid  ? item.senderImage :item.receiverImage,
            blockToName:item.receiverId == logedinData.uid  ? item.senderName :item.receiverName,
        }).then(()=>{
            remove(ref(db, "friends/" + item.key))
        })
    }
  return (
    <section id="userBox">
        <Heading tagName="h3" className="userBoxHeading" title="friend list" />
        <div className="usersBox">
            {
                friendsArr.map((item, index)=>{

                    return(

                        <Flex key={index} className="user">
                            <Flex className="userImageFlex">
                                <div className="userImageDiv">
                                    <Image className="userImage" imageUrl={item.receiverId==logedinData.uid?item.senderImage:item.receiverImage} />
                                </div>
                                <div className="userNameContent">
                                    <Heading tagName="h5" className="userName" title={item.receiverId==logedinData.uid?item.senderName:item.receiverName}>
                                        <Paragraph className="userTime" title="hahaha" />
                                    </Heading>
                                </div>
                            </Flex>
                            <Flex className="friendsRequestBtnFlex">
                                <Button onClick={()=>blockFriend(item)} className="addFriendBtn" variant="contained">block</Button>
                                <Button onClick={()=>cancelFriend(item)} className="addFriendBtn" color="error" variant="contained">delete</Button>

                            </Flex>
                                
                        </Flex>
                    )

                })
            }
        </div>
    </section>
  )
}

export default Friends