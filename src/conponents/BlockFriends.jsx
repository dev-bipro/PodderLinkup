import React, { useEffect, useState } from 'react'
import Heading from './Heading'
import Flex from './Flex'
import Image from './Image'
import Paragraph from './Paragraph'
import Button from '@mui/material/Button';
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database'
import { useSelector } from 'react-redux'

const BlockFriends = () => {
    const db = getDatabase() ;
    const logedinData = useSelector((state) => state.logedin.value)
    const [blockFriendsArr, setBlockFriendsArr] = useState([]) ;

    useEffect(()=>{
        onValue(ref(db,"blockFriends"),(snapshot)=>{
            const arr = [] ;
            snapshot.forEach((item)=>{
                // console.log(item.val().senderId);
                if (item.val().blockByID == logedinData.uid) {
                    arr.push({...item.val(),key:item.key})
                }
            })
            setBlockFriendsArr(arr) ;
        })
    },[])

    
    const unblockFriendHandler = (item)=>{
        console.log(item);
        set(push(ref(db, "friends")),{
            receiverId:item.blockByID,
            receiverImage:item.blockByImage,
            receiverName:item.blockByName,
            senderId:item.blockToID,
            senderImage:item.blockToImage,
            senderName:item.blockToName,
        }).then(()=>{
            remove(ref(db, "blockFriends/" + item.key))
        })
    }
  return (
    <section id="userBox">
        <Heading tagName="h3" className="userBoxHeading" title="block list" />
        <div className="usersBox">
            {
                blockFriendsArr.map((item, index)=>{

                    return(

                        <Flex key={index} className="user">
                            <Flex className="userImageFlex">
                                <div className="userImageDiv">
                                    <Image className="userImage" imageUrl={item.blockToImage} />
                                </div>
                                <div className="userNameContent">
                                    <Heading tagName="h5" className="userName" title={item.blockToName}>
                                        <Paragraph className="userTime" title="hahaha" />
                                    </Heading>
                                </div>
                            </Flex>
                            <Button onClick={()=>unblockFriendHandler(item)} className="addFriendBtn" variant="contained">unblock</Button>
                                
                        </Flex>
                    )

                })
            }
        </div>
    </section>
  )
}

export default BlockFriends