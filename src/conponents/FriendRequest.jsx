import React, { useEffect, useState } from 'react'
import Heading from './Heading'
import Flex from './Flex'
import Image from './Image'
import Paragraph from './Paragraph'
import Button from '@mui/material/Button';
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database'
import { useSelector } from 'react-redux'

const FriendRequest = () => {
    const db = getDatabase() ;
    const logedinData = useSelector((state) => state.logedin.value)
    const [friendsRequestArr, setFriendsReqestArr] = useState([]) ;

    useEffect(()=>{
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

    const cancelFriendRequest = (item)=>{
        remove(ref(db, "friendsRequest/" + item.key))
    }
    const acceptFriendRequest = (item)=>{
        set(push(ref(db, "friends")),{
            ...item
        }).then(()=>{
            remove(ref(db, "friendsRequest/" + item.key))
        })
    }
  return (
    <section id="userBox">
        <Heading tagName="h3" className="userBoxHeading" title="friend request" />
        <div className="usersBox">
            {
                friendsRequestArr.map((item, index)=>{

                    return(

                        <Flex key={index} className="user">
                            <Flex className="userImageFlex">
                                <div className="userImageDiv">
                                    <Image className="userImage" imageUrl={item.senderImage} />
                                </div>
                                <div className="userNameContent">
                                    <Heading tagName="h5" className="userName" title={item.senderName}>
                                        <Paragraph className="userTime" title="hahaha" />
                                    </Heading>
                                </div>
                            </Flex>
                            <Flex className="friendsRequestBtnFlex">
                                <Button onClick={()=>acceptFriendRequest(item)} className="addFriendBtn" variant="contained">accept</Button>
                                <Button onClick={()=>cancelFriendRequest(item)} className="addFriendBtn" color="error" variant="contained">cancel</Button>

                            </Flex>
                                
                        </Flex>
                    )

                })
            }
        </div>
    </section>
  )
}

export default FriendRequest