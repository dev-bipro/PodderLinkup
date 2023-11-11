import React, { useEffect, useState } from 'react'
import Heading from './Heading'
import Flex from './Flex'
import Image from './Image'
import Paragraph from './Paragraph'
import Button from '@mui/material/Button';
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database' ;
import { useSelector } from 'react-redux' ;
import {FaUserFriends} from 'react-icons/fa' ;
import {ImBlocked} from 'react-icons/im' ;

const User = () => {
    const db = getDatabase() ;
    const logedinData = useSelector((state) => state.logedin.value)
    const [userArr, setUserArr] = useState([]) ;
    const [friendsRequestArr, setFriendsReqestArr] = useState([]) ;
    const [friendsArr, setFriendsArr] = useState([]) ;
    const [blockFriendsArr, setBlockFriendsArr] = useState([]) ;


    
    useEffect(()=>{

        onValue(ref(db,"user"),(snapshot)=>{
            const arr = [] ;
            snapshot.forEach((item)=>{
                if (item.key != logedinData.uid) {
                    arr.push({...item.val(),key:item.key})
                }
            })
            setUserArr(arr) ;
        })
        onValue(ref(db,"friendsRequest"),(snapshot)=>{
            const arr = [] ;
            snapshot.forEach((item)=>{
                // console.log(item.val().senderId);
                if (item.val().senderId == logedinData.uid || item.val().receiverId == logedinData.uid) {
                    arr.push({...item.val(),key:item.key})
                }
            })
            setFriendsReqestArr(arr) ;
        })
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
        onValue(ref(db,"blockFriends"),(snapshot)=>{
            const arr = [] ;
            snapshot.forEach((item)=>{
                // console.log(item.val().senderId);
                if (item.val().blockByID == logedinData.uid || item.val().blockToID == logedinData.uid) {
                    arr.push({...item.val(),key:item.key})
                }
            })
            setBlockFriendsArr(arr) ;
        })
    },[])
    const sendFriendRequest = (item)=>{
        set(push(ref(db, "friendsRequest")),{
            senderId:logedinData.uid,
            senderImage:logedinData.photoURL,
            senderName:logedinData.displayName,
            receiverId:item.key,
            receiverImage:item.photoURL,
            receiverName:item.fullName,
            
        })
    }
    const cancelFriendRequest = (item)=>{
        friendsRequestArr.map((itm)=>{
            
            // console.log(itm);
            if(itm.receiverId == item.key && logedinData.uid == itm.senderId){
                remove(ref(db,"friendsRequest/"+itm.key))
            };
        })
    }
  return (
    <section id="userBox">
        <Heading tagName="h3" className="userBoxHeading" title="user list" />
        <div className="usersBox">
            {
                userArr.map((item, index)=>{

                    return(

                        <Flex key={index} className="user">
                            <Flex className="userImageFlex">
                                <div className="userImageDiv">
                                    <Image className="userImage" imageUrl={item.photoURL} />
                                </div>
                                <div className="userNameContent">
                                    <Heading tagName="h5" className="userName" title={item.fullName}>
                                        <Paragraph className="userTime" title="hahaha" />
                                    </Heading>
                                </div>
                            </Flex>
                            {
                                friendsRequestArr.find((el)=> el.receiverId == item.key) ?
                                    <Button onClick={()=>cancelFriendRequest(item)} className="addFriendBtn" variant="contained">cancel</Button>
                                :friendsRequestArr.find((el)=> el.senderId == item.key ) ?
                                    <Button className="addFriendBtn" variant="contained">P</Button>
                                :friendsArr.find((el)=> el.senderId == item.key || el.receiverId == item.key) ?
                                    <FaUserFriends className="friendIcon" />
                                :blockFriendsArr.find((el)=> el.blockByID == item.key || el.blockToID == item.key) ?
                                    <ImBlocked className="blockIcon" />
                                :
                                    <Button onClick={()=>sendFriendRequest(item)} className="addFriendBtn" variant="contained">add friend</Button>
                            }
                        </Flex>
                    )

                })
            }
        </div>
    </section>
  )
}

export default User