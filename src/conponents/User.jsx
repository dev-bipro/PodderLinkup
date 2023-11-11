import React, { useEffect, useState } from 'react'
import Heading from './Heading'
import Flex from './Flex'
import Image from './Image'
import Paragraph from './Paragraph'
import Button from '@mui/material/Button';
import { getDatabase, onValue, ref } from 'firebase/database'

const User = () => {
    const db = getDatabase() ;
    const [userArr, setUserArr] = useState([]) ;

    useEffect(()=>{
        onValue(ref(db,"user"),(snapshot)=>{
            const arr = [] ;
            snapshot.forEach((item)=>{
                arr.push({...item.val(),key:item.key})
            })
            setUserArr(arr) ;
            console.log(userArr);
        })
    },[])
  return (
    <div className="userBox">
        <Heading tagName="h3" className="userBoxHeading" title="user list" />
        <div className="usersBox">
            {
                userArr.map((item)=>{

                    return(

                        <Flex className="user">
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
                            <Button onClick={sentFriendRequest} className="addFriendBtn" variant="contained">add friend</Button>
                        </Flex>
                    )

                })
            }
        </div>
    </div>
  )
}

export default User