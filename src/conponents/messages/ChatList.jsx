import React, { useEffect, useState } from 'react'
import Heading from '../Heading'
import { useDispatch, useSelector } from 'react-redux';
import { getDatabase, onValue, ref, set } from 'firebase/database';
// import { ref } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import Flex from '../Flex';
import Image from '../Image';
import Paragraph from '../Paragraph';
import { setActiveChat } from '../../features/activeChat/activeChat';

const ChatList = () => {
    const db = getDatabase() ;
    const dispatch = useDispatch() ;
    const logedinData = useSelector((state)=> state.logedin.value) ;
    const navigate = useNavigate() ;

    const [chatListArr, setChatListArr] = useState([]) ;

    useEffect(()=>{
        onValue(ref(db, "activeChat/"+logedinData.uid),(item)=>{
            // console.log(item.val());
            dispatch(setActiveChat({...item.val()}))
        })
        onValue(ref(db, "friends"),(snapshot)=>{
            const arr = [] ;
            snapshot.forEach((item)=>{
                if (item.val().senderId == logedinData.uid) {
                    arr.push({
                        friendId: item.val().receiverId,
                        friendImage: item.val().receiverImage,
                        friendName: item.val().receiverName,
                        key:item.key
                    })
                }
                else if (item.val().receiverId == logedinData.uid) {
                    arr.push({
                        friendId: item.val().senderId,
                        friendImage: item.val().senderImage,
                        friendName: item.val().senderName,
                        key:item.key
                    })
                }
            })
            setChatListArr(arr)
        })
        
    },[])



    const activeChatHandler = (item)=> {

        dispatch(setActiveChat({
            ...item
        }))
        set(ref(db, "activeChat/"+logedinData.uid),{
            ...item
        })
    }
  return (
    <section id='chatList'>
        <Heading className="chatListBoxHeading" tagName="h3" title="chat list" />
        <div className="chatListBox">
            {
                chatListArr.map((item, index) => {
                    return (

                        <Flex onClick={()=>activeChatHandler(item)} key={index} className="chatlistUser">
                            <Flex className="userImageFlex">
                                <div className="userImageDiv">
                                    <Image className="userImage" imageUrl={item.friendImage} />
                                </div>
                                <div className="userNameContent">
                                    <Heading tagName="h5" className="userName" title={item.friendName}>
                                        <Paragraph className="userTime" title="hahaha" />
                                    </Heading>
                                </div>
                            </Flex>
                            {/* <Flex className="friendsRequestBtnFlex">
                                <Button onClick={()=>blockFriend(item)} className="addFriendBtn" variant="contained">block</Button>
                                <Button onClick={()=>cancelFriend(item)} className="addFriendBtn" color="error" variant="contained">delete</Button>

                            </Flex> */}
                                
                        </Flex>
                    )
                })
            }
        </div>
    </section>
  )
}

export default ChatList